/**
 * import create router & create web hash history
 */
import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * export & defined const routes
 */
export const constRoutes = [
	{
		path: '/', name: 'main', component: () => import('@/views/core/layout/Main'), children: [
			{ path: '/core/home', name: 'home', component: () => import('@/views/core/home/Home') },
			{ path: '/core/error/403', name: '403', component: () => import('@/views/core/error/403') },
			{ path: '/core/error/404', name: '404', component: () => import('@/views/core/error/404') },
			{ path: '/core/common/http/:url', name: 'http', component: () => import('@/views/core/common/Http') },
		]
	},
	{ path: '/core/login', name: 'login', component: () => import('@/views/core/login/Login') },
]

/**
 * export new router
 */
export default createRouter({
	base: process.env.BASE_URL,
	history: createWebHashHistory(),
	routes: constRoutes
})