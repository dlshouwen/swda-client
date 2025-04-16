<template>
	<el-dialog v-model="visible" title="Shipping address" width="800">
		user info
	  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import emits from '@/utils/emits'

const visible = ref(false)
emits.on('setUserInfo', () => (visible.value = true))
</script>