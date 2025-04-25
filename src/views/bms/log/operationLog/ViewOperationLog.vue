<template>
	<el-dialog v-model="visible" title="查看操作日志" :close-on-click-modal="false" draggable width="480px">
		<el-descriptions :column="1" :label-width="120" border>
			<el-descriptions-item label="日志编号">{{loginLog.loginLogId}}</el-descriptions-item>
			<el-descriptions-item label="User Agent">{{loginLog.userAgent}}</el-descriptions-item>
			<el-descriptions-item label="IP 地址">{{loginLog.ip}}</el-descriptions-item>
			<el-descriptions-item label="登录类型">
				<el-tag :style="appStore.dict.login_type[loginLog.loginType].style">{{appStore.dict.login_type[loginLog.loginType].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="登录状态">
				<el-tag :style="appStore.dict.login_status[loginLog.loginStatus].style">{{appStore.dict.login_status[loginLog.loginStatus].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="登录时间">{{loginLog.loginTime}}</el-descriptions-item>
			<el-descriptions-item label="登录消息">{{loginLog.loginMessage}}</el-descriptions-item>
			<el-descriptions-item label="用户编号">{{loginLog.userId}}</el-descriptions-item>
			<el-descriptions-item label="真实名称">{{loginLog.realName}}</el-descriptions-item>
			<el-descriptions-item label="机构编号">{{loginLog.organId}}</el-descriptions-item>
			<el-descriptions-item label="机构名称">{{loginLog.organName}}</el-descriptions-item>
			<el-descriptions-item label="是否登出">
				<el-tag :style="appStore.dict.zero_one[loginLog.isLogout].style">{{appStore.dict.zero_one[loginLog.isLogout].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="登出类型">
				<el-tag :style="appStore.dict.logout_type[loginLog.logoutType].style">{{appStore.dict.logout_type[loginLog.logoutType].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="登出时间">{{loginLog.logoutTime}}</el-descriptions-item>
		</el-descriptions>
	</el-dialog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive } from 'vue'

// import element plus elements
import { ElMessage } from 'element-plus'

// import use i18n
import { useI18n } from 'vue-i18n'

// import apis
import { $getOperationLogData } from '@/api/bms/log/operationLog'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// const visible
const visible = ref(false)

// const login log
const loginLog = reactive({
	loginLogId: '0',
	userAgent: '',
	ip: '',
	loginType: '',
	loginStatus: '',
	loginTime: '',
	loginInfo: '',
	loginMessage: '',
	userId: '0',
	realName: '',
	organId: '0',
	organName: '',
	isLogout: '',
	logoutType: '',
	logoutTime: '',
})

/**
 * init
 */
const init = async (loginLogId)=>{
	// get login log data
	await getOperationLogData(loginLogId)
	// set visible
	visible.value = true
}

/**
 * get login log data
 * @param loginLogId
 */
const getOperationLogData = async (loginLogId)=>{
	// get login log data
	let handler = await $getOperationLogData(loginLogId)
	// set login log data
	Object.assign(loginLog, handler.data)
}

/**
 * close
 */
const close = ()=>{
	// set visible
	visible.value = false
}

// expose
defineExpose({ init })
</script>