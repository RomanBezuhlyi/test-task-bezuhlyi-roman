import * as turf from '@turf/turf'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import rawPolygons from '../data/polygons.json'
import { reverseGeocode } from '../services/nominatim'

const STORAGE_KEY = 'polygon_centers_cache'

export const useMapStore = defineStore('map', () => {
	const polygons = ref([])
	const places = ref([])
	const selectedPlace = ref(null)
	const isLoading = ref(false)

	function setPolygons(p) {
		polygons.value = p
	}

	function setPlaces(p) {
		places.value = p
	}

	function selectPlace(place) {
		selectedPlace.value = place
	}

	function clearSelectedPlace() {
		selectedPlace.value = null
	}

	function getPlaceByLatLon(lat, lon) {
		return places.value.find(
			p => Number(p.lat) === Number(lat) && Number(p.lon) === Number(lon)
		)
	}

	function addPlace(place) {
		if (!getPlaceByLatLon(place.lat, place.lon)) {
			places.value.push(place)
		}
	}

	async function initPolygons() {
		isLoading.value = true

		const cached = localStorage.getItem(STORAGE_KEY)
		if (cached) {
			const cachedData = JSON.parse(cached)
			setPolygons(cachedData)
			setPlaces(
				cachedData.map(poly => ({
					display_name: poly.display_name,
					lat: poly.center[1], // центр [lat, lon]
					lon: poly.center[0],
					place_id: poly.place_id,
					geojson: poly.geojson,
				}))
			)
			isLoading.value = false
			return
		}

		const enriched = []

		for (let i = 0; i < rawPolygons.length; i++) {
			const item = rawPolygons[i]
			const coords = item.polygon.map(p => [p.lng, p.lat])

			const geojson = {
				type: 'Feature',
				properties: { id: item.id, name: item.name },
				geometry: {
					type: 'Polygon',
					coordinates: [coords],
				},
			}

			const centerCoords = turf.center(geojson).geometry.coordinates // [lon, lat]
			const [lon, lat] = centerCoords

			let place = getPlaceByLatLon(lat, lon)
			if (!place) {
				place = await reverseGeocode(lat, lon)
				addPlace({ ...place, geojson, lat, lon })
			} else {
				place = { ...place, geojson }
			}

			enriched.push({
				geojson,
				color: `hsl(${(i * 60) % 360}, 70%, 60%)`,
				center: [lat, lon], // зручніше [lat, lon]
				display_name: place.display_name,
				place_id: place.place_id,
			})
		}

		setPolygons(enriched)
		setPlaces(
			enriched.map(poly => ({
				display_name: poly.display_name,
				lat: poly.center[0],
				lon: poly.center[1],
				place_id: poly.place_id,
				geojson: poly.geojson,
			}))
		)

		localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched))
		isLoading.value = false
	}

	return {
		polygons,
		places,
		selectedPlace,
		isLoading,
		setPolygons,
		setPlaces,
		selectPlace,
		clearSelectedPlace,
		getPlaceByLatLon,
		addPlace,
		initPolygons,
	}
})
