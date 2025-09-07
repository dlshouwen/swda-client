<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="操作类型">
					<el-select v-model="grid.query.manualQueryParameters.eq_operation_type" clearable placeholder="操作类型" style="width:100px">
						<el-option v-for="dict in appStore.dict.operation_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="操作时间">
					<el-date-picker v-model="operationTimeRange" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="到" start-placeholder="开始时间" end-placeholder="结束时间" />
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
					<el-button type="info" @click="viewOperationLog()"><sw-icon icon="file-text"></sw-icon>查看</el-button>
					<el-button type="danger" @click="deleteOperationLog()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="info" @click="viewOperationLog(scope.row.operationLogId)">查看</el-button>
							<el-button link type="danger" @click="deleteOperationLog(scope.row.operationLogId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="operationLogId" width="80" align="center" sortable show-overflow-tooltip />
					<el-table-column label="user agent" prop="userAgent" width="200" align="center" sortable show-overflow-tooltip />
					<el-table-column label="模块" prop="operationModule" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="名称" prop="operationName" width="160" align="center" sortable show-overflow-tooltip />
					<el-table-column label="类型" prop="operationType" width="80" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag v-if="scope.row.operationType!==null" :type="appStore.dict.operation_type[scope.row.operationType].style">{{appStore.dict.operation_type[scope.row.operationType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="地址" prop="requestUri" width="200" align="left" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="方法" prop="requestMethod" width="80" align="center" sortable show-overflow-tooltip />
					<el-table-column label="结果" prop="callResult" width="80" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag v-if="scope.row.callResult!==null" :type="appStore.dict.call_result[scope.row.callResult].style">{{appStore.dict.call_result[scope.row.callResult].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="开始时间" prop="startTime" width="180" align="center" sortable show-overflow-tooltip />
					<el-table-column label="结束时间" prop="endTime" width="180" align="center" sortable show-overflow-tooltip />
					<el-table-column label="耗时" prop="cost" width="80" align="right" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="用户" prop="realName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="机构" prop="organName" width="180" align="center" sortable show-overflow-tooltip />
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
	<!-- view operation log -->
	<ViewJobLog ref="viewOperationLogRef"></ViewJobLog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, watch } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import ViewJobLog from './ViewJobLog.vue'

// import apis
import { $getOperationLogPageResult, $deleteOperationLog } from '@/api/bms/log/operationLog' 

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

// const operation time range
const operationTimeRange = ref()

// watch operation time range
watch(operationTimeRange, async ()=>{
	grid.query.manualQueryParameters.ge_start_time = operationTimeRange.value[0]
	grid.query.manualQueryParameters.le_start_time = operationTimeRange.value[1]
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
	// get operation log page result
	$getOperationLogPageResult(grid.query).then(handler=>{
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

// view operation log ref
const viewOperationLogRef = ref()

/**
 * view operation log
 */
const viewOperationLog = (operationLogId)=>{
	// no operation log id
	if(!operationLogId){
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
		// set operation log id
		operationLogId = grid.selects[0].operationLogId
	}
	// view operation log init
	viewOperationLogRef.value.init(operationLogId);
}

/**
 * delete operation log
 */
const deleteOperationLog = (operationLogId)=>{
	// defined operation log ids
	let operationLogIds = []
	// no operation log id
	if(!operationLogId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// set operation log id
		operationLogIds = grid.selects.map(select=>select.operationLogId)
	}else{
		// push operation log id
		operationLogIds.push(operationLogId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete operation log
		$deleteOperationLog(operationLogIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>