<template>
	<!-- header -->
	<div :class="`header ${appStore.size}`">
		<!-- operates -->
		<div class="operates">
			<!-- sidebar -->
			<div class="operate" :title="appStore.sidebar?$t('header.operate.sidebar.close'):$t('header.operate.sidebar.open')" @click="setSidebar"><sw-icon :icon="appStore.sidebar?'outdent':'indent'" /></div>
			<!-- refresh -->
			<div class="operate" :title="$t('header.operate.refresh')" @click="refresh"><sw-icon icon="sync" /></div>
		</div>
		<!-- breadcrumb -->
		<div class="breadcrumb">
			<el-breadcrumb :separator-icon="ArrowRight">
				<!-- home -->
				<el-breadcrumb-item :to="{ path: '/home' }">{{ $t('menu.home') }}</el-breadcrumb-item>
				<!-- path -->
				<el-breadcrumb-item v-for="(item, index) in route.meta.breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- systems -->
		<div class="systems">
			<!-- select system -->
			<el-select :title="$t('header.operate.system')" v-model="userStore.systemId" placeholder="Select">
				<!-- label -->
				<template #label="{ label, value }"><sw-icon icon="database" />{{label}}</template>
				<!-- options -->
				<el-option v-for="system in userStore.systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId">
					<sw-icon :icon="system.icon" /> {{system.systemName}}
				</el-option>
			</el-select>
		</div>
		<!-- options -->
		<div class="operates">
			<!-- lang -->
			<el-dropdown :title="$t('header.operate.lang')" class="operate" trigger="click" @command="setLang">
				<sw-icon icon="earth"></sw-icon>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item v-for="lang in langs" :key="lang" :disabled="locale === lang" :command="lang">
							{{ messages[lang].name }}
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<!-- size -->
			<el-dropdown :title="$t('header.operate.size')" class="operate" trigger="click" @command="setSize">
				<sw-icon icon="font-size"></sw-icon>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item :disabled="appStore.size === 'large'" command="large">{{$t('options.size.large')}}</el-dropdown-item>
						<el-dropdown-item :disabled="appStore.size === 'default'" command="default">{{$t('options.size.default')}}</el-dropdown-item>
						<el-dropdown-item :disabled="appStore.size === 'small'" command="small">{{$t('options.size.small')}}</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<!-- fullscreen -->
			<div class="operate" :title="isFullscreen?$t('header.operate.fullscreen.close'):$t('header.operate.fullscreen.open')" @click="toggle"><sw-icon :icon="isFullscreen?'fullscreen-exit':'fullscreen'" /></div>
			<!-- search -->
			<div class="operate" :title="$t('header.operate.search')">
				<sw-icon icon="search" @click="openSearch" />
				<el-dialog v-model="search.visible" :width="280" :destroy-on-close="true" :modal="false" fullscreen :show-close="false">
					<el-autocomplete ref="searchRef" v-model="search.menu" :prefix-icon="Search" :fetch-suggestions="searchMenu" :placeholder="$t('header.operate.search')" @select="selectMenu" @blur="closeSearch">
						<template #default="{ item }">
							<sw-icon :icon="item.meta.icon" /> {{ item.meta.title }}
						</template>
					</el-autocomplete>
				</el-dialog>
			</div>
			<!-- avatar -->
			<el-dropdown class="operate" trigger="click">
				<!-- avatar -->
				<div class="avatar">
					<el-avatar shape="circle" :size="30" :src="userStore.user.avatar"></el-avatar>
					<span>{{ userStore.user.realName }}</span>
					<el-icon class="el-icon--right"><ArrowDown /></el-icon>
				</div>
				<!-- dropdown -->
				<template #dropdown>
					<!-- menus -->
					<el-dropdown-menu class="user-dropdown">
						<!-- profile -->
						<el-dropdown-item @click="openUserInfo"> {{ $t('header.operate.profile.userInfo') }} </el-dropdown-item>
						<!-- change password -->
						<el-dropdown-item @click="openChangePassword"> {{ $t('header.operate.profile.changePassword') }} </el-dropdown-item>
						<!-- logout -->
						<el-dropdown-item divided @click="logout"> {{ $t('header.operate.profile.logout') }} </el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<!-- setting -->
			<div class="operate" :title="$t('header.operate.setting')"><sw-icon icon="ellipsis" @click="openSetting" /></div>
		</div>
	</div>
</template>

<script setup lang="ts">
// import vue elements
import { nextTick, ref, reactive } from 'vue'

// import element icons
import { ArrowRight, Search } from '@element-plus/icons-vue'

// import router
import { useRouter, useRoute } from 'vue-router'

// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useTabStore } from '@/stores/tab'
import { useRouteStore } from '@/stores/route'

// import i18n
import { messages } from '@/i18n'
import { useI18n } from 'vue-i18n'

// import vueuse
import { useFullscreen } from '@vueuse/core'

// import tools
import emits from '@/utils/emits'

// get stores
const appStore = useAppStore()
const userStore = useUserStore()
const tabStore = useTabStore()
const routeStore = useRouteStore()

// get router
const router = useRouter()
const route = useRoute()

// get i18n
const { locale } = useI18n()

/**
 * set sidebar
 */
const setSidebar = ()=>{
	// set sidebar
	appStore.setSidebar(!appStore.sidebar);
}

/**
 * refresh
 */
const refresh = ()=>{
	// delete cache
	tabStore.deleteCache(route).then(() => {
		// next tick
		nextTick(() => {
			// direction
			router.replace({ path: '/redirect' + route.path }).catch(error => {
				// log error
				console.warn(error)
			})
		})
	})
}

// get langs
const langs = Object.keys(messages)

/**
 * set lang
 * @params lang
 */
const setLang = (lang: string)=>{
	// set lang
	appStore.setLang(lang)
	// set locale
	locale.value = lang
	// reload
	window.location.reload()
}

/**
 * set size
 * @params size
 */
const setSize = (size: string)=>{
	// set size
	appStore.setSize(size)
}

// get fullscreen element
const { isFullscreen, toggle } = useFullscreen()

// defined ref
const searchRef = ref()

// defined search
const search = reactive({
	visible: false,
	menu: ''
})

/**
 * open search
 */
const openSearch = () => {
	// set show
	search.visible = true
	// next tick
	nextTick(() => {
		// set timeout
		setTimeout(() => {
			// focus
			searchRef.value.focus()
		})
	})
}

/**
 * search menu
 */
const searchMenu = (query: string, callback: any) => {
	// has query
	if(query){
		// query to lower case
		query = query.toLowerCase()
		// filter
		callback(routeStore.searchs.filter((menu)=>(menu.path+menu.name+menu.meta.title).toLowerCase().indexOf(query)>-1))
	}else{
		// show all menus
		callback(routeStore.searchs)
	}
}

/**
 * search menu
 */
const selectMenu = (menu: any) => {
	// to path
	router.push(menu.path)
	// close search
	search.visible = false
}

/**
 * close search
 */
const closeSearch = () => {
	// close search
	search.visible = false
}

/**
 * open setting
 */
const openSetting = () => {
	// open setting
	emits.emit('openSetting')
}

/**
 * open user info
 */
const openUserInfo = () => {
	// open user info
	emits.emit('openUserInfo')
}

/**
 * open change password
 */
const openChangePassword = () => {
	// open change password
	emits.emit('openChangePassword')
}

/**
 * logout
 */
const logout = () => {
	// logout
	userStore.logout().then(() => {
		// reload
		window.location.reload()
	})
}
</script>

<style lang="scss" scoped>

/** normal */
.header{
	
	display:flex;
	flex-direction:row;
	align-items:center;
	border-bottom:1px solid #eee;
	
	.operates{
		
		display:flex;
		flex-direction:row;
		align-items:center;
		
		.operate{
			
			color:#666;
			cursor:pointer;
			
			.sw-icon{
				text-align:center;
				font-size:22px;
				width:56px;
				height:56px;
				line-height:56px;
			}
			
			.avatar{
				
				display:flex;
				flex-direction:row;
				align-items:center;
				height:56px;
				padding:0 12px;
				
				span{padding:0 6px}
				
			}
			
			&:hover{background:#eee;}
			
		}
		
	}
	
	.breadcrumb{
		
		flex:1;
		padding:0 14px;
		
		.el-breadcrumb{
			font-size:14px;
		}
	
	}
	
	.systems{
		
		margin:0 14px;
		
		.el-select{
			
			width:180px;
		
			.sw-icon{
				margin-right:8px;
			}
			
		}
	
	}
	
	:deep(.el-dialog) {
		box-shadow: unset !important;
		border-radius: 0 !important;
		background: rgba(0, 0, 0, 0.5);
	}
	
	:deep(.el-autocomplete) {
		width: 560px;
		position: absolute;
		top: 100px;
		left: 50%;
		transform: translateX(-50%);
	}

}

/** large */
.header.large{
	
	.operates{
		
		.operate{
			
			.sw-icon{
				font-size:24px;
				width:64px;
				height:64px;
				line-height:64px;
			}
			
			.avatar{
				
				height:64px;
				padding:0 16px;
				
				span{padding:0 10px}
				
			}
			
		}
		
	}
	
	.breadcrumb{
		
		padding:0 18px;
		
		.el-breadcrumb{
			font-size:16px;
		}
	
	}
	
	.systems{
		
		margin:0 16px;
		
		.el-select{
			
			width:200px;
		
			.sw-icon{
				margin-right:12px;
			}
			
		}
	
	}

}

/** small */
.header.small{
	
	.operates{
		
		.operate{
			
			.sw-icon{
				font-size:18px;
				width:48px;
				height:48px;
				line-height:48px;
			}
			
			.avatar{
				
				height:48px;
				padding:0 8px;
				
				span{padding:0 4px}
				
			}
			
		}
		
	}
	
	.breadcrumb{
		
		padding:0 12px;
		
		.el-breadcrumb{
			font-size:12px;
		}
	
	}
	
	.systems{
		
		margin:0 8px;
		
		.el-select{
			
			width:160px;
		
			.sw-icon{
				margin-right:6px;
			}
			
		}
	
	}

}
</style>