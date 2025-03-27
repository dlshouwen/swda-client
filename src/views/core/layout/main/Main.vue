<template>
	<el-scrollbar>
		<el-main class="layout-main">
			<el-scrollbar class="layout-scrollbar">
				<router-view v-slot="{ Component, route }">
					<keep-alive v-if="theme.isTabsCache" :include="[...tabStore.caches]">
						<component :is="Component" :key="route.fullPath" />
					</keep-alive>
					<component :is="Component" v-else :key="route.name" />
				</router-view>
			</el-scrollbar>
		</el-main>
	</el-scrollbar>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useTabStore } from '@/stores/tab'


const appStore = useAppStore()
const tabStore = useTabStore()
const theme = computed(() => appStore.theme)
</script>