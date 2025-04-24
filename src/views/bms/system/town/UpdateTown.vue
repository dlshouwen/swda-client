<template>
	<el-dialog v-model="visible" title="编辑街道" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="town" :rules="rules" label-width="120px" @keyup.enter="updateTown">
			<el-form-item label="所属区域">
				<el-cascader :props="selectRegionProps" v-model="initRegionData" placeholder="所属区域" clearable @change="selectRegionChange" style="width:100%" />
			</el-form-item>
			<el-form-item prop="townId" label="街道编号">
				<el-input v-model="town.townId" :min="0" placeholder="请输入街道编号" disabled></el-input>
			</el-form-item>
			<el-form-item prop="townName" label="街道名称">
				<el-input v-model="town.townName" placeholder="请输入街道名称"></el-input>
			</el-form-item>
			<el-form-item prop="townFullName" label="街道全名">
				<el-input v-model="town.townFullName" placeholder="请输入街道全名"></el-input>
			</el-form-item>
			<el-form-item prop="townNamePinyin" label="街道名称拼音">
				<el-input v-model="town.townNamePinyin" placeholder="请输入街道名称拼音"></el-input>
			</el-form-item>
			<el-form-item prop="townNameFullPinyin" label="街道名称全拼">
				<el-input v-model="town.townNameFullPinyin" placeholder="请输入街道名称全拼"></el-input>
			</el-form-item>
			<el-form-item prop="postalCode" label="邮政编码">
				<el-input v-model="town.postalCode" placeholder="请输入邮政编码"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="town.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="town.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateTown"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $getTownData, $updateTown } from '@/api/bms/system/town'
import { $getRegionList } from '@/api/bms/system/region' 

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

// const town
const town = reactive({
	townId: '0',
	provinceId: '0',
	cityId: '0',
	countyId: '0',
	townName: '',
	townFullName: '',
	townNamePinyin: '',
	townNameFullPinyin: '',
	postalCode: '',
	sort: '0',
	remark: '',
})

// const rules
const rules = ref({
	townId: [{ label:'街道编号', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	provinceId: [{ label:'所属省', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	cityId: [{ label:'所属市', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	countyId: [{ label:'所属区', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	townName: [{ label:'街道名称', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	townFullName: [{ label:'街道全名', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	townNamePinyin: [{ label:'街道名称拼音', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	townNameFullPinyin: [{ label:'街道名称全拼', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	postalCode: [{ label:'邮政编码', valid:'r|l-le6', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
})

// const init region data
const initRegionData = ref()

// const select region props
const selectRegionProps = {
	lazy: true,
	label: 'regionName',
	value: 'regionId',
	leaf: 'leaf',
	checkStrictly: true,
	lazyLoad(node, resolve) {
		// get region list
		$getRegionList(node.level==0?0:node.value).then(handler=>{
			handler.data.forEach(data=>{data.leaf=!data.hasChildren})
			// resolve
			resolve(handler.data)
		})
	}
}

/**
 * select region change
 */
const selectRegionChange = (value) => {
	// set query
	town.provinceId = value.length>0?value[0]:''
	town.cityId = value.length>1?value[1]:''
	town.countyId = value.length>2?value[2]:''
}

/**
 * init
 */
const init = (townId)=>{
	// set visible
	visible.value = true
	// get town data
	getTownData(townId)
}

/**
 * get town data
 * @param townId
 */
const getTownData = async (townId)=>{
	// get town data
	let handler = await $getTownData(townId)
	// set town data
	Object.assign(town, handler.data)
	// set init region data
	initRegionData.value = [town.provinceId, town.cityId, town.countyId]
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
 * update town
 */
const updateTown = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update town
		$updateTown(town).then(()=>{
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