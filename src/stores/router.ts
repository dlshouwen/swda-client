import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { generateRoutes, constantMenu, dashboardMenu } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { getMenuNav } from '@/api/bms/system/menu'

export const useRouterStore = defineStore('routerStore', ()=>{
	
	const menuRoutes: RouteRecordRaw[] = reactive([])
	
	const searchMenus: RouteRecordRaw[] = reactive([])
	
	const routes: RouteRecordRaw[] = reactive([])
	
	const getMenuRoutes = async ()=>{
		const { data } = await getMenuNav()
		const routes = generateRoutes(data)
		
		const dashboardRoutes = generateRoutes(dashboardMenu)
		menuRoutes.push(...dashboardMenu)
		menuRoutes.push(...routes)
		
		const constantRoutes = generateRoutes(constantMenu)
		menuRoutes.push(...constantMenu)
		return menuRoutes
	}
	
	const setSearchMenus = (rs:RouteRecordRaw[])=>{
		searchMenus.clear().push(...rs)
	}
	
	const setRoutes = (rs: RouteRecordRaw[]) =>{
		routes.clear().push(...rs)
	}
	
	return { menuRoutes, searchMenus, routes, getMenuRoutes, setSearchMenus, setRoutes }
	
})