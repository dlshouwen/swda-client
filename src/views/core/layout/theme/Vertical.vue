<template>
	<el-container class="container">
		<el-aside width="200px">
			<Logo></Logo>
			<Sidebar></Sidebar>
		</el-aside>
		<el-container>
			<el-header>
				<Header class="header-container"></Header>
				<Tab></Tab>
			</el-header>
			<el-container>
				<el-main><Main></Main></el-main>
			</el-container>
		</el-container>
	</el-container>
	<Setting v-if="false" />
</template>

<script setup lang="ts">
import Logo from '@/views/core/layout/main/Logo.vue'
import Header from '@/views/core/layout/main/Header.vue'
import Sidebar from '@/views/core/layout/main/Sidebar.vue'
import Tab from '@/views/core/layout/main/Tab.vue'
import Main from '@/views/core/layout/main/Main.vue'
import Setting from '@/views/core/layout/main/Setting.vue'
</script>

<style lang="scss" scoped>
.container{height:100%;}
</style>