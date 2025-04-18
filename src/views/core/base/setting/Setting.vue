<template>

	<!-- drawer -->
	<el-drawer v-model="visible" :title="$t('setting.title')" :destroy-on-close="true" :size="360">

		<!-- scrollbar -->
		<el-scrollbar>
		
			<!-- mode: title -->
			<el-divider>{{ $t('setting.theme.mode.title') }}</el-divider>
			<!-- mode: form -->
			<el-form :label-width="labelWidth">
				<!-- mode -->
				<el-form-item :label="$t('setting.theme.mode.label')">
					<el-radio-group v-model="theme.mode" @change="setMode">
						<el-radio-button :label="$t('setting.theme.mode.options.light')" value="light" />
						<el-radio-button :label="$t('setting.theme.mode.options.dark')" value="dark" />
					</el-radio-group>
				</el-form-item>
			</el-form>
		
			<!-- primary: title -->
			<el-divider>{{ $t('setting.theme.primary.title') }}</el-divider>
			<!-- primary: content -->
			<el-space wrap>
				<span v-for="color in colors" class="color" :class="[appStore.size, (theme.primary==color?'active':'')]" :style="`background:${color};`" @click="setPrimary(color)"></span>
			</el-space>
			
			<!-- layout: title -->
			<el-divider>{{ $t('setting.theme.layout.title') }}</el-divider>
			<!-- layout: title -->
			<el-space>
				<el-tooltip :content="$t('setting.theme.layout.options.vertical')" placement="top">
					<div class="layout layout-vertical" :class="theme.layout==='vertical'?'active':''" @click="setLayout('vertical')">
						<div class="layout-logo"></div>
						<div class="layout-sidebar"></div>
						<div class="layout-header"></div>
					</div>
				</el-tooltip>
				<el-tooltip :content="$t('setting.theme.layout.options.horizontal')" placement="top">
					<div class="layout layout-horizontal" :class="theme.layout==='horizontal'?'active':''" @click="setLayout('horizontal')">
						<div class="layout-logo"></div>
						<div class="layout-header"></div>
					</div>
				</el-tooltip>
			</el-space>
			
			<!-- system: title -->
			<el-divider>{{ $t('setting.theme.system.title') }}</el-divider>
			<!-- system: form -->
			<el-form :label-width="labelWidth">
				<!-- system -->
				<el-form-item :label="$t('setting.theme.system.label')">
					<el-radio-group v-model="theme.system" @change="setTheme">
						<el-radio-button :label="$t('setting.theme.system.options.select')" value="select" />
						<el-radio-button :label="$t('setting.theme.system.options.expand')" value="expand" />
					</el-radio-group>
				</el-form-item>
			</el-form>
			
			<!-- logo: title -->
			<el-divider>{{ $t('setting.theme.logo.title') }}</el-divider>
			<!-- logo: form -->
			<el-form :label-width="labelWidth">
				<!-- enable -->
				<el-form-item :label="$t('setting.theme.logo.enable.label')">
					<el-switch v-model="theme.logo.enable" @change="setTheme"></el-switch>
				</el-form-item>
				<!-- style -->
				<el-form-item :label="$t('setting.theme.logo.style.label')">
					<el-radio-group v-model="theme.logo.style" @change="setTheme">
						<el-radio-button :label="$t('setting.theme.logo.style.options.primary')" value="primary" />
						<el-radio-button :label="$t('setting.theme.logo.style.options.light')" value="light" />
						<el-radio-button :label="$t('setting.theme.logo.style.options.dark')" value="dark" />
					</el-radio-group>
				</el-form-item>
			</el-form>
			
			<!-- sidebar: title -->
			<el-divider>{{ $t('setting.theme.sidebar.title') }}</el-divider>
			<!-- sidebar: form -->
			<el-form :label-width="labelWidth">
				<!-- style -->
				<el-form-item :label="$t('setting.theme.sidebar.style.label')">
					<el-radio-group v-model="theme.sidebar.style" @change="setTheme">
						<el-radio-button :label="$t('setting.theme.sidebar.style.options.primary')" value="primary" />
						<el-radio-button :label="$t('setting.theme.sidebar.style.options.light')" value="light" />
						<el-radio-button :label="$t('setting.theme.sidebar.style.options.dark')" value="dark" />
					</el-radio-group>
				</el-form-item>
				<!-- unique -->
				<el-form-item :label="$t('setting.theme.sidebar.unique.label')">
					<el-switch v-model="theme.sidebar.unique" @change="setTheme"></el-switch>
				</el-form-item>
			</el-form>
			
			<!-- header: title -->
			<el-divider>{{ $t('setting.theme.header.title') }}</el-divider>
			<!-- header: form -->
			<el-form :label-width="labelWidth">
				<!-- style -->
				<el-form-item :label="$t('setting.theme.header.style.label')">
					<el-radio-group v-model="theme.header.style" @change="setTheme">
						<el-radio-button :label="$t('setting.theme.header.style.options.primary')" value="primary" />
						<el-radio-button :label="$t('setting.theme.header.style.options.light')" value="light" />
						<el-radio-button :label="$t('setting.theme.header.style.options.dark')" value="dark" />
					</el-radio-group>
				</el-form-item>
				<!-- breadcrumb -->
				<el-form-item :label="$t('setting.theme.header.breadcrumb.label')">
					<el-switch v-model="theme.header.breadcrumb" @change="setTheme"></el-switch>
				</el-form-item>
			</el-form>
			
			<!-- tab: title -->
			<el-divider>{{ $t('setting.theme.tab.title') }}</el-divider>
			<!-- tab: form -->
			<el-form :label-width="labelWidth">
				<!-- enable -->
				<el-form-item :label="$t('setting.theme.tab.enable.label')">
					<el-switch v-model="theme.tab.enable" @change="setTheme"></el-switch>
				</el-form-item>
				<!-- style -->
				<el-form-item :label="$t('setting.theme.tab.style.label')">
					<el-radio-group v-model="theme.tab.style" @change="setTheme">
						<el-radio-button :label="$t('setting.theme.tab.style.options.light')" value="light" />
						<el-radio-button :label="$t('setting.theme.tab.style.options.dark')" value="dark" />
					</el-radio-group>
				</el-form-item>
				<!-- mode -->
				<el-form-item :label="$t('setting.theme.tab.mode.label')">
					<el-radio-group v-model="theme.tab.mode" @change="setTheme">
						<el-radio-button :label="$t('setting.theme.tab.mode.options.single')" value="single" />
						<el-radio-button :label="$t('setting.theme.tab.mode.options.series')" value="series" />
					</el-radio-group>
				</el-form-item>
				<!-- cache -->
				<el-form-item :label="$t('setting.theme.tab.cache.label')">
					<el-switch v-model="theme.tab.cache" @change="setTheme"></el-switch>
				</el-form-item>
			</el-form>
	
			<!-- operate: title -->
			<el-divider></el-divider>
			<!-- reset -->
			<el-button type="danger" size="default" :icon="RefreshRight" style="width:100%;" @click="resetTheme">{{ $t('setting.operate.reset') }}</el-button>
		
		</el-scrollbar>
		
	</el-drawer>

</template>

<script setup lang="ts">
// import vue elements
import { ref, computed } from 'vue'

// import vue elements
import { useDark, useToggle } from '@vueuse/core'

// import element icons
import { RefreshRight } from '@element-plus/icons-vue'

// import theme utils
import { setPrimaryColor } from '@/utils/theme'

// import stores
import { useAppStore } from '@/stores/app'

// import emits
import emits from '@/utils/emits'

// get stores
const appStore = useAppStore()

// const visible
const visible = ref(false)

// const label width
const labelWidth = ref(100)

// const colors
const colors = [
	'#409EFF', '#0BB2D4', '#3E8EF7', '#11C26D', '#17B3A3', 
	'#667AFA', '#997B71', '#9463F7', '#757575', '#EB6709', 
	'#F74584', '#FCB900', '#FF4C52'
]

// open setting
emits.on('openSetting', () => (visible.value = true))

// get theme
const theme = computed(() => appStore.theme)

const isDark = useDark()

const setMode = ()=>{
	// light
	if(theme.value.mode==='light'){
		// set logo
		theme.value.logo.style = 'primary'
		// set header
		theme.value.header.style = 'light'
		// set sidebar
		theme.value.sidebar.style = 'dark'
		// set tab
		theme.value.tab.style = 'light'
		// set dark
		isDark.value = false
	}
	// dark
	if(theme.value.mode==='dark'){
		// set logo
		theme.value.logo.style = 'dark'
		// set header
		theme.value.header.style = 'dark'
		// set sidebar
		theme.value.sidebar.style = 'dark'
		// set tab
		theme.value.tab.style = 'dark'
		// set dark
		isDark.value = true
	}
	// set theme
	setTheme()
}

/**
 * set primary
 * @params color
 */
const setPrimary = (color: string)=>{
	// set primary
	theme.value.primary = color
	// set theme
	appStore.setTheme(theme.value)
	// set primary color
	setPrimaryColor(color)
}

/**
 * set layout
 * @params layout
 */
const setLayout = (layout: string)=>{
	// set layout
	theme.value.layout = layout
	// set theme
	appStore.setTheme(theme.value)
}

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

<style lang="scss" scoped>

::v-deep(.el-drawer) {
		--el-drawer-padding-primary: unset !important;
	}

.layout{
	
	position:relative;width:54px;height:36px;background:#eee;border-radius:3px;cursor:pointer;
	
	.layout-logo{ position:absolute;top:0;left:0;height:20%;background:var(--el-color-primary);border-radius:3px 0 0 0; }
	.layout-sidebar{ position:absolute;top:20%;left:0;height:80%;background:#333;border-radius:0 0 0 3px; }
	.layout-header{ position:absolute;top:0;height:20%;background:#666;border-radius:0 3px 0 0; }
	
	&.layout-vertical{
		.layout-logo{width:30%;}
		.layout-sidebar{width:30%;}
		.layout-header{left:30%;width:70%;}
	}
	
	&.layout-horizontal{
		.layout-logo{width:30%;}
		.layout-header{left:30%;width:70%;}
	}
	
	&.active:after{
		content: '';width: 6px;height: 6px;border-radius: 50%;background-color: var(--el-color-primary);position: absolute;left: 50%;bottom: -12px;
	}
	
}


.color{
	
	position: relative;cursor:pointer;
	
	&.small{height:18px;width:18px;border-radius:2px;}
	&.default{height:24px;width:24px;border-radius:3px;}
	&.large{height:28px;width:28px;border-radius:4px;}
	
	&.active {
		&:after {
			content: url('data:image/svg+xml;charset=utf-8,<svg width="14" height="14" color="rgb(255 255 255)" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-042ca774=""><path fill="currentColor" d="M406.656 706.944L195.84 496.256a32 32 0 10-45.248 45.248l256 256 512-512a32 32 0 00-45.248-45.248L406.592 706.944z"></path></svg>');
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			position: absolute;
			top: 50%;
			left: 50%;
			margin: -8px 0 0 -7px;
			font-size: 14px;
			color: #ffffff;
		}
	}
}

</style>