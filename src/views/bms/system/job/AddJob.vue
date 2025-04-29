<template>
	<!-- dialog -->
	<el-dialog v-model="visible" title="新增任务" :close-on-click-modal="false" draggable width="480px">
		<!-- form -->
		<el-form ref="formRef" :model="job" label-width="120px" @keyup.enter="addJob">
			<!-- items -->
			<sw-input prop="jobCode" v-model="job.jobCode" label="任务编码" valid="r|english_number|l-le200" valid-unique="bms.system.job.job_code.add" />
			<sw-input prop="jobName" v-model="job.jobName" label="任务名称" valid="r|l-le400" />
			<sw-radio-group prop="jobGroup" v-model="job.jobGroup" label="任务分组" dict="job_group" valid="r|l-le2" />
			<sw-radio-group prop="jobStatus" v-model="job.jobStatus" label="任务状态" dict="job_status" valid="r|l-le2" />
			<sw-radio-group prop="allowConcurrent" v-model="job.allowConcurrent" label="允许并发" dict="zero_one" valid="r|l-le2" />
			<sw-input prop="beanName" v-model="job.beanName" label="Bean名称" valid="r|l-le200" />
			<sw-input prop="methodName" v-model="job.methodName" label="方法名称" valid="r|l-le200" />
			<sw-input type="textarea" prop="params" v-model="job.params" label="参数" :autosize="{ minRows:2, maxRows:4 }" />
			<sw-input prop="cronExpression" v-model="job.cronExpression" label="Cron表达式" valid="r|l-le40" />
			<sw-input prop="assistSearch" v-model="job.assistSearch" label="辅助查询" valid="l-le400" />
			<sw-input type="number" prop="sort" v-model="job.sort" label="排序码" valid="r|integer|l-le11" />
			<sw-input type="textarea" prop="remark" v-model="job.remark" label="备注" :autosize="{ minRows:2, maxRows:4 }" valid="l-le200" />
			<!-- operation -->
			<el-form-item>
				<sw-button type="warning" icon="undo" @click="reset">重置</sw-button>
				<sw-button authority="bms:system:job:add" type="success" icon="save" divider @click="addJob">保存</sw-button>
				<sw-button type="danger" icon="close" @click="close">关闭</sw-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive } from 'vue'

// import element plus elements
import { ElMessage } from 'element-plus'

// import apis
import { $addJob } from '@/api/bms/system/job'

// const emit
const emit = defineEmits(['callback'])

// const visible
const visible = ref(false)

// const form ref
const formRef = ref()

// const job
const job = reactive({
	jobId: 0,
	jobCode: '',
	jobName: '',
	jobGroup: '1',
	jobStatus: '0',
	allowConcurrent: '0',
	beanName: '',
	methodName: '',
	params: '',
	cronExpression: '',
	assistSearch: '',
	sort: 0,
	remark: '',
})

/**
 * init
 */
const init = ()=>{
	// reset data
	reset()
	// set visible
	visible.value = true
}

/**
 * reset
 */
const reset = ()=>{
	// has form ref
	if (formRef.value) {
		// reset
		formRef.value.resetFields()
	}
}

/**
 * add job
 */
const addJob = async ()=>{
	// valid
	let valid = await formRef.value.validate()
	// unpass
	if(!valid){
		return false
	}
	// add job
	await $addJob(job)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: close })
}

/**
 * close
 */
const close = ()=>{
	// set visible
	visible.value = false
	// callback
	emit('callback')
}

// expose
defineExpose({ init })
</script>