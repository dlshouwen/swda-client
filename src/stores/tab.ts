import { defineStore } from 'pinia'
import { RouteLocationNormalizedLoaded } from 'vue-router'

export const useTabStore = defineStore('tabStore', {
	state: () => ({
		visits: [] as any[],
		caches: [] as any[]
	}),
	actions: {
		add(route: RouteLocationNormalizedLoaded) {
			if (this.visits.some(value => value.path === route.path)) {
				return
			}
			this.visits.push(Object.assign({}, route, { title: route.meta?.title || 'unknown' }))
		},
		addCache(route: RouteLocationNormalizedLoaded) {
			if (this.caches.includes(route.name)) {
				return
			}
			if (route.meta.cache) {
				this.caches.push(route.name)
			}
		},
		delete(route: RouteLocationNormalizedLoaded) {
			for (const [index, value] of this.visits.entries()) {
				if (value.path === route.path) {
					this.visits.splice(index, 1)
					break
				}
			}
			this.deleteCache(route).then()
		},
		deleteCache(route: RouteLocationNormalizedLoaded) {
			return new Promise(resolve => {
				const index = this.caches.indexOf(route.name)
				if (index > -1) {
					this.caches.splice(index, 1)
				}
				resolve([...this.caches])
			})
		},
		deleteOther(route: RouteLocationNormalizedLoaded) {
			this.visits = this.visits.filter(r => {
				return r.meta.affix || r.path === route.path
			})
			const index = this.caches.indexOf(view.name)
			if (index > -1) {
				this.caches = this.caches.slice(index, index + 1)
			} else {
				this.caches = []
			}
		},
		deleteAll() {
			this.visits = this.visits.filter(route => route.meta.affix)
			this.caches = []
		}
	}
})