<template>
	<div style="display: flex">
		<Sidebar />

		<l-map
			ref="map"
			:zoom="6"
			:center="mapCenter"
			style="height: 100vh; width: 100%"
			@ready="onMapReady"
		>
			<l-tile-layer :url="tileUrl" :attribution="tileAttr" />

			<l-geo-json
				v-if="store.selectedPlace"
				:geojson="store.selectedPlace.geojson"
				:options-style="() => ({ color: 'red', weight: 3 })"
			/>

			<l-geo-json
				v-else
				v-for="(poly, idx) in store.polygons"
				:key="idx"
				:geojson="poly.geojson"
				:options-style="() => ({ color: poly.color, weight: 2 })"
			/>
		</l-map>
	</div>
</template>

<script>
import * as turf from '@turf/turf'
import { LGeoJson, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import { nextTick, onMounted, ref, watch } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import { useMapStore } from '../store/mapStore'

export default {
	components: { LMap, LTileLayer, LGeoJson, Sidebar },
	setup() {
		const store = useMapStore()
		const map = ref(null)
		const mapInstance = ref(null)

		const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		const tileAttr = '&copy; OpenStreetMap contributors'

		const mapCenter = ref([48.3794, 31.1656]) // початковий центр

		function onMapReady(leafletMap) {
			mapInstance.value = leafletMap
			fitMapToPolygons()
		}

		async function fitMapToPolygons() {
			if (!mapInstance.value) return
			if (!store.polygons.length) return

			const featureCollection = turf.featureCollection(
				store.polygons.map(p => p.geojson)
			)
			const bbox = turf.bbox(featureCollection)

			await nextTick()

			mapInstance.value.fitBounds([
				[bbox[1], bbox[0]], // SW
				[bbox[3], bbox[2]], // NE
			])
		}

		watch(
			() => store.selectedPlace,
			newPlace => {
				if (newPlace && mapInstance.value) {
					const bounds = L.geoJSON(newPlace.geojson).getBounds()
					mapInstance.value.fitBounds(bounds, { maxZoom: 15 })
				} else if (!newPlace) {
					fitMapToPolygons()
				}
			}
		)

		onMounted(async () => {
			await store.initPolygons()
			fitMapToPolygons()
		})

		return {
			tileUrl,
			tileAttr,
			store,
			map,
			mapCenter,
			onMapReady,
		}
	},
}
</script>
