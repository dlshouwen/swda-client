<template>
	<el-dialog v-model="visible" title="编辑邮件平台" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="emailPlatform" :rules="rules" label-width="120px" @keyup.enter="updateEmailPlatform">
			<el-form-item prop="emailPlatformCode" label="邮件平台编码">
				<el-input v-model="emailPlatform.emailPlatformCode" placeholder="请输入邮件平台编码"></el-input>
			</el-form-item>
			<el-form-item prop="emailPlatformName" label="邮件平台名称">
				<el-input v-model="emailPlatform.emailPlatformName" placeholder="请输入邮件平台名称"></el-input>
			</el-form-item>
			<el-form-item prop="emailPlatformType" label="邮件平台类型">
				<el-radio-group v-model="emailPlatform.emailPlatformType">
					<el-radio-button v-for="item in appStore.dict.email_platform_type.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="status" label="状态">
				<el-radio-group v-model="emailPlatform.status">
					<el-radio-button v-for="item in appStore.dict.open_close.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="groupName" label="分组名称">
				<el-input v-model="emailPlatform.groupName" placeholder="同组接口将轮询发送"></el-input>
			</el-form-item>
			<el-form-item prop="mailHost" label="邮件host">
				<el-input v-model="emailPlatform.mailHost" placeholder="请输入邮件host"></el-input>
			</el-form-item>
			<el-form-item prop="mailPort" label="邮件端口">
				<el-input-number v-model="emailPlatform.mailPort" :min="0" placeholder="请输入邮件端口"></el-input-number>
			</el-form-item>
			<el-form-item prop="mailFrom" label="邮件来源">
				<el-input v-model="emailPlatform.mailFrom" placeholder="请输入邮件来源"></el-input>
			</el-form-item>
			<el-form-item prop="mailPass" label="邮件密码">
				<el-input v-model="emailPlatform.mailPass" placeholder="请输入邮件密码"></el-input>
			</el-form-item>
			<el-form-item prop="regionId" label="区域编号">
				<el-input v-model="emailPlatform.regionId" placeholder="请输入区域编号"></el-input>
			</el-form-item>
			<el-form-item prop="endPoint" label="端点">
				<el-input v-model="emailPlatform.endPoint" placeholder="请输入端点"></el-input>
			</el-form-item>
			<el-form-item prop="accessKey" label="access key">
				<el-input v-model="emailPlatform.accessKey" placeholder="请输入access key"></el-input>
			</el-form-item>
			<el-form-item prop="secretKey" label="secret key">
				<el-input v-model="emailPlatform.secretKey" placeholder="请输入secret key"></el-input>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="emailPlatform.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="emailPlatform.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="emailPlatform.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateEmailPlatform"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $getEmailPlatformData, $updateEmailPlatform } from '@/api/bms/platform/emailPlatform'

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

// const email platform
const emailPlatform = reactive({
	emailPlatformId: '',
	emailPlatformCode: '',
	emailPlatformName: '',
	emailPlatformType: '1',
	status: '1',
	groupName: '',
	mailHost: '',
	mailPort: 0,
	mailFrom: '',
	mailPass: '',
	regionId: '',
	endPoint: '',
	accessKey: '',
	secretKey: '',
	assistSearch: '',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	emailPlatformCode: [{ label:'邮件平台编码', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	emailPlatformName: [{ label:'邮件平台名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	emailPlatformType: [{ label:'邮件平台类型', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	status: [{ label:'状态', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	groupName: [{ label:'分组名称', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	mailHost: [{ label:'邮件host', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	mailPort: [{ label:'邮件端口', valid:'integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	mailFrom: [{ label:'邮件来源', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	mailPass: [{ label:'邮件密码', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	regionId: [{ label:'区域编号', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	endPoint: [{ label:'端点', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	accessKey: [{ label:'access key', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	secretKey: [{ label:'secret key', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
	assistSearch: [{ label:'辅助查询', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * init
 */
const init = (emailPlatformId: number)=>{
	// get email platform data
	getEmailPlatformData(emailPlatformId)
	// set visible
	visible.value = true
}

/**
 * get email platform data
 * @param emailPlatformId
 */
const getEmailPlatformData = async (emailPlatformId: number)=>{
	// get email platform data
	let handler = await $getEmailPlatformData(emailPlatformId)
	// set email platform data
	Object.assign(emailPlatform, handler.data)
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
 * update email platform
 */
const updateEmailPlatform = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update email platform
		$updateEmailPlatform(emailPlatform).then(()=>{
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