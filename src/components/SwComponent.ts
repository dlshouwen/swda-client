// import vue elements
import type { App, Plugin } from 'vue'

// import table components
import SwTable from '@/components/sw-table/SwTable.vue'
import SwTableColumn from '@/components/sw-table/SwTableColumn.vue'

// import permission components
import SwButton from '@/components/sw-permission/SwButton.vue'
import SwLink from '@/components/sw-permission/SwLink.vue'

// import icon components
import SwIcon from '@/components/sw-icon/SwIcon.vue'

// const components
const components = [ SwTable, SwTableColumn, SwButton, SwLink, SwIcon ]

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