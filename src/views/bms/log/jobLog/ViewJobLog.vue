<template>
	<el-dialog v-model="visible" title="查看操作日志" :close-on-click-modal="false" draggable width="800px">
		<el-descriptions :column="1" :label-width="120" border>
			<el-descriptions-item label="日志编号">{{operationLog.operationLogId}}</el-descriptions-item>
			<el-descriptions-item label="user agent">{{operationLog.userAgent}}</el-descriptions-item>
			<el-descriptions-item label="操作模块">{{operationLog.operationModule}}</el-descriptions-item>
			<el-descriptions-item label="操作名称">{{operationLog.operationName}}</el-descriptions-item>
			<el-descriptions-item label="操作类型">
				<el-tag :type="appStore.dict.operation_type[operationLog.operationType].style">{{appStore.dict.operation_type[operationLog.operationType].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="请求地址">{{operationLog.requestUri}}</el-descriptions-item>
			<el-descriptions-item label="请求方法">{{operationLog.requestMethod}}</el-descriptions-item>
			<el-descriptions-item label="请求参数">{{operationLog.requestParams}}</el-descriptions-item>
			<el-descriptions-item label="响应结果">{{operationLog.responseResult}}</el-descriptions-item>
			<el-descriptions-item label="调用来源">{{operationLog.callSource}}</el-descriptions-item>
			<el-descriptions-item label="行号">{{operationLog.lineNo}}</el-descriptions-item>
			<el-descriptions-item label="调用结果">
				<el-tag :type="appStore.dict.call_result[operationLog.callResult].style">{{appStore.dict.call_result[operationLog.callResult].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="错误原因">{{operationLog.errorReason}}</el-descriptions-item>
			<el-descriptions-item label="开始时间">{{operationLog.startTime}}</el-descriptions-item>
			<el-descriptions-item label="结束时间">{{operationLog.endTime}}</el-descriptions-item>
			<el-descriptions-item label="耗时">{{operationLog.cost}}</el-descriptions-item>
			<el-descriptions-item label="用户编号">{{operationLog.userId}}</el-descriptions-item>
			<el-descriptions-item label="真实名称">{{operationLog.realName}}</el-descriptions-item>
			<el-descriptions-item label="机构编号">{{operationLog.organId}}</el-descriptions-item>
			<el-descriptions-item label="机构名称">{{operationLog.organName}}</el-descriptions-item>
			<el-descriptions-item label="ip地址">{{operationLog.ip}}</el-descriptions-item>
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

// const operation log
const operationLog = reactive({
	operationLogId: '0',
	userAgent: '',
	operationModule: '',
	operationName: '',
	operationType: '',
	requestUri: '',
	requestMethod: '',
	requestParams: '',
	responseResult: '',
	callSource: '',
	lineNo: '0',
	callResult: '',
	errorReason: '',
	startTime: '',
	endTime: '',
	cost: '0',
	userId: '0',
	realName: '',
	organId: '0',
	organName: '',
	ip: '',
})

/**
 * init
 */
const init = async (operationLogId)=>{
	// get operation log data
	await getOperationLogData(operationLogId)
	// set visible
	visible.value = true
}

/**
 * get operation log data
 * @param operationLogId
 */
const getOperationLogData = async (operationLogId)=>{
	// get operation log data
	let handler = await $getOperationLogData(operationLogId)
	// set operation log data
	Object.assign(operationLog, handler.data)
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