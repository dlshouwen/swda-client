<template>
	<!-- if has permission or no permission but show -->
	<template v-if="appStore.attr.show_button_when_no_limit==='1'||!forbidden">
		<!-- el button -->
		<el-button :disabled="disabled" :icon="props.elIcon" :title="title" v-bind="$attrs">
			<!-- icon -->
			<sw-icon v-if="props.icon" :icon="props.icon"></sw-icon>
			<!-- label -->
			{{props.label}}
			<!-- slot -->
			<slot></slot>
		</el-button>
		<!-- el divider -->
		<el-divider v-if="divider" direction="vertical"></el-divider>
	</template>
</template>

<script setup name="SwButton">
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue lements
import { ref, useAttrs } from 'vue'

// const attrs
const attrs = useAttrs()

// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
// get store
const appStore = useAppStore()
const userStore = useUserStore()

// define props
const props = defineProps({
	authority: { default: ()=>'', type:String, required:false },
	divider: { default: ()=>false, type:Boolean, required:false },
	elIcon: { default: ()=>'', type:String, required:false },
	icon: { default: ()=>'', type:String, required:false },
	label: { default: ()=>'', type:String, required:false }
})

// const data
const forbidden = ref(false)
const disabled = ref(false)
const title = ref(false)

// no permission
if (props.authority&&!userStore.authorityList.includes(props.authority)){
	// set forbidden
	forbidden.value = true
	// set disabled
	disabled.value = true
	// set title
	title.value = '您无权访问此功能'
}else{
	// set forbidden
	forbidden.value = false
	// set disabled
	disabled.value = attrs.disabled
	// set title
	title.value = attrs.title
}
</script>