<template>
	<div class="navbar-settings">
		<ma-icon icon="icon-ellipsis-v" @click="visible = true">123123</ma-icon>
		<el-drawer v-model="visible" :title="$t('settings.title')" :destroy-on-close="true" :size="280">
			111
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'


const visible = ref(false)
</script>