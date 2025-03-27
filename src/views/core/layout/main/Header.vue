<template>
	<div>
		<a v-for="system in userStore.systemList" :key="system.systemId">{{system.systemName}}</a>
		|
		<a>语言</a>
		|
		<a>全屏</a>
		|
		<a>搜索</a>
		|
		<a>用户</a>
		|
		<a>设置</a>
		|
		<a>退出</a>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
const userStore = useUserStore()
</script>