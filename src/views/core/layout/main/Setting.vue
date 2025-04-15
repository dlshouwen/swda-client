<template>
		<el-drawer v-model="visible" :title="$t('settings.title')" :destroy-on-close="true" :size="280">
			<el-divider content-position="left">{{ $t('settings.color') }}</el-divider>
			<el-divider content-position="left">{{ $t('settings.interface') }}</el-divider>
			<div class="switch">
				<span>暗黑模式</span>
				<el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange($event)"></el-switch>
			</div>
			<div class="switch">
				<span>侧边栏排他</span>
				<el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange($event)"></el-switch>
			</div>
			<div class="switch">
				<span>显示LOGO</span>
				<el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange($event)"></el-switch>
			</div>
			<div class="switch">
				<span>显示面包屑</span>
				<el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange($event)"></el-switch>
			</div>
			<div class="switch">
				<span>显示标签页</span>
				<el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange($event)"></el-switch>
			</div>
			<div class="switch">
				<span>标签页样式</span>
				<el-select :model-value="modelValue" size="default" style="width: 100px" :disabled="disabled" @change="handleChange($event)">
					<el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"></el-option>
				</el-select>
			</div>
			<div class="switch">
				<span>标签页缓存</span>
				<el-switch :model-value="modelValue" :disabled="disabled" @change="handleChange($event)"></el-switch>
			</div>
			<el-divider content-position="left">{{ $t('settings.interface') }}</el-divider>
			<el-button type="info" size="default" :icon="RefreshRight" @click="handleResetConfig">
										{{ $t('settings.reset') }}
									</el-button>
		</el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import emits from '@/utils/emits'

const visible = ref(false)
emits.on('openSetting', () => (visible.value = true))
</script>