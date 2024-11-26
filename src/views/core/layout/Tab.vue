<template>
	<!-- tab container -->
	<div id="tab_container">
		<!-- clear tab button -->
		<el-button class="clear-tab" :underline="false" icon="delete" @click="clearTabs"></el-button>
		<!-- tabs -->
		<el-tabs @tab-remove="removeTab" @tab-click="clickTab" v-model="tabStore.activeTab.route">
			<!-- tab pane -->
			<el-tab-pane v-for="tab in tabStore.tabs" :closable="tab.closable" :key="tab.id" :name="tab.route"><template #label><span>{{tab.title}}</span></template></el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup>
// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

//import store: data & user & tab
import { useDataStore } from '@/store/data'
import { useUserStore } from '@/store/user'
import { useTabStore } from '@/store/tab'
//get store: data & user & tab
const dataStore = useDataStore();
const userStore = useUserStore();
const tabStore = useTabStore();

//import use router
import { useRouter } from 'vue-router'
//get router
const router = useRouter()

/**
 * remove tab
 * @param id
 */
const removeTab = (id) => {
	// remove tab
	tabStore.removeTab(id)
	// push active tab
	router.push({ path: tabStore.activeTab.route })
}

/**
 * click tab
 * @param tab
 */
const clickTab = (tab, event) => {
	// get route
	var route = tab.paneName
	// if active tab is this tab then return
	if(route==tabStore.activeTab.route){
		return;
	}
	// if link
	if(route.indexOf('http://')==0||route.indexOf('https://')==0){
		// push to link
		router.push({ path: '/core/common/http/'+encodeURIComponent(route) });
	}else{
		// push to route
		router.push({ path: route });
	}
	// set active tab
	tabStore.setActiveTab(tabStore.tabs.find(item=>item.route==route))
}

/**
 * clear tabs
 */
const clearTabs = () => {
	// only home
	if(tabStore.tabs.length<=1){
		ElMessage({ message: '页签已全部被清空。', type:'warning', duration: 5*1000 });
		return;
	}
	// confirm
	ElMessageBox.confirm('确定关闭所有页签吗？', '警告', { confirmButtonText:'确定', cancelButtonText:'取消', type:'warning' }).then(()=>{
		// clear tab
		tabStore.clearTabs();
		// to home
		router.push({ path: tabStore.tabs[0].route })
	}).catch(()=>{});
}

// get compared
const compared = router.currentRoute.value.params&&router.currentRoute.value.params.url?router.currentRoute.value.params.url:router.currentRoute.value.path;
// if error
if(compared=='/core/error/404'){
	tabStore.addTab({ id:'404', title:'页面未找到', closable:true, route:compared })
}else{
	// get index
	const index = tabStore.tabs.findIndex(item=>item.route==compared);
	// if not find
	if(index==-1){
		// find permission
		const permission = userStore.permissions.find(permission=>permission.path==compared);
		// if exist
		if(permission){
			// add tab
			tabStore.addTab({ id:permission.permission_id+'', title:permission.permission_name, closable:true, route:permission.path })
		}else{
			// to home
			router.push({ path: tabStore.tabs[0].route })
		}
	}
}
</script>

<style scoped>
/** clear tab */
.clear-tab{float:left;border:0;border-radius:0;width:22px;height:22px;line-height:22px;text-decoration:none;color: white;text-align:center;margin:4px;background: #d9534f;padding:0;}

/** el tabs */
.el-tabs {padding:0 4px 0 30px;}
.el-tabs /deep/ .el-tabs__header{margin:0;}
.el-tabs /deep/ .el-tabs__nav-wrap.is-scrollable{padding:0 16px;}
.el-tabs /deep/ .el-tabs__nav-wrap>span{height:22px;line-height:22px;background:#e2a042;margin-top:4px;color:white;}
.el-tabs /deep/ .el-tabs__item{height:22px;line-height:22px;margin:4px 4px 4px 0;font-size:12px;background:#aaa;color:white;padding:0 8px;display:inline-block}
.el-tabs /deep/ .el-tabs__item i, .el-tabs /deep/ .el-tabs__item span{vertical-align: middle;}
.el-tabs /deep/ .el-tabs__item:last-child{margin-right:0;}
.el-tabs /deep/ .el-tabs__item:nth-child(2), .el-tabs /deep/ .el-tabs__item:last-child{padding:0 8px;}
.el-tabs /deep/ .el-tabs__nav-wrap::after{content:none}
.el-tabs /deep/ .el-tabs__active-bar{display:none;}
.el-tabs /deep/ .el-tabs__item.is-active{background:#2494f2;color:white;font-weight:bold;}
.el-tabs /deep/ .is-icon-close:hover{background:none;color:red;}
</style>