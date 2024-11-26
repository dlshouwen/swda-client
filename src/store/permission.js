/**
 * import define store
 */
import { defineStore } from 'pinia'

/**
 * import const routes
 */
import { constRoutes } from '@/router'

/**
 * export
 */
export const usePermissionStore = defineStore('permission', {
	state: () => {
		return {
			routes: [],
			addRoutes: []
		}
	},
	actions: {
		/**
		 * set routes
		 * @param routes
		 */
		setRoutes: (routes) => {
			this.addRoutes = routes
			this.routes = constRoutes[0].children.concat(routes)
		}
	}
})