<template>
	<Vertical v-if="layout=='vertical'"></Vertical>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Vertical from '@/views/core/layout/theme/Vertical.vue'

const appStore = useAppStore()

const layout = computed(() => appStore.theme.global.layout)

</script>