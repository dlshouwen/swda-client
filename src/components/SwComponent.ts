import type { App, Plugin } from 'vue'

import SwIcon from '@/components/sw-icon/SwIcon.vue'

const components = [
	SwIcon
]

const SwComponent: Plugin = {
	install(Vue: App) {
		components.forEach((component: any) => {
			Vue.component(component.name, component)
		})
	}
}

export default SwComponent
