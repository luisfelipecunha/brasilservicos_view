import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/servicos',
		name: 'Servicos',
		components: {
			default: () => import('@/views/servicos/TelaDeServicos.vue'),
		},
	},
	{
		path: '/pedidos',
		name: 'Pedidos',
		components: {
			default: () => import('@/views/pedidos/TelaDePedidos.vue'),
		},
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
