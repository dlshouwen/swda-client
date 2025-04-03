<template>
	<div class="container">
		<div class="operates">
			<div class="operate"><sw-icon icon="outdent" /></div>
			<div class="operate"><sw-icon icon="sync" /></div>
		</div>
		<div class="breadcrumb">
			<el-breadcrumb :separator-icon="ArrowRight">
				<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>系统管理</el-breadcrumb-item>
				<el-breadcrumb-item>参数管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="systems">
			<el-select v-model="userStore.systemId" placeholder="Select">
				<template #label="{ label, value }"><sw-icon icon="database" />{{label}}</template>
				<el-option v-for="system in userStore.systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId">
					<sw-icon :icon="system.icon" /> {{system.systemName}}
				</el-option>
			</el-select>
		</div>
		<div class="operates">
			<div class="operate"><sw-icon icon="earth" /></div>
			<div class="operate"><sw-icon icon="expend" /></div>
			<div class="operate"><sw-icon icon="search" /></div>
			<div class="operate"><sw-icon icon="setting" /></div>
			<div class="operate"><sw-icon icon="poweroff" /></div>
			<div class="operate"><sw-icon icon="ellipsis" /></div>
		</div>
	</div>
</template>

<script setup lang="ts">
// import element icons
import { Fold, Refresh, FullScreen, Search, Setting, SwitchButton, More, ArrowRight } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
const userStore = useUserStore()
</script>

<style lang="scss" scoped>
.container{
	
	display:flex;flex-direction:row;border-bottom:0.1rem solid #eee;align-items:center;
	
	.operates{
		
		display:flex;flex-direction:row;align-items:center;height:4rem;
		
		.operate{
			
			display:flex;font-size:1.5rem;color:#666;align-items:center;height:4rem;padding:0 1rem;
			
			&:hover{background:#eee;}
			
		}
		
	}
	
	.el-button{border:0;margin:0;height:3rem;font-size:1.2rem;padding:0 1rem;}
	
	.breadcrumb{flex:1;padding-left:1rem;}
	
	.systems{
		
		margin-right:1rem;
		
		.el-select{width:15rem;
		
			.sw-icon{margin-right:0.6rem;}
			
		}
	
	}
	
}
</style>