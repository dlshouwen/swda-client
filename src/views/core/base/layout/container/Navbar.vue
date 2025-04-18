<template>

	<!-- refresh -->
	<div class="operate" :title="$t('header.operate.refresh')" @click="refresh">
		<sw-icon icon="sync" />
	</div>
	
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
	<div class="operate" :title="isFullscreen?$t('header.operate.fullscreen.close'):$t('header.operate.fullscreen.open')" @click="toggle">
		<sw-icon :icon="isFullscreen?'fullscreen-exit':'fullscreen'" />
	</div>
	
	<!-- search -->
	<div class="operate" :title="$t('header.operate.search')">
		<sw-icon icon="search" @click="openSearch" />
		<el-dialog v-model="search.visible" :width="280" :destroy-on-close="true" :modal="false" :show-close="false">
			<el-autocomplete ref="searchRef" v-model="search.menu" :prefix-icon="Search" :fetch-suggestions="searchMenu" :placeholder="$t('header.operate.search')" @select="selectMenu" @blur="closeSearch">
				<template #default="{ item }">
					<sw-icon :icon="item.meta.icon" /> {{ item.meta.title }}
				</template>
			</el-autocomplete>
		</el-dialog>
	</div>
	
	<!-- avatar -->
	<el-dropdown class="avatar" trigger="click">
		<!-- title -->
		<div class="title">
			<el-avatar shape="circle" :size="30" :src="userStore.user.avatar"></el-avatar>
			<span>{{ userStore.user.realName }}</span>
			<el-icon class="el-icon--right"><ArrowDown /></el-icon>
		</div>
		<!-- dropdown -->
		<template #dropdown>
			<!-- menus -->
			<el-dropdown-menu class="user-dropdown">
				<!-- profile -->
				<el-dropdown-item @click="setUserInfo"> {{ $t('header.operate.profile.userInfo') }} </el-dropdown-item>
				<!-- change password -->
				<el-dropdown-item @click="changePassword"> {{ $t('header.operate.profile.changePassword') }} </el-dropdown-item>
				<!-- set auth -->
				<el-dropdown-item @click="setAuth"> {{ $t('header.operate.profile.auth') }} </el-dropdown-item>
				<!-- logout -->
				<el-dropdown-item divided @click="logout"> {{ $t('header.operate.profile.logout') }} </el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	
	<!-- setting -->
	<div class="operate" :title="$t('header.operate.setting')"><sw-icon icon="ellipsis" @click="openSetting" /></div>

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
 * @param lang
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
 * @param size
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
 * set user info
 */
const setUserInfo = () => {
	// set user info
	emits.emit('setUserInfo')
}

/**
 * change password
 */
const changePassword = () => {
	// change password
	emits.emit('changePassword')
}

/**
 * set auth
 */
const setAuth = () => {
	// set auth
	emits.emit('setAuth')
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

/**
 * open setting
 */
const openSetting = () => {
	// open setting
	emits.emit('openSetting')
}
</script>