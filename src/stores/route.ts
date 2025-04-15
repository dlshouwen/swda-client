import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { generateRoutes, homeMenu } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { $getLoginUserMenuList } from '@/api/bms/system/permission'

export const useRouteStore = defineStore('routeStore', {
	state: () => ({
		searchs: [] as RouteRecordRaw[],
		routes: [] as RouteRecordRaw[]
	}),
	actions: {
		setSearchs(routers: RouteRecordRaw[]) {
			this.searchs = routers
		},
		setRoutes(routers: RouteRecordRaw[]) {
			this.routes = routers
		}
	}
})