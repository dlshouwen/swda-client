<template>
	<!-- navbar -->
	<div class="navbar">
		<!-- navbar left -->
		<div class="navbar-left">
			<div class="navbar-icon"><i :class="dataStore.attr.header_icon"></i></div>
			<div class="navbar-title">
				{{dataStore.attr.system_title}}
				<span class="navbar-version">{{dataStore.attr.version }}</span>
			</div>
			<el-link class="navbar-collapse" @click="handleToggleAside" :icon="props.isAsideshow?'d-arrow-left':'d-arrow-right'"></el-link>
		</div>
		<!-- navbar container -->
		<div class="navbar-navs-container">
			<el-menu :default-active="userStore.systemId" mode="horizontal" @select="handleSystemSelect">
				<el-menu-item v-for="system in userStore.systems" :key="system.system_id" :index="system.system_id+''">
					<el-link :icon="system.icon" :underline="false">{{system.system_name}}</el-link>
				</el-menu-item>
			</el-menu>
		</div>
		<!-- navbar right -->
		<div class="navbar-right">
			<!-- navbar bottons -->
			<ul class="navbar-bottons">
				<li><el-link icon="setting" @click="assist"></el-link></li>
				<li><el-link class="navbar-btn-danger" icon="switch-button" @click="logout"></el-link></li>
			</ul>
		</div>
		<!-- assist -->
		<el-dialog title="全局设置" center width="400px" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.assist">
			<Assist></Assist>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: reactive & to refs
import { reactive, toRefs } from 'vue'

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

// import components: assist
import Assist from '@/views/core/assist/Assist';

// define props
const props = defineProps(['toggleAside', 'isAsideshow'])

// state
const state = reactive({
	// show
	show: { assist: false }
});

// to refs
const { show } = toRefs(state);

/**
 * handle system select
 */
const handleSystemSelect = (index, path) => {
	// if system id is not now system
	if(userStore.systemId!=index) {
		// change system
		userStore.changeSystem(index);
	}
}

/**
 * assist
 */
const assist = () => {
	// show assist
	state.show.assist = true;
}

/**
 * logout
 */
const logout = () => {
	// confirm
	ElMessageBox.confirm('确定要退出登录吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
		// do logout
		userStore.logout().then(() => {
			// go login page
			router.push({ path: '/core/login' });
		});
	}).catch(()=>{});
}

/**
 * handle toggle aside
 */
const handleToggleAside = () => {
	// toggle aside
	props.toggleAside(!props.isAsideshow);
}
</script>

<style scoped>
/* navbar */
.navbar{display:flex;flex-direction: row;background:#2494f2;margin:0;}
.navbar-left{display:flex;flex-basis:200px;height:32px;background:#1f84d9;}
.navbar-navs-container{padding:0 12px;flex:1;}
.navbar-right{padding:0 8px;}

/* navbar title */
.navbar-icon {flex-basis:48px;height:32px;text-align:center;color: white;font-size: 26px;}
.navbar-icon i {line-height:32px;}
.navbar-title {flex:1;height:32px;color: white;font-size: 14px;line-height: 32px;font-weight: bold;overflow: hidden;white-space: nowrap;}
.navbar-version {margin-left:4px;transform:scale(0.8);font-size:10px;background: #d9534f;padding: 1px 4px;color: white;font-weight: normal;}
a.navbar-collapse {flex-basis:32px;width: 32px;height: 32px;font-size: 14px;line-height: 32px;font-weight: normal;text-align: center;color: #a4cdef;transition:0.5s;}
a.navbar-collapse:hover {color: white;}

/* navbar menu */
.navbar-navs-container>.el-menu{background:#2494f2;border-bottom:0;}
.navbar-navs-container>.el-menu>.el-menu-item{height:32px;line-height:32px;background:#2494f2;color:#c0e2ff;border-bottom:0;padding:0 12px;font-size:13px;}
.navbar-navs-container>.el-menu>.el-menu-item /deep/ [class^=el-icon]{float:left;line-height:32px;height:32px;font-size:13px;}
.navbar-navs-container>.el-menu>.el-menu-item:hover, .navbar-navs-container>.el-menu>.el-menu-item:hover>i{background:#2494f2;color:white;transition:none;}
.navbar-navs-container>.el-menu>.el-menu-item.is-active, .navbar-navs-container>.el-menu>.el-menu-item.is-active>i{background:white;color:#2494f2;}

/* navbar buttons */
ul.navbar-bottons {float:left;padding: 0;margin:0;}
ul.navbar-bottons>li {list-style-type: none;display: inline;}
ul.navbar-bottons>li>a {float:left;margin-top:4px;margin-right:4px;line-height: 24px;width:22px;height:22px;font-size: 12px;color:white;text-align:center;border:1px solid #247cc6;box-shadow:1px 1px 0 rgba(255, 255, 255, 0.2) inset;transition:0.5s;}
ul.navbar-bottons>li>a:hover {background-color: #36a3ff;}
ul.navbar-bottons>li>a.navbar-btn-danger {background:#d9534f;border:1px solid #981d1a;}
ul.navbar-bottons>li>a.navbar-btn-danger:hover {background-color: #c93531;}
</style>