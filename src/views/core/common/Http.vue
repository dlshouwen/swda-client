<template>
	<div>
		<!-- iframe -->
		<iframe :src="router.currentRoute.value.params.url" style="height:calc( 100vh - 64px );width:100%;margin:0;border:0;"></iframe>
	</div>
</template>

<script setup>
// import use router
import { useRouter } from 'vue-router'
// get router
const router = useRouter()
</script>