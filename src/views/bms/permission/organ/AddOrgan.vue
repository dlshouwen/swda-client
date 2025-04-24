<template>
	<el-dialog v-model="visible" title="新增机构" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="organ" :rules="rules" label-width="120px" @keyup.enter="addOrgan">
			<el-form-item prop="preOrganId" label="所属机构">
				<el-tree-select v-model="organ.preOrganId" :data="organList" check-strictly :render-after-expand="false" />
			</el-form-item>
			<el-form-item prop="preOrganId" label="所属区域">
				<el-cascader :props="selectRegionProps" placeholder="所属区域" clearable @change="selectRegionChange" style="width:100%" />
			</el-form-item>
			<el-form-item prop="organCode" label="机构编码">
				<el-input v-model="organ.organCode" placeholder="请输入机构编码"></el-input>
			</el-form-item>
			<el-form-item prop="organName" label="机构名称">
				<el-input v-model="organ.organName" placeholder="请输入机构名称"></el-input>
			</el-form-item>
			<el-form-item prop="contact" label="联系人">
				<el-input v-model="organ.contact" placeholder="请输入联系人"></el-input>
			</el-form-item>
			<el-form-item prop="contactPhone" label="联系电话">
				<el-input v-model="organ.contactPhone" placeholder="请输入联系电话"></el-input>
			</el-form-item>
			<el-form-item prop="longitude" label="经度">
				<el-input-number v-model="organ.longitude" :min="0" placeholder="请输入经度"></el-input-number>
			</el-form-item>
			<el-form-item prop="latitude" label="纬度">
				<el-input-number v-model="organ.latitude" :min="0" placeholder="请输入纬度"></el-input-number>
			</el-form-item>
			<el-form-item prop="address" label="详细地址">
				<el-input v-model="organ.address" placeholder="请输入详细地址"></el-input>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="organ.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="organ.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="organ.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="addOrgan"><sw-icon icon="save"></sw-icon>保存</el-button>
				<el-divider direction="vertical" />
				<el-button type="danger" @click="close"><sw-icon icon="close"></sw-icon>关闭</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, watch } from 'vue'

// import element plus elements
import { ElMessage } from 'element-plus'

// import use i18n
import { useI18n } from 'vue-i18n'

// import apis
import { $getOrganList, $addOrgan } from '@/api/bms/permission/organ'
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

// const organ
const organ = reactive({
	organId: '',
	preOrganId: '',
	organCode: '',
	organName: '',
	contact: '',
	contactPhone: '',
	longitude: 0,
	latitude: 0,
	provinceId: '',
	cityId: '',
	countyId: '',
	address: '',
	assistSearch: '',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	organCode: [{ label:'机构编码', valid:'r|l-le200', unique: { code:'bms.permission.organ.organ_code.add', args:[] }, lang:t, validator:validator, trigger:'blur' }],
	organName: [{ label:'机构名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	contact: [{ label:'联系人', valid:'r|l-le20', lang:t, validator:validator, trigger:'blur' }],
	contactPhone: [{ label:'联系电话', valid:'r|l-le20', lang:t, validator:validator, trigger:'blur' }],
	longitude: [{ label:'经度', valid:'r|double|l-le2016', lang:t, validator:validator, trigger:'blur' }],
	latitude: [{ label:'纬度', valid:'r|double|l-le2016', lang:t, validator:validator, trigger:'blur' }],
	provinceId: [{ label:'所属省', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	cityId: [{ label:'所属市', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	countyId: [{ label:'所属区', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	address: [{ label:'详细地址', valid:'r|l-le600', lang:t, validator:validator, trigger:'blur' }],
	assistSearch: [{ label:'辅助查询', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
})

// const organ list
const organList = ref()

// const select region props
const selectRegionProps = {
	lazy: true,
	label: 'regionName',
	value: 'regionId',
	leaf: 'leaf',
	lazyLoad(node, resolve) {
		// get region list
		$getRegionList(node.level==0?0:node.value).then(handler=>{
			// set leaf
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
	organ.provinceId = value.length>0?value[0]:''
	organ.cityId = value.length>1?value[1]:''
	organ.countyId = value.length>2?value[2]:''
}

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
	// get organ list
	getOrganList()
	// has form ref
	if (formRef.value) {
		// reset
		formRef.value.resetFields()
	}
}

/**
 * get organ list
 */
const getOrganList = ()=>{
	// get organ list
	$getOrganList(organ.systemId).then(handler=>{
		// set organ list
		organList.value = handler.data
		// set pre organ id
		organ.preOrganId = organ.systemId
	})
}

/**
 * add organ
 */
const addOrgan = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// add organ
		$addOrgan(organ).then(()=>{
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