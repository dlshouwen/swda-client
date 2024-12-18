import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouterStore } from '@/stores/router'
import { isExternalLink, path2Camel } from '@/utils/tools'
import config from '@/config/config'

const constantRoutes: RouteRecordRaw[] = [
	{
		path: '/redirect',
		component: () => import('../views/core/layout/Index.vue'),
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('../views/core/Redirect.vue')
			}
		]
	},
	{
		path: '/iframe/:query?',
		component: () => import('../views/core/Iframe.vue')
	},
	{
		path: '/login',
		component: () => import('../views/core/Login.vue')
	},
	{
		path: '/404',
		component: () => import('../views/core/error/404.vue')
	}
]

const asyncRoute: RouteRecordRaw = {
	path: '/',
	component: () => import('../views/core/layout/Index.vue'),
	redirect: '/dashboard/index',
	children: [
		{
			path: '/profile',
			name: 'ProfileIndex',
			component: () => import('../views/core/profile/Profile.vue'),
			meta: {
				title: '个人中心',
				cache: true
			}
		}
	]
}

export const dashboardMenu = [
	{
		id:1,
		name: 'Dashboard',
		url: null,
		openStyle: 0,
		icon: 'icon-appstore',
		children: [
			{
				id:101,
				name: '首页',
				url: 'dashboard/index',
				openStyle: 0,
				icon: 'icon-home',
				affix: true
			},
			{
				id: 102,
				name: '工作台',
				url: 'dashboard/workbench',
				openStyle: 0,
				icon: 'icon-appstore'
			}
		]
	}
]

export const constantMenu = []

export const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
}

export const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes
})

const whites = ['/login']

router.beforeEach(async (to, from, next) => {
	
	NProgress.start()
	
	const appStore = useAppStore()
	const userStore = useUserStore()
	const routerStore = useRouterStore()
	
	if(userStore.token) {
		if(to.path === '/login'){
			next('/dashboard/workbench')
		}else{
			if(userStore.user.user_id){
				next()
			}else{
				try{
					await userStore.getUserInfo()
					await userStore.getAuthorityList()
				}catch(error){
					userStore?.setToken('')
					next('/login')
					return Promise.reject(error)
				}
				
				const menuRoutes = await routerStore.getMenuRoutes()
				
				const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])
				
				asyncRoute.children?.push(...keepAliveRoutes)
				router.addRoute(asyncRoute)
				
				router.addRoute(errorRoute)
				
				routerStore.setRoutes(constantRoutes.concat(asyncRoute))
				
				routeStore.setSearchMenu(keepAliveRoutes)
				
				next({...to, replace:true})
			}
		}
	}else{
		if(whites.index(to.path) > -1){
			next()
		}else{
			next('/login')
		}
	}
})

router.afterEach(()=>{
	NProgress.done()
})

export const getKeepAliveRoutes = (rs: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
	const routes: RouteRecordRaw[] = []
	
	rs.forEach((route: RouteRecordRaw) => {
		if(route.meta.title){
			breadcrumb.push(route.meta.title)
		}
		if(item.children?.length>0){
			routes.push(...getKeepAliveRoutes(route.children, breadcrumb))
		}else{
			route.meta.breadcrumb.push(...breadcrumb)
			routes.push(route)
		}
		breadcrumb.pop()
	})
	return routes
}

export const layoutModules = () => {
	return import.meta.glob('/src/views/**/**/**/*.vue')
}

const getDynamicComponent = (path: string): any => {
	const modules = layoutModules()
	return modules[`/src/views/${path}.vue`]
}

export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
	const routes: RouteRecordRaw[] = []
	
	menuList.foreach((menu: any) => {
		let component
		let path
		if(menu.children?.length>0){
			component = () => import('@/views/core/layout/Index.vue')
			path = '/p/'+menu.id
		}else{
			if(isIframeUrl(menu)){
				component = () => import('@/views/core/Iframe.vue')
				path = '/iframe/'+menu.id
			}else{
				component = getDynamicComponent(menu.url)
				path = '/'+menu.url
			}
		}
		const route: RouteRecordRaw = {
			path: path,
			name: path2Camel(path),
			component: component,
			children: [],
			meta: {
				title: menu.menu_name,
				icon: menu.icon,
				id: ''+menu.menu_id,
				cache:true,
				newOpen: menu.openStyle===1,
				affix: menu.affix,
				breadcrumb: []
			}
		}
		
		if(menu.children?.length>0){
			route.children?.push(...generateRoutes(menu.children))
		}
		routes.push(route)
	})
	return routes
}

const isIframeUrl = (menu:any): boolean => {
	if(menu.openStyle===1){
		return false
	}
	return isExternalLink(menu.url)
}