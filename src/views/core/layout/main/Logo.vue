<template>
	<div class="logo">
		<i class="icon-dlshouwen"></i>
		<h1>{{appStore.attr.header_title}}</h1>
		<el-badge :value="appStore.attr.version" class="item">
		</el-badge>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

</script>

<style>
.logo{background:#999;}
</style>