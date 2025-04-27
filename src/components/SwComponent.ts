// import vue elements
import type { App, Plugin } from 'vue'

// import components
import SwButton from '@/components/sw-permission/SwButton.vue'
import SwLink from '@/components/sw-permission/SwLink.vue'
import SwIcon from '@/components/sw-icon/SwIcon.vue'

// const components
const components = [
	SwButton,
	SwLink,
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