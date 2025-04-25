<template>
	<el-dialog v-model="visible" title="编辑区域" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="region" :rules="rules" label-width="120px" @keyup.enter="updateRegion">
			<el-form-item prop="preRegionId" label="所属区域">
				<el-input v-model="region.preRegionFullName" :min="0" placeholder="请输入上级区域编号" disabled></el-input>
			</el-form-item>
			<el-form-item prop="regionId" label="区域编号">
				<el-input v-model="region.regionId" :min="0" placeholder="请输入区域编号" disabled></el-input>
			</el-form-item>
			<el-form-item prop="regionType" label="区域类型">
				<el-radio-group v-model="region.regionType">
					<el-radio-button v-for="item in appStore.dict.region_type.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="regionName" label="区域名称">
				<el-input v-model="region.regionName" placeholder="请输入区域名称"></el-input>
			</el-form-item>
			<el-form-item prop="regionFullName" label="区域全名">
				<el-input v-model="region.regionFullName" placeholder="请输入区域全名"></el-input>
			</el-form-item>
			<el-form-item prop="regionNamePinyin" label="区域名称拼音">
				<el-input v-model="region.regionNamePinyin" placeholder="请输入区域名称拼音"></el-input>
			</el-form-item>
			<el-form-item prop="regionNameFullPinyin" label="区域名称全拼">
				<el-input v-model="region.regionNameFullPinyin" placeholder="请输入区域名称全拼"></el-input>
			</el-form-item>
			<el-form-item prop="postalCode" label="邮政编码">
				<el-input v-model="region.postalCode" placeholder="请输入邮政编码"></el-input>
			</el-form-item>
			<el-form-item prop="isOpen" label="是否启用">
				<el-radio-group v-model="region.isOpen">
					<el-radio-button v-for="item in appStore.dict.open_close.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="isHot" label="是否热门">
				<el-radio-group v-model="region.isHot">
					<el-radio-button v-for="item in appStore.dict.zero_one.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="region.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="region.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateRegion"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $getRegionList, $getRegionData, $updateRegion } from '@/api/bms/system/region'

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

// const region
const region = reactive({
	regionId: '',
	preRegionId: '0',
	preRegionFullName: '',
	regionType: '1',
	regionName: '',
	regionFullName: '',
	regionNamePinyin: '',
	regionNameFullPinyin: '',
	postalCode: '',
	isOpen: '1',
	isHot: '0',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	regionId: [{ label:'区域编号', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	preRegionId: [{ label:'上级区域编号', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	regionType: [{ label:'区域类型', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	regionName: [{ label:'区域名称', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	regionFullName: [{ label:'区域全名', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	regionNamePinyin: [{ label:'区域名称拼音', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	regionNameFullPinyin: [{ label:'区域名称全拼', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	postalCode: [{ label:'邮政编码', valid:'r|l-le6', lang:t, validator:validator, trigger:'blur' }],
	isOpen: [{ label:'是否启用', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	isHot: [{ label:'是否热门', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * init
 */
const init = async (regionId:number)=>{
	// get region data
	await getRegionData(regionId)
	// set visible
	visible.value = true
}

/**
 * get region data
 * @param regionId
 */
const getRegionData = async (regionId:number)=>{
	// get region data
	let handler = await $getRegionData(regionId)
	// set region data
	Object.assign(region, handler.data)
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
 * update region
 */
const updateRegion = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update region
		$updateRegion(region).then(()=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// set visible
				visible.value = false
				// callback
				emit('callback', region.preRegionId)
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