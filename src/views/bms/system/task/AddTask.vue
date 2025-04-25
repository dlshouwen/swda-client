<template>
	<el-dialog v-model="visible" title="新增任务" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="task" :rules="rules" label-width="120px" @keyup.enter="addTask">
			<el-form-item prop="taskCode" label="任务编码">
				<el-input v-model="task.taskCode" placeholder="请输入任务编码"></el-input>
			</el-form-item>
			<el-form-item prop="taskName" label="任务名称">
				<el-input v-model="task.taskName" placeholder="请输入任务名称"></el-input>
			</el-form-item>
			<el-form-item prop="taskGroup" label="任务分组">
				<el-radio-group v-model="task.taskGroup">
					<el-radio-button v-for="item in appStore.dict.task_group.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="taskStatus" label="任务状态">
				<el-radio-group v-model="task.taskStatus">
					<el-radio-button v-for="item in appStore.dict.task_status.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="allowConcurrent" label="允许并发">
				<el-radio-group v-model="task.allowConcurrent">
					<el-radio-button v-for="item in appStore.dict.zero_one.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="beanName" label="bean名称">
				<el-input v-model="task.beanName" placeholder="请输入bean名称"></el-input>
			</el-form-item>
			<el-form-item prop="methodName" label="方法名称">
				<el-input v-model="task.methodName" placeholder="请输入方法名称"></el-input>
			</el-form-item>
			<el-form-item prop="params" label="参数">
				<el-input v-model="task.params" placeholder="请输入参数"></el-input>
			</el-form-item>
			<el-form-item prop="coreExpression" label="core表达式">
				<el-input v-model="task.coreExpression" placeholder="请输入core表达式"></el-input>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="task.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="task.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="task.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="addTask"><sw-icon icon="save"></sw-icon>保存</el-button>
				<el-divider direction="vertical" />
				<el-button type="danger" @click="close"><sw-icon icon="close"></sw-icon>关闭</el-button>
			</el-form-item>
		</el-form>
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
import { $addTask } from '@/api/bms/system/task'

// import validator
import { validator } from '@/utils/validator'
 
// import stores
import { useAppStore } from '@/stores/app'

// const emit
const emit = defineEmits(['callback'])

// get i18n
const { t } = useI18n()

// get stores
const appStore = useAppStore()

// const visible
const visible = ref(false)

// const form ref
const formRef = ref()

// const task
const task = reactive({
	taskId: '',
	taskCode: '',
	taskName: '',
	taskGroup: '1',
	taskStatus: '0',
	allowConcurrent: '0',
	beanName: '',
	methodName: '',
	params: '',
	coreExpression: '',
	assistSearch: '',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	taskCode: [{ label:'任务编码', valid:'r|l-le200', unique: { code:'bms.system.task.task_code.add', args:[] }, lang:t, validator:validator, trigger:'blur' }],
	taskName: [{ label:'任务名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	taskGroup: [{ label:'任务分组', valid:'r|l-le20', lang:t, validator:validator, trigger:'blur' }],
	taskStatus: [{ label:'任务状态', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	allowConcurrent: [{ label:'允许并发', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	beanName: [{ label:'bean名称', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	methodName: [{ label:'方法名称', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	params: [{ label:'参数', valid:'', lang:t, validator:validator, trigger:'blur' }],
	coreExpression: [{ label:'core表达式', valid:'r|l-le40', lang:t, validator:validator, trigger:'blur' }],
	assistSearch: [{ label:'辅助查询', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
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
 * add task
 */
const addTask = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// add task
		$addTask(task).then(()=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// set visible
				visible.value = false
				// callback
				emit('callback')
			}})
		})
	})
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