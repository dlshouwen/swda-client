<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="任务编号">
					<el-input v-model="grid.query.manualQueryParameters.eq_task_id" placeholder="请输入任务编号" clearable style="width:130px" />
				</el-form-item>
				<el-form-item label="任务名称">
					<el-input v-model="grid.query.manualQueryParameters.lk_task_name" placeholder="请输入任务名称" clearable style="width:130px" />
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
					<el-button type="primary" @click="addTask"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateTask()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteTask()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="200" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateTask(scope.row.taskId)">编辑</el-button>
							<el-button link type="danger" @click="deleteTask(scope.row.taskId)">删除</el-button>
							<el-button link type="success" v-if="scope.row.taskStatus=='0'" @click="openTask(scope.row.taskId)">启用</el-button>
							<el-button link type="danger" v-if="scope.row.taskStatus=='1'" @click="pauseTask(scope.row.taskId)">暂停</el-button>
							<el-button link type="primary" @click="executeTask(scope.row.taskId)">执行</el-button>
						</template>
					</el-table-column>
					<el-table-column label="任务编号" prop="taskId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="任务编码" prop="taskCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="任务名称" prop="taskName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="任务分组" prop="taskGroup" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.task_group[scope.row.taskGroup].style">{{appStore.dict.task_group[scope.row.taskGroup].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="任务状态" prop="taskStatus" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.task_status[scope.row.taskStatus].style">{{appStore.dict.task_status[scope.row.taskStatus].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="允许并发" prop="allowConcurrent" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.zero_one[scope.row.allowConcurrent].style">{{appStore.dict.zero_one[scope.row.allowConcurrent].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="bean名称" prop="beanName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="方法名称" prop="methodName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="core表达式" prop="coreExpression" width="160" align="center" sortable show-overflow-tooltip />
					<el-table-column label="排序" prop="sort" width="90" align="center" sortable show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
			<!-- pagination -->
			<el-row class="panel-pagination">
				<el-pagination v-model:current-page="grid.query.page.current" v-model:page-size="grid.query.page.size" :page-sizes="grid.option.sizes"
					:layout="grid.option.layout" :total="grid.total" @size-change="search" @current-change="search" />
			</el-row>
		</el-card>
	</el-container>
	<!-- add task -->
	<AddTask ref="addTaskRef" @callback="search"></AddTask>
	<!-- update task -->
	<UpdateTask ref="updateTaskRef" @callback="search"></UpdateTask>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddTask from './AddTask.vue'
import UpdateTask from './UpdateTask.vue'

// import apis
import { $getTaskPageResult, $openTask, $pauseTask, $executeTask, $deleteTask } from '@/api/bms/system/task' 

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
	// get task page result
	$getTaskPageResult(grid.query).then(handler=>{
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

// add task ref
const addTaskRef = ref()

/**
 * add task
 */
const addTask = ()=>{
	// add task init
	addTaskRef.value.init();
}

// update task ref
const updateTaskRef = ref()

/**
 * update task
 */
const updateTask = (taskId)=>{
	// no task id
	if(!taskId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个任务。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个任务。', type: 'warning' })
			// return
			return
		}
		// set task id
		taskId = grid.selects[0].taskId
	}
	// update task init
	updateTaskRef.value.init(taskId);
}

/**
 * open task
 */
const openTask = (taskId)=>{
	// defined task ids
	let taskIds = []
	// no task id
	if(!taskId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个任务。', type: 'warning' })
			// return
			return
		}
		// set task id
		taskIds = grid.selects.map(select=>select.taskId)
	}else{
		// push task id
		taskIds.push(taskId)
	}
	// confirm
	ElMessageBox.confirm('确认开启吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// open task
		$openTask(taskIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}

/**
 * pause task
 */
const pauseTask = (taskId)=>{
	// defined task ids
	let taskIds = []
	// no task id
	if(!taskId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个任务。', type: 'warning' })
			// return
			return
		}
		// set task id
		taskIds = grid.selects.map(select=>select.taskId)
	}else{
		// push task id
		taskIds.push(taskId)
	}
	// confirm
	ElMessageBox.confirm('确认暂停吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// pause task
		$pauseTask(taskIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}

/**
 * execute task
 */
const executeTask = (taskId)=>{
	// defined task ids
	let taskIds = []
	// no task id
	if(!taskId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个任务。', type: 'warning' })
			// return
			return
		}
		// set task id
		taskIds = grid.selects.map(select=>select.taskId)
	}else{
		// push task id
		taskIds.push(taskId)
	}
	// confirm
	ElMessageBox.confirm('确认执行吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// execute task
		$executeTask(taskIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}

/**
 * delete task
 */
const deleteTask = (taskId)=>{
	// defined task ids
	let taskIds = []
	// no task id
	if(!taskId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个任务。', type: 'warning' })
			// return
			return
		}
		// set task id
		taskIds = grid.selects.map(select=>select.taskId)
	}else{
		// push task id
		taskIds.push(taskId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete task
		$deleteTask(taskIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>