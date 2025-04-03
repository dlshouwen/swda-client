<template>
	<div class="logo">
		<sw-icon icon="icon-dlshouwen"></sw-icon>
		<h1>{{appStore.attr.header_title}}</h1>
		<el-badge :value="appStore.attr.version" class="item"></el-badge>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

</script>

<style>
.logo{
	
	background:#1f84d9;display:flex;flex-direction:row;height:4rem;color:white;padding:0 1rem;

	.sw-icon{color:white;font-size:3rem;}
	
	h1{line-height:4rem;margin-left:1rem;font-size:1.5rem;}
	
	.el-badge{margin-top:0.5rem;margin-left:0.6rem;}
}

</style>