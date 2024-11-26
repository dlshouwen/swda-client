<template>
	<!-- sidebar -->
	<div class="sidebar">
		<!-- sidebar info -->
		<div class="sidebar-info">
			<!-- avatar -->
			<img :src="require(`@/assets/images/avatar.png`)" />
			<!-- title -->
			<h1>{{ (userStore.user&&userStore.user.organ_name)?userStore.user.organ_name:dataStore.attr.company_name }}</h1>
			<!-- user name -->
			<p>
				<el-icon :size="12" color="#409EFC"><UserFilled /></el-icon>
				<span>{{ (userStore.user&&userStore.user.user_name)?userStore.user.user_name:'' }}</span>
			</p>
		</div>
		<!-- sidebar container -->
		<div class="sidebar-container">
			<!-- menu -->
			<el-menu :default-active="router.currentRoute.value.path">
				<el-sub-menu v-for="permission in permissions" :key="permission.permission_id" :index="permission.permission_value">
					<template #title><el-link :icon="permission.icon" :underline="false">{{permission.permission_name}}</el-link></template>
					<el-menu-item-group>
						<el-menu-item v-for="item in permission.children" :key="item.permission_id" :to="item.path" :index="item.path+''" @click="handleMenuClick(item)">
							<el-link :icon="item.icon" :underline="false">{{item.permission_name}}</el-link>
						</el-menu-item>
					</el-menu-item-group>
				</el-sub-menu>
			</el-menu>
		</div>
		<!-- sidebar shortcut -->
		<div class="sidebar-shortcut">
			<el-link v-for="shortcut in userStore.shortcuts" :underline="false" :icon="shortcut.icon" @click="handleMenuClick(shortcut)"></el-link>
		</div>
	</div>
</template>

<script setup>
// import vue: computed
import { computed } from 'vue'

//import tool
import * as tool from '@/assets/utils/tool';

// import element plus: message box
import { ElMessageBox } from 'element-plus'

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

// permissions
let permissions = computed(() => {
	if(userStore.permissions)
		return tool.getTree(userStore.permissions, userStore.systemId, 'permission_id', 'pre_permission_id', 'children')
	return []
})

/**
 * handle menu click
 * @param permission
 */
const handleMenuClick = (permission) => {
	// construct tab
	let tab = {
		id: permission.permission_id+'',
		title: permission.permission_name,
		closable: true,
		route: permission.path
	};
	// add tab
	tabStore.addTab(tab);
	// if link
	if(permission.path.indexOf('http://')==0||permission.path.indexOf('https://')==0){
		// go to http
		router.push({ path: '/core/common/http/'+encodeURIComponent(permission.path) });
		// return
		return;
	}
	// not this path
	if(permission.path!=router.currentRoute.value.path){
		// go to path
		router.push({ path: permission.path });
	}
}
</script>

<style scoped>
.sidebar{height:100%;display:flex;flex-direction: column;}
.sidebar-info{flex-basis: 64px;}
.sidebar-container{flex:1;background: #272930;}
.sidebar-shortcut{flex-basis: 42px;}

.sidebar-info {height: 64px;background: #272930;position: relative;}
.sidebar-info img {position: absolute;top: 8px;left: 8px;border-radius: 24px;height: 48px;width: 48px;}
.sidebar-info h1 {position: absolute;top: 16px;left: 64px;color: white;font-size: 12px;font-weight:normal;line-height:1;padding:0;margin:0;}
.sidebar-info p {position: absolute;top: 36px;left: 64px;color: #c5c6cb;font-size: 12px;margin:0;}
.sidebar-info p>span {vertical-align: middle;}
.sidebar-info p>i {margin: 0 8px 0 0;color: #00ff00;vertical-align: middle;}

/* shortcut */
.sidebar-shortcut{height:42px;background: #1F2126;text-align:center;font-size:0;border-top: 1px solid #131519;box-shadow: 0 1px 0 #2A2C31 inset;}
.sidebar-shortcut a{display:inline-block;width:28px;height:28px;line-height:26px;text-align:center;box-shadow: 1px 1px 0 #36383c inset;border: 1px solid #17181c;color:#fff;margin:6px 2px;font-size:12px;}

.el-menu{height:100%;background: #272930;border:0;border-top: 1px solid #1a1c20;border-bottom: 1px solid #32353e;color:white;}
.el-sub-menu /deep/ .el-sub-menu__title{box-sizing: content-box;font-size:12px;height:32px;padding-left: 12px !important;line-height:28px;border-top: 1px solid #32353e;border-bottom: 1px solid #1a1c20;color: #c9d4f6;}
.el-sub-menu /deep/ .el-sub-menu__title a{color: #c9d4f6;}
.el-sub-menu /deep/ .el-sub-menu__title a i{width:auto;text-align:center;font-size:12px;color:#c9d4f6;margin-right:12px;}
.el-sub-menu:hover /deep/ .el-sub-menu__title{background:#212224;}
.el-sub-menu /deep/ .el-menu-item-group__title{display:none;}
.el-sub-menu /deep/ .el-icon{font-size:12px;}

.el-menu-item-group{background:#1A1C20;padding:4px 0;}
.el-menu-item{height:32px;line-height:32px;font-size:12px;color:#c9d4f6;border-left: 4px solid #1A1C20;padding-left: 18px !important;}
.el-menu-item:hover {background: #1e2025;border-left: 4px solid #1e2025;}
.el-menu-item.is-active {background: #2f3238;border-left: 4px solid #409EFF;}
.el-menu-item a{color:#c9d4f6;}
.el-menu-item a i{width:auto;text-align:center;color:#c9d4f6;font-size:12px;}
</style>