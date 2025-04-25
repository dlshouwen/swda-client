<template>
	<el-dialog v-model="visible" title="新增授权平台" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="authPlatform" :rules="rules" label-width="120px" @keyup.enter="addAuthPlatform">
			<el-form-item prop="openType" label="平台类型">
				<el-select v-model="authPlatform.openType" placeholder="平台类型">
					<el-option v-for="dict in appStore.dict.open_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="clientId" label="客户端编号">
				<el-input v-model="authPlatform.clientId" placeholder="请输入客户端编号"></el-input>
			</el-form-item>
			<el-form-item prop="clientSecret" label="客户端密钥">
				<el-input v-model="authPlatform.clientSecret" placeholder="请输入客户端密钥"></el-input>
			</el-form-item>
			<el-form-item prop="redirectUri" label="重定向地址">
				<el-input v-model="authPlatform.redirectUri" placeholder="请输入重定向地址"></el-input>
			</el-form-item>
			<el-form-item v-if="authPlatform.openType==='5'" prop="agentId" label="代理编号">
				<el-input v-model="authPlatform.agentId" placeholder="请输入代理编号"></el-input>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="authPlatform.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="authPlatform.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="authPlatform.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="addAuthPlatform"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $addAuthPlatform } from '@/api/bms/platform/authPlatform'

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

// const auth platform
const authPlatform = reactive({
	authPlatformId: '0',
	openType: '',
	clientId: '',
	clientSecret: '',
	redirectUri: '',
	agentId: '',
	assistSearch: '',
	sort: '0',
	remark: '',
})

// const rules
const rules = ref({
	openType: [{ label:'平台类型', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	clientId: [{ label:'客户端编号', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	clientSecret: [{ label:'客户端密钥', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	redirectUri: [{ label:'重定向地址', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	agentId: [{ label:'代理编号', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
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
 * add auth platform
 */
const addAuthPlatform = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// add auth platform
		$addAuthPlatform(authPlatform).then(()=>{
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