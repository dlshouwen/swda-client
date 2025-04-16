// import pinia
import { defineStore } from 'pinia'

// import vue router elements
import { RouteLocationNormalizedLoaded } from 'vue-router'

// export store
export const useTabStore = defineStore('tabStore', {
	// state
	state: () => ({
		visits: [] as any[],
		caches: [] as any[]
	}),
	// actions
	actions: {
		/**
		 * add
		 * @param route
		 */
		add(route: RouteLocationNormalizedLoaded) {
			// found route from visits
			if (this.visits.some(value => value.path === route.path)) {
				// return
				return
			}
			// push route to visits
			this.visits.push(Object.assign({}, route, { title: route.meta?.title || 'unknown' }))
		},
		/**
		 * add cache
		 * @param route
		 */
		addCache(route: RouteLocationNormalizedLoaded) {
			// found route from caches
			if (this.caches.includes(route.name)) {
				// return
				return
			}
			// need cache
			if (route.meta.cache) {
				// push route to caches
				this.caches.push(route.name)
			}
		},
		/**
		 * delete
		 * @param route
		 */
		delete(route: RouteLocationNormalizedLoaded) {
			// for each visits
			for (const [index, value] of this.visits.entries()) {
				// found route
				if (value.path === route.path) {
					// delete route
					this.visits.splice(index, 1)
					// break
					break
				}
			}
			// delete cache
			this.deleteCache(route).then()
		},
		/**
		 * delete cache
		 * @param route
		 */
		deleteCache(route: RouteLocationNormalizedLoaded) {
			// return promise
			return new Promise(resolve => {
				// find index from caches
				const index = this.caches.indexOf(route.name)
				// found
				if (index > -1) {
					// delete cache
					this.caches.splice(index, 1)
				}
				// resolve
				resolve([...this.caches])
			})
		},
		/**
		 * delete other
		 * @param route
		 */
		deleteOther(route: RouteLocationNormalizedLoaded) {
			// reset visits
			this.visits = this.visits.filter(r => {
				// save affix route and self
				return r.meta.affix || r.path === route.path
			})
			// find cache index
			const index = this.caches.indexOf(route.name)
			// found
			if (index > -1) {
				// delete other caches
				this.caches = this.caches.slice(index, index + 1)
			} else {
				// reset caches
				this.caches = []
			}
		},
		/**
		 * delete all
		 */
		deleteAll() {
			// reset visits
			this.visits = this.visits.filter(route => route.meta.affix)
			// reset caches
			this.caches = []
		}
	}
})