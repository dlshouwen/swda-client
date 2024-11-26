<template>
	<!-- container -->
	<div class="container">
		<!-- search -->
		<div class="panel search-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="search">查询面板</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="default" :underline="false" icon="search" @click.stop="load" divider>查询 (Q)</sw-link>
					<sw-link class="link-layout" type="warning" :underline="false" icon="refresh-left" @click.stop="reset">重置 (R)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div class="search">
					<label>任务编号：</label>
					<span><el-input v-model="search.eq_task_id" placeholder="请输入任务编号"></el-input></span>
					<label>任务编码：</label>
					<span><el-input v-model="search.lk_task_code" placeholder="请输入任务编码"></el-input></span>
					<label>任务名称：</label>
					<span><el-input v-model="search.lk_task_name" placeholder="请输入任务名称"></el-input></span>
					<label style="flex-basis:42px;">状态：</label>
					<span style="flex-basis:80px;">
						<el-select v-model="search.eq_task_status" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.task_status" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label>永不过期：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_is_never_overdue" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.zero_one" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label>辅助查询：</label>
					<span style="flex:1;"><el-input style="width:100%;" v-model="search.lk_assist_search" placeholder="请输入辅助查询"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="compass">任务管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addTask();" permission="bms:system:task:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateTask();" permission="bms:system:task:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="success" :underline="false" icon="video-play" @click.stop="startTask();" permission="bms:system:task:start" divider>启动任务 (S)</sw-link>
					<sw-link class="link-layout" type="warning" :underline="false" icon="video-pause" @click.stop="stopTask();" permission="bms:system:task:stop" divider>停止任务 (P)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteTask();" permission="bms:system:task:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="taskGrid" id="task_list" title="任务列表" url="/bms/system/task/list" row-key="taskId" :search="search" :height="height"
						@row-dblclick="row=>{updateTask(row.taskId)}" @selection-change="selection=>{selectTasks=selection}">
						<sw-column type="selection" key="taskId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="90" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateTask(scope.row.taskId)" permission="bms:system:task:update" divider></sw-link>
								<template v-if="scope.row.taskStatus=='0'">
									<sw-link type="success" :underline="false" icon="video-play" @click.stop="startTask(scope.row.taskId)" permission="bms:system:task:start" divider></sw-link>
								</template>
								<template v-if="scope.row.taskStatus=='1'">
									<sw-link type="warning" :underline="false" icon="video-pause" @click.stop="stopTask(scope.row.taskId)" permission="bms:system:task:stop" divider></sw-link>
								</template>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteTask(scope.row.taskId)" permission="bms:system:task:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="taskId" label="任务编号" width="100" data-type="number" fast="eq"></sw-column>
						<sw-column id="taskCode" label="任务编码" width="100" fast="lk"></sw-column>
						<sw-column id="taskName" label="任务名称" width="100" fast="lk"></sw-column>
						<sw-column id="taskStatus" label="任务状态" width="90" :dict="dataStore.dict.task_status" fast="eq" fast-type="radio">
							<template #default="scope">
								<template v-if="scope.row.taskStatus=='1'"><sw-link type="success" :underline="false"><b>已启动</b></sw-link></template>
								<template v-if="scope.row.taskStatus=='0'"><sw-link type="danger" :underline="false"><b>未启动</b></sw-link></template>
							</template>
						</sw-column>
						<sw-column id="isNeverOverdue" label="永不过期" width="90" :dict="dataStore.dict.zero_one" fast="eq" fast-type="radio" hide></sw-column>
						<sw-column id="overdueTime" label="过期时间" width="148" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm:ss" fast="range" hide></sw-column>
						<sw-column id="overdueInfo" label="过期情况" width="148" :fast="false" :advance="false" :export="false" :print="false">
							<template #default="scope">
								<template v-if="scope.row.isNeverOverdue=='1'"><sw-link type="success" :underline="false"><b>永不过期</b></sw-link></template>
								<template v-if="scope.row.isNeverOverdue=='0'"><sw-link type="danger" :underline="false"><b>{{tool.formatDate(new Date(scope.row.overdueTime), 'yyyy-MM-dd hh:mm:ss')}}</b></sw-link></template>
							</template>
						</sw-column>
						<sw-column id="isAllUser" label="全用户" width="80" :dict="dataStore.dict.zero_one" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="permissionName" label="响应功能" width="140" fast="lk" info></sw-column>
						<sw-column id="remark" label="备注" width="120" fast="lk"></sw-column>
						<sw-column id="creatorName" label="创建人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="createTime" label="创建时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
						<sw-column id="editorName" label="编辑人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="editTime" label="编辑时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="新增" center width="1000px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddTask></AddTask>
		</el-dialog>
		<el-dialog title="编辑" center width="1000px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateTask :taskId="currentTaskId"></UpdateTask>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get task list, delete task, start task, stop task
import { $getTaskList, $deleteTask, $startTask, $stopTask } from '@/assets/config/api';

// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

// import key
import key from 'keymaster';

// import tool
import * as tool from '@/assets/utils/tool';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// import components: add task & update task
import AddTask from '@/views/bms/system/task/AddTask';
import UpdateTask from '@/views/bms/system/task/UpdateTask';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_task_id: '', lk_task_code: '', lk_task_name: '', eq_task_status: '', eq_is_never_overdue: '', lk_assist_search: '' },
	// show
	show: { add: false, update: false },
	// current task id
	currentTaskId: '',
	// select tasks
	selectTasks: [],
});

// to refs
const { height, search, show, currentTaskId, selectTasks } = toRefs(state);

// ref
const taskGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_task_id: '', lk_task_code: '', lk_task_name: '', eq_task_status: '', eq_is_never_overdue: '', lk_assist_search: '' };
}

/**
 * resize
 */
const resize = () => {
	state.height = gridContainer.value.offsetHeight-36;
}

/**
 * load
 */
const load = () => {
	taskGrid.value.load();
}

/**
 * add task
 */
const addTask = () => {
	state.show.add = true;
}

/**
 * update task
 * @param taskId
 */
const updateTask = (taskId) => {
	// param invalid
	if(taskId===undefined||taskId===null){
		// no select
		if(state.selectTasks.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		taskId = state.selectTasks[0].taskId;
	}
	// set current task id
	state.currentTaskId = taskId;
	// show update task
	state.show.update = true;
}

/**
 * delete task
 * @param taskIds
 */
const deleteTask = (taskIds) => {
	// param invalid
	if(!taskIds){
		// no select
		if(state.selectTasks.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		taskIds = state.selectTasks.map(task=>task.taskId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除任务信息？', '警告').then(()=>{
		// delete task
		$deleteTask({taskIds:taskIds}).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success(handler.data.message);
				// load
				load();
			}
		});
	}).catch(()=>{});
}

/**
 * start task
 * @param taskIds
 */
const startTask = (taskIds) => {
	// param invalid
	if(!taskIds){
		// no select
		if(state.selectTasks.length<=0){
			ElMessage.warning('未选择需要启用的数据。');
			return;
		}
		// set selects
		taskIds = state.selectTasks.map(task=>task.taskId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定启用任务信息？', '警告').then(()=>{
		// start task
		$startTask({taskIds:taskIds}).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success(handler.data.message);
				// load
				load();
			}
		});
	}).catch(()=>{});
}

/**
 * stop task
 * @param taskIds
 */
const stopTask = (taskIds) => {
	// param invalid
	if(!taskIds){
		// no select
		if(state.selectTasks.length<=0){
			ElMessage.warning('未选择需要禁用的数据。');
			return;
		}
		// set selects
		taskIds = state.selectTasks.map(task=>task.taskId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定禁用任务信息？', '警告').then(()=>{
		// stop task
		$stopTask({taskIds:taskIds}).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success(handler.data.message);
				// load
				load();
			}
		});
	}).catch(()=>{});
}

// watch
watch(()=>state.search, ()=>{ load() }, {deep: true}) 

// load data
onMounted(()=>{
	load();
})

// set grid height
window.onresize = resize;
nextTick(resize);

// hotkey
key('alt+q', ()=>{ load();return false; });
key('alt+r', ()=>{ reset();return false; });
key('alt+a', ()=>{ addTask();return false; });
key('alt+u', ()=>{ updateTask();return false; });
key('alt+d', ()=>{ deleteTask();return false; });
key('alt+s', ()=>{ startTask();return false; });
key('alt+p', ()=>{ stopTask();return false; });
</script>