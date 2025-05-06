<template>
	<!-- container -->
	<sw-container>
		<!-- search panel -->
		<sw-panel icon="search">
			<!-- title -->
			<template #title>查询面板</template>
			<!-- operation -->
			<template #operation>
				<sw-button type="warning" icon="redo" @click="reset">重置</sw-button>
				<sw-button type="primary" icon="search" @click="load">查询</sw-button>
			</template>
			<!-- form -->
			<el-form :model="search" :inline="true">
				<sw-input v-model="search.eq_job_id" label="任务编号" clearable style="width:130px" />
				<sw-input v-model="search.lk_job_name" label="任务名称" clearable style="width:130px" />
				<sw-select v-model="search.eq_job_status" label="任务状态" dict="job_status" clearable style="width:100px" />
			</el-form>
		</sw-panel>
		<!-- data panel -->
		<sw-panel icon="field-time" flex>
			<!-- title -->
			<template #title>任务列表</template>
			<!-- operation -->
			<template #operation>
				<sw-button authority="bms:system:job:add" type="primary" icon="plus" @click="addJob">新增</sw-button>
				<sw-button authority="bms:system:job:update" type="warning" icon="edit" @click="updateJob()">编辑</sw-button>
				<sw-button authority="bms:system:job:delete" type="danger" icon="delete" @click="deleteJob()">删除</sw-button>
				<sw-button authority="bms:system:job:pause" type="warning" icon="delete" @click="pauseJob()">暂停</sw-button>
				<sw-button authority="bms:system:job:resume" type="success" icon="delete" @click="resumeJob()">恢复</sw-button>
				<sw-button authority="bms:system:job:run" type="danger" icon="delete" @click="runJob()">运行</sw-button>
			</template>
			<!-- grid -->
			<sw-table ref="gridRef" url="/bms/system/job/page" row-key="jobId" :search="search">
				<sw-table-column type="selection" width="55" element />
				<sw-table-column label="操作" width="210" element>
					<template #default="scope">
						<sw-link authority="bms:system:job:update" type="warning" divider @click="updateJob(scope.row.jobId)">编辑</sw-link>
						<sw-link authority="bms:system:job:delete" type="danger" divider @click="deleteJob(scope.row.jobId)">删除</sw-link>
						<sw-link v-if="scope.row.jobStatus=='1'" authority="bms:system:job:pause" type="warning" divider @click="pauseJob(scope.row.jobId)">暂停</sw-link>
						<sw-link v-if="scope.row.jobStatus=='0'" authority="bms:system:job:resume" type="success" divider @click="resumeJob(scope.row.jobId)">恢复</sw-link>
						<sw-link authority="bms:system:job:run" type="danger" @click="runJob(scope.row.jobId)">运行</sw-link>
					</template>
				</sw-table-column>
				<sw-table-column data-type="number" prop="jobId" label="任务编号" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="jobCode" label="任务编码" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="jobName" label="任务名称" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="jobGroup" dict="job_group" label="任务分组" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="jobStatus" dict="job_status" label="任务状态" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="allowConcurrent" dict="zero_one" label="允许并发" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="beanName" label="bean名称" align="left" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="methodName" label="方法名称" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="params" label="参数" align="left" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="cronExpression" label="cron表达式" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="assistSearch" label="辅助查询" width="120" fast="lk" />
				<sw-table-column data-type="number" prop="sort" label="排序码" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="remark" label="备注" align="left" width="120" fast="lk" />
				<sw-table-column data-type="date" prop="createTime" label="创建时间" width="180" fast="range" />
			</sw-table>
		</sw-panel>
	</sw-container>
	<!-- add job -->
	<AddJob ref="addJobRef" @callback="load"></AddJob>
	<!-- update job -->
	<UpdateJob ref="updateJobRef" @callback="load"></UpdateJob>
</template>

<script setup lang="ts">
// import vue elements
import { ref } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddJob from './AddJob.vue'
import UpdateJob from './UpdateJob.vue'

// import apis
import { $deleteJob, $pauseJob, $resumeJob, $runJob } from '@/api/bms/system/job' 

// const grid ref
const gridRef = ref()

// const search
const search = ref({})

/**
 * reset
 */
const reset = ()=>{
	// reset
	search.value = {}
}

/**
 * load
 */
const load = ()=>{
	// load
	gridRef.value.load()
}

// add job ref
const addJobRef = ref()

/**
 * add job
 */
const addJob = ()=>{
	// add job init
	addJobRef.value.init();
}

// update job ref
const updateJobRef = ref()

/**
 * update job
 */
const updateJob = (jobId: number)=>{
	// no job id
	if(!jobId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个任务。')
			// return
			return
		}
		// select more then 1
		if(selects.length>1){
			// warning
			ElMessage.warning('只能选择一个任务。')
			// return
			return
		}
		// set job id
		jobId = selects[0].jobId
	}
	// update job init
	updateJobRef.value.init(jobId);
}

/**
 * delete job
 */
const deleteJob = async (jobId: number)=>{
	// defined job ids
	let jobIds = []
	// no job id
	if(!jobId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个任务。')
			// return
			return
		}
		// set job id
		jobIds = selects.map(select=>select.jobId)
	}else{
		// push job id
		jobIds.push(jobId)
	}
	// confirm
	await ElMessageBox.confirm('确认删除吗？', '提示', { type: 'warning' })
	// delete job
	await $deleteJob(jobIds)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: load })
}

/**
 * pause job
 */
const pauseJob = async (jobId: number)=>{
	// defined job ids
	let jobIds = []
	// no job id
	if(!jobId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个任务。')
			// return
			return
		}
		// set job id
		jobIds = selects.map(select=>select.jobId)
	}else{
		// push job id
		jobIds.push(jobId)
	}
	// confirm
	await ElMessageBox.confirm('确认暂停吗？', '提示', { type: 'warning' })
	// pause job
	await $pauseJob(jobIds)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: load })
}

/**
 * resume job
 */
const resumeJob = async (jobId: number)=>{
	// defined job ids
	let jobIds = []
	// no job id
	if(!jobId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个任务。')
			// return
			return
		}
		// set job id
		jobIds = selects.map(select=>select.jobId)
	}else{
		// push job id
		jobIds.push(jobId)
	}
	// confirm
	await ElMessageBox.confirm('确认恢复吗？', '提示', { type: 'warning' })
	// resume job
	await $resumeJob(jobIds)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: load })
}

/**
 * run job
 */
const runJob = async (jobId: number)=>{
	// defined job ids
	let jobIds = []
	// no job id
	if(!jobId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个任务。')
			// return
			return
		}
		// set job id
		jobIds = selects.map(select=>select.jobId)
	}else{
		// push job id
		jobIds.push(jobId)
	}
	// confirm
	await ElMessageBox.confirm('确认运行吗？', '提示', { type: 'warning' })
	// run job
	await $runJob(jobIds)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: load })
}
</script>