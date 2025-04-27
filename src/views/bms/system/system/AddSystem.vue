<template>
	<el-dialog v-model="visible" title="新增系统" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="system" :rules="rules" label-width="120px" @keyup.enter="addSystem">
			<el-form-item prop="systemCode" label="系统编码">
				<el-input v-model="system.systemCode" placeholder="请输入系统编码"></el-input>
			</el-form-item>
			<el-form-item prop="systemName" label="系统名称">
				<el-input v-model="system.systemName" placeholder="请输入系统名称"></el-input>
			</el-form-item>
			<el-form-item prop="icon" label="图标">
				<el-input v-model="system.icon" placeholder="请输入图标"></el-input>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="system.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="system.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="system.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<sw-button type="success" @click="addSystem"><sw-icon icon="save" authority="bms:system:system:add"></sw-icon>保存</sw-button>
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
import { $addSystem } from '@/api/bms/system/system'

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

// const system
const system = reactive({
	systemId: '0',
	systemCode: '',
	systemName: '',
	icon: '',
	assistSearch: '',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	systemCode: [{ label:'系统编码', valid:'r|l-le200', unique:{ code:'bms.system.system.system_code.add', args:[] }, lang:t, validator:validator, trigger:'blur' }],
	systemName: [{ label:'系统名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	icon: [{ label:'图标', valid:'r|l-le40', lang:t, validator:validator, trigger:'blur' }],
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
 * add system
 */
const addSystem = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// add system
		$addSystem(system).then(()=>{
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