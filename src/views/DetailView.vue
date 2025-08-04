<template>
	<v-card class="pa-4">
		<v-card-title>Деталі населеного пункту</v-card-title>
		<v-card-text v-if="place">
			<div><strong>Назва:</strong> {{ place.display_name }}</div>
		</v-card-text>
		<v-card-actions>
			<v-btn color="primary" @click="$router.push('/')">Назад</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { useMapStore } from '../store/mapStore'

export default {
	setup() {
		const store = useMapStore()
		return { place: store.selectedPlace }
	},
}
</script>
