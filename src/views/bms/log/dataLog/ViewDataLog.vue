<template>
	<el-dialog v-model="visible" title="查看数据日志" :close-on-click-modal="false" draggable width="480px">
		<el-descriptions :column="1" :label-width="120" border>
			<el-descriptions-item label="日志编号">{{dataLog.dataLogId}}</el-descriptions-item>
			<el-descriptions-item label="执行类型">
				<el-tag v-if="dataLog.executeType!==null" :type="appStore.dict.execute_type[dataLog.executeType].style">{{appStore.dict.execute_type[dataLog.executeType].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="执行sql">{{dataLog.executeSql}}</el-descriptions-item>
			<el-descriptions-item label="执行方法">{{dataLog.executeMethod}}</el-descriptions-item>
			<el-descriptions-item label="执行参数">{{dataLog.executeParams}}</el-descriptions-item>
			<el-descriptions-item label="执行结果类型">{{dataLog.executeResultClass}}</el-descriptions-item>
			<el-descriptions-item label="执行结果">{{dataLog.executeResult}}</el-descriptions-item>
			<el-descriptions-item label="调用方式">
				<el-tag v-if="dataLog.callType!==null" :type="appStore.dict.call_type[dataLog.callType].style">{{appStore.dict.call_type[dataLog.callType].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="调用来源">{{dataLog.callSource}}</el-descriptions-item>
			<el-descriptions-item label="行号">{{dataLog.lineNo}}</el-descriptions-item>
			<el-descriptions-item label="调用结果">
				<el-tag v-if="dataLog.callResult!==null" :type="appStore.dict.call_result[dataLog.callResult].style">{{appStore.dict.call_result[dataLog.callResult].label}}</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="错误原因">{{dataLog.errorReason}}</el-descriptions-item>
			<el-descriptions-item label="开始时间">{{dataLog.startTime}}</el-descriptions-item>
			<el-descriptions-item label="结束时间">{{dataLog.endTime}}</el-descriptions-item>
			<el-descriptions-item label="耗时">{{dataLog.cost}}</el-descriptions-item>
			<el-descriptions-item label="用户编号">{{dataLog.userId}}</el-descriptions-item>
			<el-descriptions-item label="真实名称">{{dataLog.realName}}</el-descriptions-item>
			<el-descriptions-item label="机构编号">{{dataLog.organId}}</el-descriptions-item>
			<el-descriptions-item label="机构名称">{{dataLog.organName}}</el-descriptions-item>
			<el-descriptions-item label="ip地址">{{dataLog.ip}}</el-descriptions-item>
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
import { $getDataLogData } from '@/api/bms/log/dataLog'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// const visible
const visible = ref(false)

// const data log
const dataLog = reactive({
	dataLogId: '0',
	executeType: '',
	executeSql: '',
	executeMethod: '',
	executeParams: '',
	executeResultClass: '',
	executeResult: '',
	callType: '',
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
const init = async (dataLogId)=>{
	// get data log data
	await getDataLogData(dataLogId)
	// set visible
	visible.value = true
}

/**
 * get data log data
 * @param dataLogId
 */
const getDataLogData = async (dataLogId)=>{
	// get data log data
	let handler = await $getDataLogData(dataLogId)
	// set data log data
	Object.assign(dataLog, handler.data)
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