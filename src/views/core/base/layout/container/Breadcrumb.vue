<template>

	<!-- breadcrumb -->
	<el-breadcrumb class="breadcrumb" v-if="appStore.theme.header.breadcrumb" :separator-icon="ArrowRight">
		<!-- home -->
		<el-breadcrumb-item :to="{ path: '/home' }">{{ $t('menu.home') }}</el-breadcrumb-item>
		<!-- path -->
		<el-breadcrumb-item v-for="(item, index) in route.meta.breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
	</el-breadcrumb>

</template>

<script setup lang="ts">
// import element icons
import { ArrowRight } from '@element-plus/icons-vue'

// import router
import { useRoute } from 'vue-router'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// get router
const route = useRoute()
</script>
