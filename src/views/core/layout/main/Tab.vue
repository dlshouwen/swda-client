<template>
	<el-tabs v-model="active" @tab-click="tabClick" @tab-remove="tabRemove">
		<el-tab-pane v-for="tab in tabStore.visits" :key="tab" :label="tab.title" :name="tab.path" :closable="!tab.meta?.affix">
			<template #label>
				<el-dropdown :id="tab.path" ref="dropdownRef" trigger="contextmenu" placement="bottom-end" @visible-change="tabChange($event, tab)" @command="onClose">
					<span><sw-icon icon="" />{{ tab.title }}</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item :icon="Close" command="closeTab">{{ $t('operation.close') }}</el-dropdown-item>
							<el-dropdown-item :icon="CircleClose" command="closeOtherTab">{{ $t('operation.closeOther') }}</el-dropdown-item>
							<el-dropdown-item :icon="CircleCloseFilled" command="closeAllTab">{{ $t('operation.closeAll') }}</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</template>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, Close, CircleClose, CircleCloseFilled } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useRouterStore } from '@/stores/router'
import { useTabStore } from '@/stores/tab'

const appStore = useAppStore()
const routerStore = useRouterStore()
const tabStore = useTabStore()
const route = useRoute()
const router = useRouter()

const active = ref(route.path)

watch(route, ()=>{
	if(route.name){
		addTab()
	}
})

onMounted(()=>{
	initTab()
	addTab()
})

const initTab = () => {
	const affixTabs = getAffixTabs(routerStore.routes)
	affixTabs.forEach((tab)=>{
		if(tab.name){
			tabStore.add(tab)
		}
	})
}

const getAffixTabs = (routes: any) => {
	let affixTabs = []
	routes.forEach(route=>{
		if(route.meta?.affix){
			affixTabs.push({ fullPath:route.path, path:route.path, name:route.name, meta: { ...route.meta } })
		}
		if(route.children){
			const tabs = getAffixTabs(route.children)
			if(tabs.length>=1){
				affixTabs = [ ...affixTabs, ...tabs ]
			}
		}
	})
	return affixTabs
}

const addTab = ()=>{
	tabStore.add(route)
	tabStore.addCache(route)
	active.value = route.path
}

const tabClick = (tab)=>{
	tab.props.name && router.push(tab.props.name)
}

const tabRemove = (path)=>{
	const tab = tabStore.visits.find(tab=>tab.path===path)
	closeTab(tab)
}

const closeTab = (tab: any) => {
	if (tab.meta?.affix) {
		return
	}
	tabStore.delete(tab)
	toLastTab(tab)
}

const closeOtherTab = (tab: any) => {
	router.push(tab)
	tabStore.deleteOther(tab)
}

const closeAllTab = (tab: any) => {
	tabStore.deleteAll()
	toLastTab(tab)
}

const toLastTab = (tab) => {
	const latest = tabStore.visits.slice(-1)[0]
	if (latest) {
		router.push(latest.fullPath)
	} else {
		if (tab.name === 'Home') {
			router.replace({ path: '/redirect' + tab.fullPath })
		} else {
			router.push('/')
		}
	}
}

const onClose = (type: string) => {
	switch (type) {
		case 'closeTab':
			closeTab(route)
			break
		case 'closeOtherTab':
			closeOtherTab(route)
			break
		case 'closeAllTab':
			closeAllTab(route)
			break
	}
}
const dropdownRef = ref()
const tabChange = (visible: boolean, tab: any) => {
	if (!visible) {
		return
	}
	dropdownRef.value.forEach((item: { id: string; handleClose: () => void }) => {
		if (item.id === tab.path) {
			return
		}
		item.handleClose()
	})
}
</script>

<style lang="scss" scoped>

.el-tabs{
	
	border-bottom:0.1rem solid #eee;padding:0;--el-tabs-header-height:3rem;
	
	::v-deep(.el-tabs__header){
		
		margin:0;margin-bottom:0.1rem;
		
		.el-tabs__item{padding:0 1rem;}
		
		.el-tabs__item:nth-child(2){padding-left:1rem;}
		.el-tabs__item:last-child{padding-left:1rem;}
		
		.el-tabs__nav-next{border-left:0.1rem solid #eee;}
		
		.el-tabs__nav-prev{border-right:0.1rem solid #eee;}
	
	}
	
	::v-deep(.el-tabs__nav-wrap){
		
		.el-dropdown{height:3rem;line-height:3rem;}
		
		&:after{height:0;}
		
		.el-tabs__active-bar{height:0;}
		
		.el-tabs__item{
			
			border-right:0.1rem solid #efefef;
			
			&:before {content:'';width:0.6rem;height:0.6rem;margin-right:0.6rem;display:inline-block;background-color: #ddd;border-radius: 50%;}
			
			&.is-active{
				
				background:var(--el-color-primary-light-9);  
				
				.el-dropdown{color:var(--el-color-primary)}
				
				&:before {background:var(--el-color-primary)}
		
			}
			
		}
	
	}
}
</style>