// import vue elements
import type { App, Plugin } from 'vue'

// import form item components
import SwSelectSystem from '@/components/sw-form-item/SwSelectSystem.vue'
import SwSelectRole from '@/components/sw-form-item/SwSelectRole.vue'
import SwSelectOrgan from '@/components/sw-form-item/SwSelectOrgan.vue'
import SwSelectPost from '@/components/sw-form-item/SwSelectPost.vue'
import SwInput from '@/components/sw-form-item/SwInput.vue'
import SwRadioGroup from '@/components/sw-form-item/SwRadioGroup.vue'

// import table components
import SwTable from '@/components/sw-table/SwTable.vue'
import SwTableColumn from '@/components/sw-table/SwTableColumn.vue'

// import permission components
import SwButton from '@/components/sw-permission/SwButton.vue'
import SwLink from '@/components/sw-permission/SwLink.vue'

// import icon components
import SwIcon from '@/components/sw-icon/SwIcon.vue'

// const components
const components = [ SwSelectSystem, SwSelectRole, SwSelectOrgan, SwSelectPost, SwInput, SwRadioGroup, SwTable, SwTableColumn, SwButton, SwLink, SwIcon ]

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