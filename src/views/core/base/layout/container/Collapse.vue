<template>

	<!-- collapse -->
	<div class="operate" :title="appStore.theme.sidebar.collapse?$t('header.operate.sidebar.open'):$t('header.operate.sidebar.close')" @click="setSidebarCollapse">
		<sw-icon :icon="appStore.theme.sidebar.collapse?'indent':'outdent'" />
	</div>

</template>

<script setup lang="ts">
// import vue elements
import { nextTick, ref, reactive } from 'vue'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

/**
 * set sidebar collapse
 */
const setSidebarCollapse = ()=>{
	// get theme
	const theme = appStore.theme
	// set sidebar collapse
	theme.sidebar.collapse = !theme.sidebar.collapse
	// set sidebar
	appStore.setTheme(theme)
}

</script>
