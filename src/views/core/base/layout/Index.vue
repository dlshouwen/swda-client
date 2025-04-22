<template>

	<!-- layout -->
	<el-container class="layout-container" :class="appStore.size">
		
		<!-- header -->
		<el-header class="header-container">

			<!-- logo -->
			<Logo v-if="visible.logo"></Logo>
			
			<!-- navbar container -->
			<el-container class="navbar-container" :class="appStore.theme.header.style">
				
				<!-- collapse -->
				<Collapse v-if="visible.collapse"></Collapse>
	
				<!-- breadcrumb -->
				<Breadcrumb v-if="visible.breadcrumb"></Breadcrumb>
	
				<!-- sidebar -->
				<Sidebar v-if="visible.sidebar.header"></Sidebar>
	
				<!-- system -->
				<System v-if="visible.system"></System>
	
				<!-- navbar -->
				<Navbar></Navbar>
			
			</el-container>

		</el-header>
		
		<!-- index -->
		<el-container class="index-container">

			<!-- aside -->
			<el-aside class="aside-container" :class="appStore.theme.sidebar.style" v-if="visible.aside">

				<!-- sidebar -->
				<Sidebar v-if="visible.sidebar.aside"></Sidebar>
				
			</el-aside>	

			<!-- main -->
			<el-main class="main-container">
				
				<!-- tab -->
				<Tab v-if="visible.tab"></Tab>
				
				<!-- main -->
				<Main class="main"></Main>
				
			</el-main>

		</el-container>
		
	</el-container>

	<!-- setting -->
	<Setting />

	<!-- profile -->
	<UserInfo />
	<change-password />
	<Auth />

</template>

<script setup lang="ts">
// import vue elements
import { computed } from 'vue'

// import container components
import Logo from '@/views/core/base/layout/container/Logo.vue'
import Collapse from '@/views/core/base/layout/container/Collapse.vue'
import Breadcrumb from '@/views/core/base/layout/container/Breadcrumb.vue'
import System from '@/views/core/base/layout/container/System.vue'
import Navbar from '@/views/core/base/layout/container/Navbar.vue'
import Sidebar from '@/views/core/base/layout/container/Sidebar.vue'
import Tab from '@/views/core/base/layout/container/Tab.vue'
import Main from '@/views/core/base/layout/container/Main.vue'

// import setting components
import Setting from '@/views/core/base/setting/Setting.vue'

// import profile components
import UserInfo from '@/views/core/base/profile/UserInfo.vue'
import ChangePassword from '@/views/core/base/profile/ChangePassword.vue'
import Auth from '@/views/core/base/profile/Auth.vue'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// computed: visible
const visible: any = computed(()=>{
	// logo
	let logo = appStore.theme.logo.enable
	// collapse
	let collapse = appStore.theme.layout === 'vertical'
	// breadcrumb
	let breadcrumb = appStore.theme.header.breadcrumb && appStore.theme.layout !== 'horizontal' && appStore.theme.system !== 'expand'
	// system
	let system = appStore.theme.layout !== 'horizontal'
	// aside
	let aside = appStore.theme.layout !== 'horizontal'
	// tab
	let tab = appStore.theme.tab.enable
	// sidebar
	let sidebar = {
		header: appStore.theme.layout === 'horizontal',
		aside: appStore.theme.layout !== 'horizontal'
	}
	// return
	return { logo, collapse, breadcrumb, system, aside, tab, sidebar }
})
</script>