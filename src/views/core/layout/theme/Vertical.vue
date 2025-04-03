<template>
	<el-container class="container">
		<el-aside class="aside-container">
			<Logo class="logo"></Logo>
			<Sidebar class="sidebar"></Sidebar>
		</el-aside>
		<el-container class="index-container">
			<Header class="header"></Header>
			<Tab class="tab"></Tab>
			<Main class="main"></Main>
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
.container{
	
	height:100%;display:flex;flex-direction:row;
	
	.aside-container{
		
		width:20rem;display:flex;flex-direction:column;
		
		.logo{height:4rem;}
		
		.sidebar{flex:1;}
		
	}
	
	.index-container{
		
		display:flex;flex-direction:column;
		
		.header{height:4rem;}
		
		.main{flex:1;}
		
	}
	
	
}
</style>