<template>
	<el-dialog v-model="visible" title="新增字典" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="dict" :rules="rules" label-width="120px" @keyup.enter="addDict">
			<el-form-item prop="dictName" label="字典名称">
				<el-input v-model="dict.dictName" placeholder="字典名称"></el-input>
			</el-form-item>
			<el-form-item prop="dictLabel" label="字典名称">
				<el-input v-model="dict.dictLabel" placeholder="字典名称"></el-input>
			</el-form-item>
			<el-form-item prop="dictValue" label="字典值">
				<el-input v-model="dict.dictValue" placeholder="字典值"></el-input>
			</el-form-item>
			<el-form-item prop="dictStyle" label="字典样式">
				<el-radio-group v-model="dict.dictStyle">
					<el-radio-button label="info" value="info" />
					<el-radio-button label="primary" value="primary" />
					<el-radio-button label="warning" value="warning" />
					<el-radio-button label="danger" value="danger" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="dict.sort" :min="0" placeholder="排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="dict.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="addDict"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $addDict } from '@/api/bms/system/dict'

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

// const dict
const dict = reactive({
	dictId: '',
	dictName: '',
	dictType: '',
	dictLabel: '',
	dictValue: '',
	dictStyle: 'info',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	dictName: [{ label:'字典名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	dictLabel: [{ label:'字典标签', valid:'r|-le400', lang:t, validator:validator, trigger:'blur' }],
	dictValue: [{ label:'字典值', valid:'r|l-le200', unique:{ code:'bms.system.dict.dict_value.add', args:[dict.dictType] }, lang:t, validator:validator, trigger:'blur' }],
	dictStyle: [{ label:'字典样式', valid:'r', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-l200', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * init
 */
const init = (dictType:string)=>{
	// set dict type
	dict.dictType = dictType
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
 * add dict
 */
const addDict = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// add dict
		$addDict(dict).then(()=>{
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