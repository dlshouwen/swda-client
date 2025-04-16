<template>
	<!-- logo -->
	<div :class="`logo ${appStore.size}`">
		<!-- logo -->
		<sw-icon v-if="!appStore.theme.sidebar.collapse" :icon="appStore.attr.header_icon"></sw-icon>
		<!-- title -->
		<h1>{{appStore.attr.header_title}}</h1>
		<!-- version -->
		<el-badge v-if="!appStore.theme.sidebar.collapse" :value="`v ${appStore.attr.version}`"></el-badge>
	</div>
</template>

<script setup lang="ts">
// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()
</script>

<style>

/** normal */
.logo{
	
	background:var(--el-color-primary);
	display:flex;
	flex-direction:row;
	align-items:center;
	height:56px;
	color:white;

	.sw-icon{
		color:white;
		font-size:36px;
		margin:0 16px;
	}
	
	h1{
		width:56px;
		text-align:center;
		font-size:24px;
		font-weight:normal;
		font-family:consolas;
	}
	
	.el-badge{
		
		margin:-8px 0 0 8px;
		
		.el-badge__content{
			border-radius:4px;
		}
	
	}
}

/** large */
.logo.large{
	
	height:64px;

	.sw-icon{
		font-size:48px;
		margin:0 20px;
	}
	
	h1{
		width:64px;
		font-size:26px;
	}
	
	.el-badge{
		margin:-12px 0 0 12px;
	}

}

/** small */
.logo.small{
	
	height:48px;

	.sw-icon{
		font-size:36px;
		margin:0 12px;
	}
	
	h1{
		width:48px;
		font-size:18px;
	}
	
	.el-badge{
		margin:-4px 0 0 4px;
	}

}

</style>