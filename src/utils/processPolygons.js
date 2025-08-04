import * as turf from '@turf/turf'
import { reverseGeocode } from '../services/nominatim'
import { useMapStore } from '../store/mapStore'

export async function processPolygons(rawPolygons) {
	const store = useMapStore()
	const results = []

	for (let i = 0; i < rawPolygons.length; i++) {
		const poly = rawPolygons[i]

		const coordinates = poly.polygon.map(p => [p.lng, p.lat])
		const geojson = {
			type: 'Feature',
			properties: { id: poly.id, name: poly.name },
			geometry: {
				type: 'Polygon',
				coordinates: [coordinates],
			},
		}

		const center = turf.centroid(geojson)
		const [lon, lat] = center.geometry.coordinates

		let place = store.cachedPlaces.find(p => p.lat === lat && p.lon === lon)

		if (!place) {
			place = await reverseGeocode(lat, lon)
			if (place) store.cachePlace({ ...place, lat, lon })
		}

		if (place) {
			results.push({
				geojson,
				color: `hsl(${(i * 60) % 360}, 80%, 60%)`,
				center: [lat, lon],
				place,
			})
		}
	}

	return results
}
