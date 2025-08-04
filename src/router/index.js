import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import DetailView from '../views/DetailView.vue'

const routes = [
	{ path: '/', component: MapView },
	{ path: '/detail/:id', component: DetailView },
]

export default createRouter({
	history: createWebHistory(),
	routes,
})
