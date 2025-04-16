// import pinia
import { defineStore } from 'pinia'

// import vue router elements
import { RouteRecordRaw } from 'vue-router'

// export store
export const useRouteStore = defineStore('routeStore', {
	// state
	state: () => ({
		searchs: [] as RouteRecordRaw[],
		routes: [] as RouteRecordRaw[]
	}),
	// actions
	actions: {
		/**
		 * set searchs
		 * @param routes
		 */
		setSearchs(routers: RouteRecordRaw[]) {
			// set searchs
			this.searchs = routers
		},
		/**
		 * set routes
		 * @param routes
		 */
		setRoutes(routers: RouteRecordRaw[]) {
			// set routes
			this.routes = routers
		}
	}
})