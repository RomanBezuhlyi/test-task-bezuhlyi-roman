<template>
	<v-card
		class="ma-2"
		outlined
		@click="$emit('click')"
		elevation="2"
		style="cursor: pointer"
	>
		<v-card-title>{{ place.display_name }}</v-card-title>
		<v-card-subtitle>ID: {{ place.place_id }}</v-card-subtitle>
	</v-card>
</template>

<script>
export default {
	props: {
		place: Object,
	},
}
</script>
