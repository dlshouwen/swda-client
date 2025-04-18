<template>
	
	<!-- sidebar - vertical -->
	<el-scrollbar v-if="appStore.theme.layout==='vertical'" class="sidebar" :class="{collapse:appStore.theme.sidebar.collapse}">
		<!-- menu -->
		<el-menu :default-active="defaultActive" mode="vertical" :collapse-transition="false"
			:collapse="appStore.theme.sidebar.collapse" :unique-opened="appStore.theme.sidebar.unique">
			<!-- sub menu -->
			<el-sub-menu v-for="menu in userStore.menuList.filter((menu)=>menu.systemId===userStore.systemId)" :index="menu.path">
				<!-- menu title -->
				<template #title>
					<!-- icon -->
					<sw-icon :icon="menu.icon"></sw-icon>
					<!-- name -->
					<span>{{menu.name}}</span>
				</template>
				<!-- menu items -->
				<el-menu-item :class="`sidebar-menu-item ${appStore.size}`" v-for="children in menu.children" :index="children.path" @click="router.push(children.path)"><sw-icon :icon="children.icon"></sw-icon>{{children.name}}</el-menu-item>
			</el-sub-menu>
		</el-menu>
	</el-scrollbar>
	
	<!-- sidebar - horizontal -->
	<div v-if="appStore.theme.layout==='horizontal'" class="sidebar">
		<!-- menu -->
		<el-menu :default-active="defaultActive" mode="horizontal" :collapse-transition="false">
			<!-- system -->
			<el-sub-menu v-for="system in userStore.systemList" :index="system.systemId">
				<!-- system title -->
				<template #title><sw-icon :icon="system.icon"></sw-icon><span>{{system.systemName}}</span></template>
				<!-- sub menu -->
				<el-sub-menu v-for="menu in userStore.menuList.filter((menu)=>menu.systemId===system.systemId)" :index="menu.path" class="sidebar-menu">
					<!-- menu title -->
					<template #title>
						<!-- icon -->
						<sw-icon :icon="menu.icon"></sw-icon>
						<!-- name -->
						<span>{{menu.name}}</span>
					</template>
					<!-- menu items -->
					<el-menu-item :class="`sidebar-menu-item ${appStore.size}`" v-for="children in menu.children" :index="children.path" @click="router.push(children.path)"><sw-icon :icon="children.icon"></sw-icon>{{children.name}}</el-menu-item>
				</el-sub-menu>
			</el-sub-menu>
		</el-menu>
	</div>
	
</template>

<script setup lang="ts">
// import vue element
import { ref, computed, watch, onMounted } from 'vue'

// import vue router
import { useRoute, useRouter } from 'vue-router'

// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// get router
const router = useRouter()
const route = useRoute()

// get stores
const appStore = useAppStore()
const userStore = useUserStore()

// computed default active
const defaultActive = computed(() => route.path)
</script>