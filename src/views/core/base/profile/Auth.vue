<template>
	<el-dialog v-model="visible" title="Shipping address" width="800">
		set auth
	  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import emits from '@/utils/emits'

const visible = ref(false)
emits.on('setAuth', () => (visible.value = true))
</script>