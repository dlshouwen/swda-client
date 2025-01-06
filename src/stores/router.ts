import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { generateRoutes, constantMenu, workbenchMenu } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { $getLoginUserMenuList } from '@/api/bms/system/permission'

export const useRouterStore = defineStore('routerStore', {
	state: () => ({
		menuRoutes: [] as RouteRecordRaw[],
		searchMenus: [] as RouteRecordRaw[],
		routes: [] as RouteRecordRaw[]
	}),
	actions: {
		async getMenuRoutes() {
			const { data } = await $getLoginUserMenuList()
			const routes = generateRoutes(data)

			const dashboardRoutes = generateRoutes(workbenchMenu)
			this.menuRoutes.push(...dashboardRoutes)

			this.menuRoutes.push(...routes)

			const constantRoutes = generateRoutes(constantMenu)
			this.menuRoutes.push(...constantRoutes)

			return this.menuRoutes
		},
		setSearchMenus(routers: RouteRecordRaw[]) {
			this.searchMenus = routers
		},
		setRoutes(routers: RouteRecordRaw[]) {
			this.routes = routers
		}
	}
})