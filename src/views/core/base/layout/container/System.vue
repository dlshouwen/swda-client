<template>
	
	<!-- systems -->
	<div class="systems" :class="appStore.theme.system">
		
		<!-- select -->
		<el-select :title="$t('header.operate.system')" v-model="userStore.systemId" placeholder="Select" v-if="appStore.theme.system==='select'">
			<!-- label -->
			<template #label="{ label, value }"><sw-icon icon="database" />{{label}}</template>
			<!-- options -->
			<el-option v-for="system in userStore.systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId">
				<sw-icon :icon="system.icon" /> {{system.systemName}}
			</el-option>
		</el-select>
		
		<!-- expand -->
		<el-menu :default-active="userStore.systemId+''" mode="horizontal" v-if="appStore.theme.system==='expand'">
			<el-menu-item v-for="system in userStore.systemList" :key="system.systemId" :index="system.systemId+''" @click="userStore.systemId=system.systemId">
				<sw-icon :icon="system.icon" /> {{system.systemName}}
			</el-menu-item>
		</el-menu>
		
	</div>

</template>

<script setup lang="ts">
// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// get stores
const appStore = useAppStore()
const userStore = useUserStore()
</script>