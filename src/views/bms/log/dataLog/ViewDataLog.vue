<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="document">查看数据日志</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body" style="padding:4px;">
				<!-- descriptions -->
				<el-descriptions class="margin-top" :column="1" :labelStyle="{width:'80px'}" border>
					<!-- items -->
					<el-descriptions-item label="日志编号">{{dataLog.logId}}</el-descriptions-item>
					<el-descriptions-item label="用户编号">{{dataLog.userId}}</el-descriptions-item>
					<el-descriptions-item label="用户名称">{{dataLog.userName}}</el-descriptions-item>
					<el-descriptions-item label="机构编号">{{dataLog.organId}}</el-descriptions-item>
					<el-descriptions-item label="机构名称">{{dataLog.organName}}</el-descriptions-item>
					<el-descriptions-item label="调用来源">{{dataLog.callSource}}:{{dataLog.lineNo}}</el-descriptions-item>
					<el-descriptions-item label="操作类型">
						<template v-if="dataLog.operationType=='0'"><el-link type="info" :underline="false"><b>{{dataStore.dict.operation_type[dataLog.operationType]}}</b></el-link></template>
						<template v-if="dataLog.operationType=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.operation_type[dataLog.operationType]}}</b></el-link></template>
						<template v-if="dataLog.operationType=='2'"><el-link type="primary" :underline="false"><b>{{dataStore.dict.operation_type[dataLog.operationType]}}</b></el-link></template>
						<template v-if="dataLog.operationType=='3'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.operation_type[dataLog.operationType]}}</b></el-link></template>
						<template v-if="dataLog.operationType=='4'"><el-link type="delete" :underline="false"><b>{{dataStore.dict.operation_type[dataLog.operationType]}}</b></el-link></template>
						<template v-if="dataLog.operationType=='5'"><el-link type="primary" :underline="false"><b>{{dataStore.dict.operation_type[dataLog.operationType]}}</b></el-link></template>
						<template v-if="dataLog.operationType=='6'"><el-link type="primary" :underline="false"><b>{{dataStore.dict.operation_type[dataLog.operationType]}}</b></el-link></template>
					</el-descriptions-item>
					<el-descriptions-item label="操作 SQL">
						<pre v-highlightB><code class="sql" style="max-height:100px;">{{dataLog.operationSql}}</code></pre>
					</el-descriptions-item>
					<el-descriptions-item label="执行参数">
						<pre v-highlightB><code class="json" style="max-height:200px;">{{dataLog.params}}</code></pre>
					</el-descriptions-item>
					<el-descriptions-item label="调用 IP">{{dataLog.ip}}</el-descriptions-item>
					<el-descriptions-item label="调用结果">
						<template v-if="dataLog.callResult=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.call_result[dataLog.callResult]}}</b></el-link></template>
						<template v-if="dataLog.callResult=='0'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.call_result[dataLog.callResult]}}</b></el-link></template>
					</el-descriptions-item>
					<el-descriptions-item label="错误原因">
						<pre v-highlightB><code class="java" style="max-height:200px;">{{dataLog.errorReason}}</code></pre>
					</el-descriptions-item>
					<el-descriptions-item label="执行类别">{{dataLog.executeType}}</el-descriptions-item>
					<el-descriptions-item label="执行结果">
						<pre v-highlightB><code class="json" style="max-height:200px;">{{dataLog.executeResult}}</code></pre>
					</el-descriptions-item>
					<el-descriptions-item label="结果类别">{{dataLog.resultType}}</el-descriptions-item>
					<el-descriptions-item label="开始时间">{{dataLog.startTime}}</el-descriptions-item>
					<el-descriptions-item label="结束时间">{{dataLog.endTime}}</el-descriptions-item>
					<el-descriptions-item label="执行耗时">{{dataLog.cost}}</el-descriptions-item>
				</el-descriptions>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get data log data
import { $getDataLogData } from '@/assets/config/api';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// props
const props = defineProps(['logId'])

// const state
const state = reactive({
	// data log
	dataLog: { info:{} }
});

// to refs
const { dataLog } = toRefs(state);

/**
 * get data log data
 */
const getDataLogData = () => {
	// get data log data
	$getDataLogData({logId:props.logId}).then(handler=>{
		// set data log
		state.dataLog = handler.data.data.dataLog;
	});
}

// watch
watch(()=>props.logId, ()=>{ getDataLogData() }, {deep: true}) 

// get data log data
getDataLogData();
</script>

<style scope>
code{display:inline-block;overflow:auto;text-wrap:wrap;width:860px;}
</style>