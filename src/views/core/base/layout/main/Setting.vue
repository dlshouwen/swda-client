<template>
	<!-- drawer -->
	<el-drawer v-model="visible" :title="$t('setting.title')" :destroy-on-close="true" :size="320">
		<!-- color -->
		<el-divider content-position="left">{{ $t('setting.color') }}</el-divider>
		
		<!-- interface -->
		<el-divider content-position="left">{{ $t('setting.style') }}</el-divider>
		<!-- theme layout  -->
		<div class="switch">
			<span>{{ $t('setting.theme.system') }}</span>
			<el-radio-group v-model="theme.system" @change="setTheme">
				<el-radio-button :label="$t('options.theme.system.select')" value="select" />
				<el-radio-button :label="$t('options.theme.system.merge')" value="merge" />
			</el-radio-group>
		</div>
		<!-- theme style  -->
		<div class="switch">
			<span>{{ $t('setting.theme.style') }}</span>
			<el-radio-group v-model="theme.style" @change="setTheme">
				<el-radio-button :label="$t('options.theme.style.light')" value="light" />
				<el-radio-button :label="$t('options.theme.style.dark')" value="dark" />
			</el-radio-group>
		</div>
		<!-- theme style  -->
		<div class="switch">
			<span>{{ $t('setting.theme.logo') }}</span>
			<el-switch v-model="theme.logo" @change="setTheme"></el-switch>
		</div>
		<div class="switch">
			<span>{{ $t('setting.theme.breadcrumb') }}</span>
			<el-switch v-model="theme.breadcrumb" @change="setTheme"></el-switch>
		</div>
		<div class="switch">
			<span>{{ $t('setting.theme.sidebar.unique') }}</span>
			<el-switch v-model="theme.sidebar.unique" @change="setTheme"></el-switch>
		</div>
		<div class="switch">
			<span>{{ $t('setting.theme.tab.enable') }}</span>
			<el-switch v-model="theme.tab.enable" @change="setTheme"></el-switch>
		</div>
		<div class="switch">
			<span>{{ $t('setting.theme.tab.style') }}</span>
			<el-switch v-model="theme.tab.style" @change="setTheme"></el-switch>
		</div>
		<div class="switch">
			<span>{{ $t('setting.theme.tab.cache') }}</span>
			<el-switch v-model="theme.tab.cache" @change="setTheme"></el-switch>
		</div>
		<el-divider content-position="left">{{ $t('setting.operate') }}</el-divider>
		<el-button type="danger" size="default" :icon="RefreshRight" @click="resetTheme">
			{{ $t('setting.reset') }}
		</el-button>
	</el-drawer>
</template>

<script setup lang="ts">
// import vue elements
import { ref, computed } from 'vue'

// import element icons
import { RefreshRight } from '@element-plus/icons-vue'

// import stores
import { useAppStore } from '@/stores/app'

// import emits
import emits from '@/utils/emits'

// get stores
const appStore = useAppStore()

// const visible
const visible = ref(false)

// open setting
emits.on('openSetting', () => (visible.value = true))

// get theme
const theme = computed(() => appStore.theme)

/**
 * set theme
 */
const setTheme = ()=>{
	// set theme
	appStore.setTheme(theme.value)
}

/**
 * reset theme
 */
const resetTheme = ()=>{
	// set theme null
	appStore.setTheme(null)
	// refresh
	window.location.reload()
}
</script>