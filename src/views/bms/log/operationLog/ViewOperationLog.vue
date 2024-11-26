<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="document">查看操作日志</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body" style="padding:4px;">
				<!-- descriptions -->
				<el-descriptions class="margin-top" :column="1" :labelStyle="{width:'80px'}" border>
					<!-- items -->
					<el-descriptions-item label="日志编号">{{operationLog.logId}}</el-descriptions-item>
					<el-descriptions-item label="用户编号">{{operationLog.userId}}</el-descriptions-item>
					<el-descriptions-item label="用户名称">{{operationLog.userName}}</el-descriptions-item>
					<el-descriptions-item label="机构编号">{{operationLog.organId}}</el-descriptions-item>
					<el-descriptions-item label="机构名称">{{operationLog.organName}}</el-descriptions-item>
					<el-descriptions-item label="调用来源">{{operationLog.callSource}}</el-descriptions-item>
					<el-descriptions-item label="操作地址">{{operationLog.operationUrl}}</el-descriptions-item>
					<el-descriptions-item label="参数">{{operationLog.params}}</el-descriptions-item>
					<el-descriptions-item label="操作类型">{{dataStore.dict.operation_type[operationLog.operationType]}}</el-descriptions-item>
					<el-descriptions-item label="操作结果">
						<template v-if="operationLog.operationResult=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.operation_result[operationLog.operationResult]}}</b></el-link></template>
						<template v-if="operationLog.operationResult=='2'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.operation_result[operationLog.operationResult]}}</b></el-link></template>
						<template v-if="operationLog.operationResult=='3'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.operation_result[operationLog.operationResult]}}</b></el-link></template>
						<template v-if="operationLog.operationResult=='4'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.operation_result[operationLog.operationResult]}}</b></el-link></template>
						<template v-if="operationLog.operationResult=='5'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.operation_result[operationLog.operationResult]}}</b></el-link></template>
					</el-descriptions-item>
					<el-descriptions-item label="错误原因">
						<pre v-highlightB><code class="json" style="width:860px;height:200px;">{{operationLog.errorReason}}</code></pre>
					</el-descriptions-item>
					<el-descriptions-item label="操作 IP">{{operationLog.ip}}</el-descriptions-item>
					<el-descriptions-item label="操作说明">{{operationLog.operationDetail}}</el-descriptions-item>
					<el-descriptions-item label="开始时间">{{operationLog.responseStart}}</el-descriptions-item>
					<el-descriptions-item label="结束时间">{{operationLog.responseEnd}}</el-descriptions-item>
					<el-descriptions-item label="耗时">{{operationLog.cost}}</el-descriptions-item>
				</el-descriptions>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get operation log data
import { $getOperationLogData } from '@/assets/config/api';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// props
const props = defineProps(['logId'])

// const state
const state = reactive({
	// operation log
	operationLog: { info:{} }
});

// to refs
const { operationLog } = toRefs(state);

/**
 * get operation log data
 */
const getOperationLogData = () => {
	// get operation log data
	$getOperationLogData({logId:props.logId}).then(handler=>{
		// set operation log
		state.operationLog = handler.data.data.operationLog;
	});
}

// watch
watch(()=>props.logId, ()=>{ getOperationLogData() }, {deep: true}) 

// get operation log data
getOperationLogData();
</script>
