<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="document">查看登录日志</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body" style="padding:4px;">
				<!-- descriptions -->
				<el-descriptions class="margin-top" :column="1" :labelStyle="{width:'80px'}" border>
					<!-- items -->
					<el-descriptions-item label="日志编号">{{loginLog.logId}}</el-descriptions-item>
					<el-descriptions-item label="用户编号">{{loginLog.userId}}</el-descriptions-item>
					<el-descriptions-item label="用户名称">{{loginLog.userName}}</el-descriptions-item>
					<el-descriptions-item label="机构编号">{{loginLog.organId}}</el-descriptions-item>
					<el-descriptions-item label="机构名称">{{loginLog.organName}}</el-descriptions-item>
					<el-descriptions-item label="登录时间">{{loginLog.loginTime}}</el-descriptions-item>
					<el-descriptions-item label="登录 IP">{{loginLog.ip}}</el-descriptions-item>
					<el-descriptions-item label="登录状态">
						<template v-if="loginLog.loginStatus=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.login_status[loginLog.loginStatus]}}</b></el-link></template>
						<template v-if="loginLog.loginStatus=='2'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.login_status[loginLog.loginStatus]}}</b></el-link></template>
						<template v-if="loginLog.loginStatus=='3'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.login_status[loginLog.loginStatus]}}</b></el-link></template>
						<template v-if="loginLog.loginStatus=='4'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.login_status[loginLog.loginStatus]}}</b></el-link></template>
					</el-descriptions-item>
					<el-descriptions-item label="登出">
						<template v-if="loginLog.isLogout=='1'"><el-link type="info" :underline="false">已登出</el-link></template>
						<template v-if="loginLog.isLogout=='0'"><el-link type="danger" :underline="false"><b>未登出</b></el-link></template>
					</el-descriptions-item>
					<el-descriptions-item label="登出状态">
						<template v-if="loginLog.logoutType=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.logout_type[loginLog.logoutType]}}</b></el-link></template>
						<template v-if="loginLog.logoutType=='2'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.logout_type[loginLog.logoutType]}}</b></el-link></template>
						<template v-if="loginLog.logoutType=='3'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.logout_type[loginLog.logoutType]}}</b></el-link></template>
						<template v-if="loginLog.logoutType=='4'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.logout_type[loginLog.logoutType]}}</b></el-link></template>
					</el-descriptions-item>
					<el-descriptions-item label="登出时间">{{loginLog.logoutTime}}</el-descriptions-item>
				</el-descriptions>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get login log data
import { $getLoginLogData } from '@/assets/config/api';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// props
const props = defineProps(['logId'])

// const state
const state = reactive({
	// login log
	loginLog: { info:{} }
});

// to refs
const { loginLog } = toRefs(state);

/**
 * get login log data
 */
const getLoginLogData = () => {
	// get login log data
	$getLoginLogData({logId:props.logId}).then(handler=>{
		// set login log
		state.loginLog = handler.data.data.loginLog;
	});
}

// watch
watch(()=>props.logId, ()=>{ getLoginLogData() }, {deep: true}) 

// get login log data
getLoginLogData();
</script>
