<template>
	<v-app-bar app color="primary" dark>
		<v-btn icon @click="drawer = !drawer">
			<v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
		</v-btn>

		<v-toolbar-title>Пошук полігонів</v-toolbar-title>
	</v-app-bar>

	<v-navigation-drawer v-model="drawer" app :temporary="isMobile" :width="400">
		<v-text-field
			v-model="search"
			label="Пошук"
			dense
			class="mt-2"
			@click:clear="clearSearch"
		/>

		<template v-if="store.selectedPlace">
			<v-card>
				<v-card-title>{{ store.selectedPlace.display_name }}</v-card-title>
				<v-card-text>
					<div><strong>lat:</strong> {{ store.selectedPlace.lat }}</div>
					<div><strong>lon:</strong> {{ store.selectedPlace.lon }}</div>
				</v-card-text>
				<v-card-actions>
					<v-btn color="primary" @click="backToList">Назад</v-btn>
				</v-card-actions>
			</v-card>
		</template>

		<template v-else>
			<v-progress-linear
				v-if="store.isLoading"
				indeterminate
				color="primary"
				class="my-4"
			/>
			<v-list v-else>
				<v-list-item
					v-for="place in filtered"
					:key="place.place_id || place.id"
					@click="select(place)"
					clickable
				>
					<v-list-item-content>
						<v-list-item-title>{{ place.display_name }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</template>
	</v-navigation-drawer>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useMapStore } from '../store/mapStore'

export default {
	setup() {
		const store = useMapStore()
		const search = ref('')
		const drawer = ref(true)
		const isMobile = ref(window.innerWidth < 960)

		function onResize() {
			isMobile.value = window.innerWidth < 960
			drawer.value = !isMobile.value
		}

		onMounted(() => {
			window.addEventListener('resize', onResize)
			onResize()
		})

		onUnmounted(() => {
			window.removeEventListener('resize', onResize)
		})

		function clearSearch() {
			search.value = ''
			store.setPlaces(store.placesBackup || [])
		}

		const filtered = computed(() => {
			const q = search.value.trim().toLowerCase()
			if (!q) {
				return store.placesBackup || store.places
			}
			return (store.placesBackup || store.places).filter(p =>
				(p.display_name || '').toLowerCase().includes(q)
			)
		})

		function select(place) {
			store.selectPlace(place)
			if (isMobile.value) drawer.value = false
		}

		function backToList() {
			store.clearSelectedPlace()
			if (isMobile.value) drawer.value = false
		}

		return {
			search,
			filtered,
			store,
			select,
			backToList,
			drawer,
			isMobile,
			clearSearch,
		}
	},
}
</script>
