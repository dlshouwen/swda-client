<template>
		<el-drawer v-model="visible" :title="$t('settings.title')" :destroy-on-close="true" :size="280">
			123123
		</el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'


const visible = ref(false)
</script>