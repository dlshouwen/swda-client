<template>
	
	<!-- logo -->
	<div class="logo" :class="[(appStore.theme.sidebar.collapse?'collapse':''), appStore.theme.logo.style]">
	
		<!-- icon -->
		<sw-icon v-if="visible.logo" :icon="appStore.attr.header_icon"></sw-icon>
		
		<!-- title -->
		<h1 v-if="visible.title">{{appStore.attr.header_title}}</h1>
		
		<!-- version -->
		<el-badge v-if="visible.version" :value="`v ${appStore.attr.version}`"></el-badge>
	
	</div>

</template>

<script setup lang="ts">
// import vue element
import { computed } from 'vue'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// computed: visible
const visible = computed(()=>{
	// logo
	let logo = !appStore.theme.sidebar.collapse
	// title
	let title = true
	// version
	let version = !appStore.theme.sidebar.collapse
	// return
	return { logo, title, version }
})
</script>