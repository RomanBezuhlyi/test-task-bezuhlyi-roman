import { createRouter, createWebHashHistory } from 'vue-router'
import DetailView from '../views/DetailView.vue'
import MapView from '../views/MapView.vue'

const routes = [
	{ path: '/', component: MapView },
	{ path: '/detail/:id', component: DetailView },
]

export default createRouter({
	history: createWebHashHistory(),
	routes,
})
