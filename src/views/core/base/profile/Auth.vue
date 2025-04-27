<template>
	<el-dialog v-model="visible" title="账号绑定" width="800">暂未支持</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import emits from '@/utils/emits'

const visible = ref(false)
emits.on('setAuth', () => (visible.value = true))
</script>