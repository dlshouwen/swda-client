<template>
	<!-- if has permission or no permission but show -->
	<span v-if="dataStore.attr.show_button_when_no_limit=='1'||!forbidden">
		<!-- el button -->
		<el-button :disabled="disabled" :title="title" v-bind="$attrs"><slot></slot></el-button>
	</span>
</template>

<script setup>
// cancel inherit attrs
defineOptions({ inheritAttrs: false });

// import vue: reactive & to refs & use attrs
import { reactive, toRefs, useAttrs } from 'vue'

// const attrs
const attrs = useAttrs()

//import store: data & user
import { useDataStore } from '@/store/data'
import { useUserStore } from '@/store/user'
//get store: data & user
const dataStore = useDataStore();
const userStore = useUserStore();

// define props
const props = defineProps({permission: { default: '', required: false }})

// const state
const state = reactive({
	// forbidden
	forbidden: false,
	// disabled
	disabled: false,
	// title
	title: null,
});

// to refs
const { forbidden, disabled, title } = toRefs(state);

// permission valid & store value valid & permission in store value & user values not in permission
if (props.permission&&dataStore.value&&dataStore.value[props.permission]&&!userStore.values[props.permission]){
	// set forbidden
	state.forbidden = true;
	// set disabled
	state.disabled = true;
	// set title
	state.title = '您无权访问此功能';
}else{
	// set forbidden
	state.forbidden = false;
	// set disabled
	state.disabled = attrs.disabled;
	// set title
	state.title = attrs.title;
}
</script>