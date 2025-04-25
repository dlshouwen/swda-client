<template>
	<el-dialog v-model="visible" title="编辑短信平台" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="smsPlatform" :rules="rules" label-width="120px" @keyup.enter="updateSmsPlatform">
			<el-form-item prop="smsPlatformCode" label="短信平台编码">
				<el-input v-model="smsPlatform.smsPlatformCode" placeholder="请输入短信平台编码"></el-input>
			</el-form-item>
			<el-form-item prop="smsPlatformName" label="短信平台名称">
				<el-input v-model="smsPlatform.smsPlatformName" placeholder="请输入短信平台名称"></el-input>
			</el-form-item>
			<el-form-item prop="smsPlatformType" label="短信平台类型">
				<el-radio-group v-model="smsPlatform.smsPlatformType">
					<el-radio-button v-for="item in appStore.dict.sms_platform_type.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="status" label="状态">
				<el-radio-group v-model="smsPlatform.status">
					<el-radio-button v-for="item in appStore.dict.open_close.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-divider />
			<template v-if="smsPlatform.smsPlatformType==='1'">
				<el-form-item prop="signName" label="签名名称">
					<el-input v-model="smsPlatform.signName" placeholder="请输入签名名称"></el-input>
				</el-form-item>
				<el-form-item prop="templateId" label="模板编号">
					<el-input v-model="smsPlatform.templateId" placeholder="请输入模板编号"></el-input>
				</el-form-item>
				<el-form-item prop="accessKey" label="access key">
					<el-input v-model="smsPlatform.accessKey" placeholder="请输入access key"></el-input>
				</el-form-item>
				<el-form-item prop="secretKey" label="secret key">
					<el-input v-model="smsPlatform.secretKey" placeholder="请输入secret key"></el-input>
				</el-form-item>
			</template>
			<template v-if="smsPlatform.smsPlatformType==='2'">
				<el-form-item prop="appId" label="应用编号">
					<el-input v-model="smsPlatform.appId" placeholder="请输入应用编号"></el-input>
				</el-form-item>
				<el-form-item prop="signName" label="签名名称">
					<el-input v-model="smsPlatform.signName" placeholder="请输入签名名称"></el-input>
				</el-form-item>
				<el-form-item prop="templateId" label="模板编号">
					<el-input v-model="smsPlatform.templateId" placeholder="请输入模板编号"></el-input>
				</el-form-item>
				<el-form-item prop="accessKey" label="access key">
					<el-input v-model="smsPlatform.accessKey" placeholder="请输入access key"></el-input>
				</el-form-item>
				<el-form-item prop="secretKey" label="secret key">
					<el-input v-model="smsPlatform.secretKey" placeholder="请输入secret key"></el-input>
				</el-form-item>
				<el-form-item prop="senderId" label="发送人编号">
					<el-input v-model="smsPlatform.senderId" placeholder="请输入发送人编号"></el-input>
				</el-form-item>
			</template>
			<template v-if="smsPlatform.smsPlatformType==='3'">
				<el-form-item prop="templateId" label="模板编号">
					<el-input v-model="smsPlatform.templateId" placeholder="请输入模板编号"></el-input>
				</el-form-item>
				<el-form-item prop="accessKey" label="access key">
					<el-input v-model="smsPlatform.accessKey" placeholder="请输入access key"></el-input>
				</el-form-item>
				<el-form-item prop="secretKey" label="secret key">
					<el-input v-model="smsPlatform.secretKey" placeholder="请输入secret key"></el-input>
				</el-form-item>
			</template>
			<template v-if="smsPlatform.smsPlatformType==='4'">
				<el-form-item prop="url" label="接入地址">
					<el-input v-model="smsPlatform.url" placeholder="请输入接入地址"></el-input>
				</el-form-item>
				<el-form-item prop="signName" label="签名名称">
					<el-input v-model="smsPlatform.signName" placeholder="请输入签名名称"></el-input>
				</el-form-item>
				<el-form-item prop="templateId" label="模板编号">
					<el-input v-model="smsPlatform.templateId" placeholder="请输入模板编号"></el-input>
				</el-form-item>
				<el-form-item prop="accessKey" label="access key">
					<el-input v-model="smsPlatform.accessKey" placeholder="请输入access key"></el-input>
				</el-form-item>
				<el-form-item prop="secretKey" label="secret key">
					<el-input v-model="smsPlatform.secretKey" placeholder="请输入secret key"></el-input>
				</el-form-item>
			</template>
			<el-divider />
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="smsPlatform.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="smsPlatform.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="smsPlatform.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateSmsPlatform"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $getSmsPlatformData, $updateSmsPlatform } from '@/api/bms/platform/smsPlatform'

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

// const sms platform
const smsPlatform = reactive({
	smsPlatformId: null,
	smsPlatformCode: '',
	smsPlatformName: '',
	smsPlatformType: '1',
	status: '1',
	signName: '',
	templateId: '',
	appId: '',
	senderId: '',
	url: '',
	accessKey: '',
	secretKey: '',
	assistSearch: '',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	smsPlatformCode: [{ label:'短信平台编码', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	smsPlatformName: [{ label:'短信平台名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	smsPlatformType: [{ label:'短信平台类型', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	status: [{ label:'状态', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	signName: [{ label:'签名名称', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	templateId: [{ label:'模板编号', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	appId: [{ label:'应用编号', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	senderId: [{ label:'发送人编号', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	url: [{ label:'接入地址', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	accessKey: [{ label:'access key', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	secretKey: [{ label:'secret key', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	assistSearch: [{ label:'辅助查询', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * init
 */
const init = (smsPlatformId: number)=>{
	// get sms platform data
	getSmsPlatformData(smsPlatformId)
	// set visible
	visible.value = true
}

/**
 * get sms platform data
 * @param smsPlatformId
 */
const getSmsPlatformData = async (smsPlatformId: number)=>{
	// get sms platform data
	let handler = await $getSmsPlatformData(smsPlatformId)
	// set sms platform data
	Object.assign(smsPlatform, handler.data)
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
 * update sms platform
 */
const updateSmsPlatform = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update sms platform
		$updateSmsPlatform(smsPlatform).then(()=>{
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