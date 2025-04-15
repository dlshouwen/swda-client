// import router element
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// import progress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouteStore } from '@/stores/route'

// import tools
import { isExternalLink, path2Camel } from '@/utils/tools'

// defined constant routes
const constantRoutes: RouteRecordRaw[] = [
	{ path: '/login', name: 'Login', component: () => import('@/views/core/login/Login.vue') },
	{ path: '/redirect', name: 'Redirect', component: () => import('../views/core/layout/Index.vue'), children: [
		{ path: '/redirect/:path(.*)', component: () => import('../views/core/page/Redirect.vue') }
	]},
	{ path: '/iframe/:query?', name: 'Iframe', component: () => import('../views/core/page/Iframe.vue') },
	{ path: '/404', name: '404', component: () => import('../views/core/error/404.vue') }
]

// defined error route
const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
}

// defined async route
const asyncRoute: RouteRecordRaw = { path: '/', component: () => import('../views/core/layout/Index.vue'), children: [
	{ path: '/home', name: 'Home', component: () => import('../views/core/home/Home.vue'), meta: { title: '首页', cache: true, affix: true } }
]}

// defined whites
const whites = ['/login']

// create router
export const router = createRouter({
	history: createWebHistory(),
	routes: constantRoutes
})

// before each
router.beforeEach(async (to, from, next) => {
	// progress start
	NProgress.start()
	// get store
	const appStore = useAppStore()
	const userStore = useUserStore()
	const routeStore = useRouteStore()
	// load attr
	await appStore.loadAttr()
	// load dict
	await appStore.loadDict()
	// has user token
	if(userStore.token) {
		// if to login
		if(to.path === '/login'){
			// to home
			next('/home')
		}else{
			// user store has user id
			if(userStore.user.userId){
				// next
				next()
			}else{
				// try catch
				try{
					// get login user data
					await userStore.getLoginUserData()
					// get login user system list
					await userStore.getLoginUserSystemList()
					// get login user menu list
					await userStore.getLoginUserMenuList()
					// get login user authority list
					await userStore.getLoginUserAuthorityList()
				}catch(error){
					// clear token
					userStore?.setToken('')
					// to login
					next('/login')
					// reject
					return Promise.reject(error)
				}
				// defined routes
				const routes: RouteRecordRaw[] = [];
				// for each user menu
				userStore.menuList.forEach(menu=>{
					// push route
					routes.push(...menu2Routes(menu))
				})
				// async route push
				asyncRoute.children?.push(...routes)
				// add async route
				router.addRoute(asyncRoute)
				// add error route
				router.addRoute(errorRoute)
				// set routes
				routeStore.setRoutes(constantRoutes.concat(asyncRoute))
				// set searchs
				routeStore.setSearchs(routes)
				//next
				next({...to, replace:true})
			}
		}
	}else{
		// is in whites
		if(whites.indexOf(to.path) > -1){
			// next
			next()
		}else{
			// to login
			next('/login')
		}
	}
})

// after each
router.afterEach(()=>{
	// progress done
	NProgress.done()
})

/**
 * menu to route
 * @params menu
 * @returns route
 */
const menu2Routes = (menu: any, breadcrumb: string[] = []): RouteRecordRaw[] => {
	// defined routes
	const routes = []
	// defined path, component
	let path, component
	// if has children
	if(menu.children?.length>0){
		// set path
		path = menu.path
		// set component
		component = () => import('@/views/core/layout/Index.vue')
	}else{
		// if menu is link
		if(menu.openStyle!==1&&isExternalLink(menu.url)){
			// set path
			path = '/iframe/'+menu.id
			// set component
			component = () => import('@/views/core/page/Iframe.vue')
		}else{
			// set path
			path = menu.path
			// set component
			component = import.meta.glob('/src/views/**/**/**/*.vue')[`/src/views/${menu.component}.vue`]
			//component = () => import(`@/src/views/${menu.component}.vue`)
		}
	}
	// set breadcrumb
	breadcrumb.push(menu.name)
	// set route
	const route: RouteRecordRaw = {
		name: path2Camel(path),
		path: path,
		component: component,
		children: [],
		meta: {
			title: menu.name,
			icon: menu.icon,
			id: ''+menu.id,
			cache:true,
			newOpen: menu.openStyle===1,
			affix: menu.affix,
			breadcrumb: breadcrumb
		}
	}
	// if has children	
	if(menu.children?.length>0){
		// for each child
		menu.children?.forEach(sub=>{
			// add to children
			routes.push(...menu2Routes(sub, [...breadcrumb]))
		})
	}else{
		// push route
		routes.push(route)
	}
	return routes
}