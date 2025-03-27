<template>
	<Vertical v-if="layout=='vertical'"></Vertical>
	<Setting></Setting>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import Setting from '@/views/core/layout/main/Setting.vue'
import Vertical from '@/views/core/layout/theme/Vertical.vue'

const appStore = useAppStore()

const layout = computed(() => appStore.theme.global.layout)

</script>