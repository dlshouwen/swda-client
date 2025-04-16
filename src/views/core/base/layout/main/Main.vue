<template>
	<!-- scrollbar -->
	<el-scrollbar>
		<!-- main -->
		<el-main>
			<!-- scrollbar -->
			<el-scrollbar>
				<!-- router view -->
				<router-view v-slot="{ Component, route }">
					<!-- cache: keep alive -->
					<keep-alive v-if="appStore.theme.tab.cache" :include="[...tabStore.caches]">
						<component :is="Component" :key="route.fullPath" />
					</keep-alive>
					<!-- no cache: component -->
					<component v-else :is="Component" :key="route.name" />
				</router-view>
			</el-scrollbar>
		</el-main>
	</el-scrollbar>
</template>

<script setup lang="ts">
// import vue router elements
import { RouterView } from 'vue-router'

// import stores
import { useAppStore } from '@/stores/app'
import { useTabStore } from '@/stores/tab'

// get stores
const appStore = useAppStore()
const tabStore = useTabStore()
</script>