<template>
	<!-- panel -->
	<div class="sw-panel" :class="classes">
		<div class="sw-panel-header">
			<div v-if="$slots.title" class="sw-panel-title">
				<sw-icon v-if="props.icon" :icon="props.icon"></sw-icon><slot name="title"></slot>
			</div>
			<div v-if="$slots.operation" class="sw-panel-operation">
				<slot name="operation"></slot>
			</div>
		</div>
		<div class="sw-panel-body">
			<slot v-if="$slots.default"></slot>
		</div>
	</div>
</template>

<script setup name="SwPanel">
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue lements
import { ref, useAttrs } from 'vue'

// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
// get store
const appStore = useAppStore()
const userStore = useUserStore()

// define props
const props = defineProps({
	icon: { default: ()=>'', type:String, required:false },
	flex: { default: ()=>false, type:Boolean, required:false },
})

// const classes
const classes = ref([])

// set classes
classes.value.push(appStore.size)
if(props.flex) classes.value.push('flex')
</script>