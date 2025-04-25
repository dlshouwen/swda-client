<template>
	<el-dialog v-model="visible" title="新增岗位" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="post" :rules="rules" label-width="120px" @keyup.enter="addPost">
			<el-form-item prop="postCode" label="岗位编码">
				<el-input v-model="post.postCode" placeholder="请输入岗位编码"></el-input>
			</el-form-item>
			<el-form-item prop="postName" label="岗位名称">
				<el-input v-model="post.postName" placeholder="请输入岗位名称"></el-input>
			</el-form-item>
			<el-form-item prop="status" label="状态">
				<el-radio-group v-model="post.status">
					<el-radio-button v-for="item in appStore.dict.open_close.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="post.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="post.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="post.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="addPost"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $addPost } from '@/api/bms/permission/post'

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

// const post
const post = reactive({
	postId: '',
	postCode: '',
	postName: '',
	status: '1',
	assistSearch: '',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	postCode: [{ label:'岗位编码', valid:'r|l-le200', unique:{ code:'bms.permission.post.post_code.add', args:[] }, lang:t, validator:validator, trigger:'blur' }],
	postName: [{ label:'岗位名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	status: [{ label:'状态', valid:'r|integer|l-le4', lang:t, validator:validator, trigger:'blur' }],
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
 * add post
 */
const addPost = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// add post
		$addPost(post).then(()=>{
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