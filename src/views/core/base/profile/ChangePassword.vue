<template>
	<el-dialog v-model="visible" title="Shipping address" width="800">
		change password
	  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import emits from '@/utils/emits'

const visible = ref(false)
emits.on('changePassword', () => (visible.value = true))
</script>