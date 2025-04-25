<template>
	<el-dialog v-model="visible" title="编辑字典类型" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="dictType" :rules="rules" label-width="120px" @keyup.enter="updateDictType">
			<el-form-item prop="dictTypeName" label="字典类型名称">
				<el-input v-model="dictType.dictTypeName" placeholder="字典类型名称"></el-input>
			</el-form-item>
			<el-form-item prop="dictType" label="字典类型">
				<el-input v-model="dictType.dictType" placeholder="字典类型"></el-input>
			</el-form-item>
			<el-form-item prop="sourceType" label="来源模式">
				<el-radio-group v-model="dictType.sourceType">
					<el-radio-button v-for="item in appStore.dict.source_type.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item v-show="dictType.sourceType=='2'" prop="sourceSql" label="来源脚本">
				<el-input v-model="dictType.sourceSql" placeholder="来源脚本"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="dictType.sort" :min="0" placeholder="排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="dictType.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateDictType"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $updateDictType, $getDictTypeData } from '@/api/bms/system/dictType'

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

// const dictType
const dictType = reactive({
	dictTypeId: '',
	dictTypeName: '',
	dictType: '',
	sourceType: '1',
	sourceSql: '',
	sort: 0,
	remark: ''
})

// const rules
const rules = ref({
	dictTypeName: [{ label:'字典类型名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	dictType: [{ label:'字典类型', valid:'r|l-le200', unique:{ code:'bms.system.dict_type.dict_type.update', args:[dictType.dictTypeId] }, lang:t, validator:validator, trigger:'blur' }],
	sourceType: [{ label:'来源类型', valid:'r', lang:t, validator:validator, trigger:'blur' }],
	sourceSql: [{ label:'来源脚本', valid:'l-le800', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序号', valid:'r|integer', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-l200', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * init
 */
const init = async (dictTypeId)=>{
	// get dict type data
	await getDictTypeData(dictTypeId)
	// set visible
	visible.value = true
}

/**
 * get dict type data
 * @param dictTypeId
 */
const getDictTypeData = async (dictTypeId)=>{
	// get dict type data
	let handler = await $getDictTypeData(dictTypeId)
	// set dict type data
	Object.assign(dictType, handler.data)
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
 * update dict type
 */
const updateDictType = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update dict type
		$updateDictType(dictType).then(()=>{
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