<template>
	<!-- tab -->
	<div :class="`tab ${appStore.size}`">
		<!-- tabs -->
		<el-tabs v-model="activeTab" @tab-click="tabClick" @tab-remove="tabRemove">
			<!-- tab pane -->
			<el-tab-pane v-for="tab in tabStore.visits" :key="tab" :label="tab.title" :name="tab.path" :closable="!tab.meta?.affix">
				<!-- label -->
				<template #label>
					<!-- dropdown -->
					<el-dropdown :id="tab.path" ref="dropdownRef" trigger="contextmenu" placement="bottom-end" @visible-change="onTabDropdownVisibleChange($event, tab)" @command="onTabDropdownTrigger">
						<!-- title -->
						<span><sw-icon icon="" />{{ tab.title }}</span>
						<!-- dropdown -->
						<template #dropdown>
							<!-- menu -->
							<el-dropdown-menu>
								<!-- close tab -->
								<el-dropdown-item :icon="Close" command="closeTab">{{ $t('tab.operate.close.self') }}</el-dropdown-item>
								<!-- close other tab -->
								<el-dropdown-item :icon="CircleClose" command="closeOtherTab">{{ $t('tab.operate.close.other') }}</el-dropdown-item>
								<!-- close all tab -->
								<el-dropdown-item :icon="CircleCloseFilled" command="closeAllTab">{{ $t('tab.operate.close.all') }}</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</template>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
// import vue element
import { watch, onMounted, ref, computed } from 'vue'

// import icons
import { ArrowDown, Close, CircleClose, CircleCloseFilled } from '@element-plus/icons-vue'

// import router
import { useRoute, useRouter } from 'vue-router'

// import stores
import { useAppStore } from '@/stores/app'
import { useRouteStore } from '@/stores/route'
import { useTabStore } from '@/stores/tab'

// get router
const route = useRoute()
const router = useRouter()

// get sotres
const appStore = useAppStore()
const routeStore = useRouteStore()
const tabStore = useTabStore()

// defined active tab
const activeTab = ref(route.path)

/**
 * get affix tabs
 * @param routes
 */
const getAffixTabs = (routes: any) => {
	// defined affix tabs
	let affixTabs = []
	// for each routes
	routes.forEach(route=>{
		// if affix
		if(route.meta?.affix){
			// push tab
			affixTabs.push({ fullPath:route.path, path:route.path, name:route.name, meta: { ...route.meta } })
		}
		// if has children
		if(route.children){
			// get affix children
			const affixChildren = getAffixTabs(route.children)
			// has affix children
			if(affixChildren.length>0){
				// push all affix children
				affixTabs = [ ...affixTabs, ...affixChildren ]
			}
		}
	})
	// return affix tabs
	return affixTabs
}

/**
 * init tab
 */
const initTab = () => {
	// get affix tabs
	const affixTabs = getAffixTabs(routeStore.routes)
	// for each  affix tabs
	affixTabs.forEach((tab)=>{
		// has tab name
		if(tab.name){
			// add tab
			tabStore.add(tab)
		}
	})
}

/**
 * add tab
 */
const addTab = ()=>{
	// add route store
	tabStore.add(route)
	// add route store cache
	tabStore.addCache(route)
	// set active tab
	activeTab.value = route.path
}

/**
 * open last tab
 * @param tab
 */
const openLastTab = (tab) => {
	// get last
	const last = tabStore.visits.slice(-1)[0]
	// if has last tab
	if (last) {
		// push to last tab
		router.push(last.fullPath)
	} else {
		// if tab is home
		if (tab.name === 'Home') {
			// refresh
			router.replace({ path: '/redirect' + tab.fullPath })
		} else {
			// go home
			router.push('/')
		}
	}
}

/**
 * close tab
 * @param tab
 */
const closeTab = (tab: any) => {
	// if tab affix
	if (tab.meta?.affix) {
		// return
		return
	}
	// delete tab
	tabStore.delete(tab)
	// open last tab
	openLastTab(tab)
}

/**
 * close other tab
 * @param tab
 */
const closeOtherTab = (tab: any) => {
	// push tab
	router.push(tab)
	// delete other tab
	tabStore.deleteOther(tab)
}

/**
 * close all tab
 * @param tab
 */
const closeAllTab = (tab: any) => {
	// delete all tab
	tabStore.deleteAll()
	// open last tab
	openLastTab(tab)
}

/**
 * tab click
 * @param tab
 */
const tabClick = (tab)=>{
	// has path then push
	tab.props.name && router.push(tab.props.name)
}

/**
 * tab remove
 * @param path
 */
const tabRemove = (path)=>{
	// find tab
	const tab = tabStore.visits.find(tab=>tab.path===path)
	// close tab
	closeTab(tab)
}

/**
 * on tab dropdown trigger
 * @param type
 */
const onTabDropdownTrigger = (type: string) => {
	// close tab
	if(type==='closeTab') closeTab(route)
	// close other tab
	if(type==='closeOtherTab') closeOtherTab(route)
	// close all tab
	if(type==='closeAllTab') closeAllTab(route)
}

// defined dropdown ref
const dropdownRef = ref()

/**
 * on tab dropdown visible change
 * @param visible
 * @param tab
 */
const onTabDropdownVisibleChange = (visible: boolean, tab: any) => {
	// if not open
	if (!visible) {
		// return
		return
	}
	// for each dropdown ref
	dropdownRef.value.forEach((item: { id: string; handleClose: () => void }) => {
		// other tab
		if (item.id !== tab.path) {
			// close other tab dropdown
			item.handleClose()
		}
	})
}

/**
 * watch: route change
 */
watch(route, ()=>{
	// has route name
	if(route.name){
		// add tab
		addTab()
	}
})

/**
 * on mounted
 */
onMounted(()=>{
	// init tab
	initTab()
	// add tab
	addTab()
})
</script>

<style lang="scss" scoped>

/** normal */
.tab{
	
	::v-deep(.el-tabs){
		
		border-bottom:1px solid #eee;
		padding:0;
		--el-tabs-header-height:40px;

		.el-tabs__header{
			
			margin:0;
			margin-bottom:1px;
			
			.el-tabs__item{padding:0 14px;}
			
			.el-tabs__item:nth-child(2){padding-left:14px;}
			.el-tabs__item:last-child{padding-left:14px;}
			
			.el-tabs__nav-next, .el-tabs__nav-prev{height:40px;line-height:40px;}
			
			.el-tabs__nav-next{border-left:1px solid #eee;}
			
			.el-tabs__nav-prev{border-right:1px solid #eee;}
		
		}
		
		.el-tabs__nav-wrap{
			
			.el-dropdown{font-size:14px;height:40px;line-height:40px;}
			
			&:after{height:0;}
			
			.el-tabs__active-bar{height:0;}
			
			.el-tabs__item{

				border-right:1px solid #efefef;
				
				&:before {content:'';width:10px;height:10px;margin-right:10px;display:inline-block;background-color: #ddd;border-radius: 50%;}
				
				&.is-active{
					
					background:var(--el-color-primary-light-9);  
					
					.el-dropdown{color:var(--el-color-primary)}
					
					&:before {background:var(--el-color-primary)}
			
				}
				
			}
		
		}
	}
	
}

/** large */
.tab.large{
	
	::v-deep(.el-tabs){

		--el-tabs-header-height:48px;
		
		.el-tabs__header{
			
			.el-tabs__item{padding:0 16px;}
			
			.el-tabs__item:nth-child(2){padding-left:16px;}
			.el-tabs__item:last-child{padding-left:16px;}
			
			.el-tabs__nav-next, .el-tabs__nav-prev{height:48px;line-height:48px;}
			
		}
		
		.el-tabs__nav-wrap{
			
			.el-dropdown{font-size:16px;height:48px;line-height:48px;}
			
			.el-tabs__item{
				
				&:before {width:12px;height:12px;margin-right:12px;display:inline-block;}
				
			}
		
		}
	}
	
}

/** small */
.tab.small{
	
	::v-deep(.el-tabs){

		--el-tabs-header-height:32px;
		
		.el-tabs__header{
			
			.el-tabs__item{padding:0 12px;}
			
			.el-tabs__item:nth-child(2){padding-left:12px;}
			.el-tabs__item:last-child{padding-left:12px;}
			
			.el-tabs__nav-next, .el-tabs__nav-prev{height:32px;line-height:32px;}
			
		}
		
		.el-tabs__nav-wrap{
			
			.el-dropdown{font-size:12px;height:32px;line-height:32px;}
			
			.el-tabs__item{
				
				&:before {width:8px;height:8px;margin-right:8px;display:inline-block;}
				
			}
		
		}
	}
	
}

</style>