import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouterStore } from '@/stores/router'
import { isExternalLink, path2Camel } from '@/utils/tools'

const constantRoutes: RouteRecordRaw[] = [
	{ 
		path: '/login', 
		name: 'Login', 
		component: () => import('@/views/core/login/Login.vue')
	},
	{
		path: '/redirect',
		name: 'Redirect',
		component: () => import('../views/core/layout/Index.vue'),
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('../views/core/page/Redirect.vue')
			}
		]
	},
	{
		path: '/iframe/:query?',
		name: 'Iframe',
		component: () => import('../views/core/page/Iframe.vue')
	},
	{
		path: '/404',
		name: '404',
		component: () => import('../views/core/error/404.vue')
	}
]

const asyncRoute: RouteRecordRaw = {
	path: '/',
	component: () => import('../views/core/layout/Index.vue'),
	children: [
		{
			path: '/profile',
			name: 'Profile',
			component: () => import('../views/core/profile/Profile.vue'),
			meta: {
				title: '个人中心',
				cache: true
			}
		},
		{
			path: '/workbench',
			name: 'Workbench',
			component: () => import('../views/core/workbench/Workbench.vue'),
			meta: {
				title: '工作台',
				cache: true,
				affix: true
			}
		}
	]
}

export const workbenchMenu = [
	{
		id:1,
		name: 'Workbench',
		path: '',
		openStyle: 0,
		icon: 'icon-appstore',
		affix: true
	}
]

export const constantMenu = []

export const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
}

export const router = createRouter({
	history: createWebHistory(),
	routes: constantRoutes
})

const whites = ['/login']

router.beforeEach(async (to, from, next) => {
	
	NProgress.start()
	
	const appStore = useAppStore()
	const userStore = useUserStore()
	const routerStore = useRouterStore()
	
	await appStore.loadAttr()
	await appStore.loadDict()
	
	if(userStore.token) {
		if(to.path === '/login'){
			next('/workbench')
		}else{
			if(userStore.user.userId){
				next()
			}else{
				try{
					await userStore.getLoginUserData()
					await userStore.getLoginUserSystemList()
					await userStore.getLoginUserMenuList()
					await userStore.getLoginUserAuthorityList()
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
				
				routerStore.setSearchMenus(keepAliveRoutes)
				
				next({...to, replace:true})
			}
		}
	}else{
		if(whites.indexOf(to.path) > -1){
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
		if(route.children?.length>0){
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
	
	menuList.forEach((menu: any) => {
		let component
		let path
		if(menu.children?.length>0){
			component = () => import('@/views/core/layout/Index.vue')
			path = menu.path
		}else{
			if(isIframeUrl(menu)){
				component = () => import('@/views/core/page/Iframe.vue')
				path = '/iframe/'+menu.id
			}else{
				component = getDynamicComponent(menu.component)
				path = menu.path
			}
		}
		const route: RouteRecordRaw = {
			path: path,
			name: path2Camel(path),
			component: component,
			children: [],
			meta: {
				title: menu.name,
				icon: menu.icon,
				id: ''+menu.id,
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