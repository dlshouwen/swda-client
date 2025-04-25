<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="执行类型">
					<el-select v-model="grid.query.manualQueryParameters.eq_execute_type" clearable placeholder="执行类型" style="width:100px">
						<el-option v-for="dict in appStore.dict.execute_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="执行时间">
					<el-date-picker v-model="dataTimeRange" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="到" start-placeholder="开始时间" end-placeholder="结束时间" />
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click="reset"><sw-icon icon="redo"></sw-icon>重置</el-button>
					<el-button type="primary" @click="search"><sw-icon icon="search"></sw-icon>查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- grid container -->
		<el-card class="panel panel-auto">
			<!-- operate -->
			<el-row class="panel-operate">
				<el-col class="left" :span="12">
					<el-button type="default" @click="search"><sw-icon icon="sync"></sw-icon>刷新</el-button>
				</el-col>
				<el-col class="right" :span="12">
					<el-button type="info" @click="viewDataLog()"><sw-icon icon="file-text"></sw-icon>查看</el-button>
					<el-button type="danger" @click="deleteDataLog()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="info" @click="viewDataLog(scope.row.dataLogId)">查看</el-button>
							<el-button link type="danger" @click="deleteDataLog(scope.row.dataLogId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="dataLogId" width="80" align="center" sortable show-overflow-tooltip />
					<el-table-column label="类型" prop="executeType" width="80" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag v-if="scope.row.executeType!==null" :type="appStore.dict.execute_type[scope.row.executeType].style">{{appStore.dict.execute_type[scope.row.executeType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="SQL" prop="executeSql" width="200" header-align="center" align="left" sortable show-overflow-tooltip />
					<el-table-column label="方法" prop="executeMethod" width="100" align="center" sortable show-overflow-tooltip />
					<el-table-column label="参数" prop="executeParams" width="200" align="center" sortable show-overflow-tooltip />
					<el-table-column label="结果类型" prop="executeResultClass" width="200" align="center" sortable show-overflow-tooltip />
					<el-table-column label="结果" prop="executeResult" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="方式" prop="callType" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag v-if="scope.row.callType!==null" :type="appStore.dict.call_type[scope.row.callType].style">{{appStore.dict.call_type[scope.row.callType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="来源" prop="callSource" width="200" align="center" sortable show-overflow-tooltip />
					<el-table-column label="行号" prop="lineNo" width="80" align="center" sortable show-overflow-tooltip />
					<el-table-column label="结果" prop="callResult" width="80" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag v-if="scope.row.callResult!==null" :type="appStore.dict.call_result[scope.row.callResult].style">{{appStore.dict.call_result[scope.row.callResult].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="开始时间" prop="startTime" width="180" align="center" sortable show-overflow-tooltip />
					<el-table-column label="结束时间" prop="endTime" width="180" align="center" sortable show-overflow-tooltip />
					<el-table-column label="耗时" prop="cost" width="80" header-align="center" align="right" sortable show-overflow-tooltip />
					<el-table-column label="用户" prop="realName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="机构" prop="organName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="IP" prop="ip" width="120" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
			<!-- pagination -->
			<el-row class="panel-pagination">
				<el-pagination v-model:current-page="grid.query.page.current" v-model:page-size="grid.query.page.size" :page-sizes="grid.option.sizes"
					:layout="grid.option.layout" :total="grid.total" @size-change="search" @current-change="search" />
			</el-row>
		</el-card>
	</el-container>
	<!-- view data log -->
	<ViewDataLog ref="viewDataLogRef"></ViewDataLog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, watch } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import ViewDataLog from './ViewDataLog.vue'

// import apis
import { $getDataLogPageResult, $deleteDataLog } from '@/api/bms/log/dataLog' 

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// const grid container ref
const gridContainerRef = ref(null)

// const grid ref
const gridRef = ref(null)

// const grid
const grid = reactive({
	option: {
		height: '200px',
		sizes: [50, 100, 500, 1000],
		layout: 'total, sizes, prev, pager, next, jumper'
	},
	selects: [],
	total: 0,
	datas: [],
	query: {
		page: {
			size: 50,
			current: 1
		},
		manualQueryParameters: {},
		fastQueryParameters: {},
		advanceQueryConditions: [],
		advanceQuerySorts: [],
	}
});

// const data time range
const dataTimeRange = ref()

// watch data time range
watch(dataTimeRange, async ()=>{
	grid.query.manualQueryParameters.ge_start_time = dataTimeRange.value[0]
	grid.query.manualQueryParameters.le_start_time = dataTimeRange.value[1]
	console.log(grid.query.manualQueryParameters)
})

// mounted
onMounted(() => {
	// search
	search()
	// resize height
	grid.option.height = gridContainerRef.value.$el.clientHeight+ 'px'
	// resize
    window.onresize = () => {
		// resize height
        grid.option.height = gridContainerRef.value.$el.clientHeight + 'px'
    }
})

/**
 * reset
 */
const reset = ()=>{
	// reset
	grid.query.manualQueryParameters = {}
}

/**
 * search
 */
const search = ()=>{
	// get data log page result
	$getDataLogPageResult(grid.query).then(handler=>{
		// set total
		grid.total = handler.data.total
		// set datas
		grid.datas = handler.data.datas
	})
}

/**
 * grid selection change
 */
const gridSelectionChange = (datas)=>{
	// set select
	grid.selects = datas
}

// view data log ref
const viewDataLogRef = ref()

/**
 * view data log
 */
const viewDataLog = (dataLogId)=>{
	// no data log id
	if(!dataLogId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// set data log id
		dataLogId = grid.selects[0].dataLogId
	}
	// view data log init
	viewDataLogRef.value.init(dataLogId);
}

/**
 * delete data log
 */
const deleteDataLog = (dataLogId)=>{
	// defined data log ids
	let dataLogIds = []
	// no data log id
	if(!dataLogId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// set data log id
		dataLogIds = grid.selects.map(select=>select.dataLogId)
	}else{
		// push data log id
		dataLogIds.push(dataLogId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete data log
		$deleteDataLog(dataLogIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>