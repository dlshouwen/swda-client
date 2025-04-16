// import vue elements
import type { App, Plugin } from 'vue'

// import components
import SwIcon from '@/components/sw-icon/SwIcon.vue'

// const components
const components = [
	SwIcon
]

// regist components
const SwComponent: Plugin = {
	// install
	install(Vue: App) {
		// for each components
		components.forEach((component: any) => {
			// install component
			Vue.component(component.name, component)
		})
	}
}

// export
export default SwComponent