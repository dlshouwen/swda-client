<template>
	<el-form ref="form" v-bind="{ ...props, ...$attrs }"><slot></slot></el-form>
</template>

<script setup>
// import vue: ref & on mounted & get current instance
import { ref, onMounted, getCurrentInstance } from 'vue'

// props
const props = defineProps({
	'label-width':{ default: '80px' },
	'show-message':{ default: false },
	':status-icon':{ default: false }
});

// ref
const form = ref();

// instance
const instance = getCurrentInstance()

// mounted
onMounted(() => {
	// set form exposed to instance
	const entries = Object.entries(form.value.$.exposed)
	for (const [key, value] of entries) {
		instance.exposed[key] = value
	}
})
</script>