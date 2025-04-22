<template>
	<el-dialog v-model="visible" title="编辑用户" :close-on-click-modal="false" draggable width="480px">
		<el-input type="hidden" v-model="user.userId" />
		<el-form ref="formRef" :model="user" :rules="rules" label-width="120px" @keyup.enter="updateUser">
			<el-form-item prop="systemIdList" label="所属系统">
				<el-select v-model="user.systemIdList" multiple placeholder="所属系统" >
					<el-option v-for="system in systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="organId" label="所属机构">
				<el-tree-select v-model="user.organId" :data="organList" check-strictly :render-after-expand="false" />
			</el-form-item>
			<el-form-item prop="username" label="用户名">
				<el-input v-model="user.username" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item prop="password" label="密码">
				<el-input v-model="user.password" type="password" placeholder="密码" show-password></el-input>
			</el-form-item>
			<el-form-item prop="roleIdList" label="隶属角色">
				<el-select v-model="user.roleIdList" multiple placeholder="隶属角色" >
					<el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="postIdList" label="所属岗位">
				<el-select v-model="user.postIdList" multiple placeholder="所属岗位" >
					<el-option v-for="post in postList" :key="post.postId" :label="post.postName" :value="post.postId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="realName" label="真实姓名">
				<el-input v-model="user.realName" placeholder="真实姓名"></el-input>
			</el-form-item>
			<el-form-item prop="status" label="状态">
				<el-radio-group v-model="user.status">
					<el-radio-button v-for="item in appStore.dict.open_close.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="gender" label="性别">
				<el-radio-group v-model="user.gender">
					<el-radio-button v-for="item in appStore.dict.gender.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="cardId" label="证件号">
				<el-input v-model="user.cardId" placeholder="证件号"></el-input>
			</el-form-item>
			<el-form-item prop="mobile" label="手机号码">
				<el-input v-model="user.mobile" placeholder="手机号码"></el-input>
			</el-form-item>
			<el-form-item prop="email" label="电子邮箱">
				<el-input v-model="user.email" placeholder="电子邮箱"></el-input>
			</el-form-item>
			<el-form-item prop="address" label="联系地址">
				<el-input v-model="user.address" placeholder="联系地址"></el-input>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="user.assistSearch" placeholder="辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="user.sort" :min="0" placeholder="排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="user.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateUser"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $getUserData, $updateUser } from '@/api/bms/permission/user'
import { $getSystemList } from '@/api/bms/system/system'
import { $getOrganList } from '@/api/bms/permission/organ'
import { $getPostList } from '@/api/bms/permission/post'
import { $getRoleList } from '@/api/bms/permission/role'

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

// const organ list
const organList = ref()

// const system list
const systemList = ref()

// const role list
const roleList = ref()

// const post list
const postList = ref()

// const user
const user = reactive({
	userId: '',
	organId: '',
	username: '',
	password: '',
	realName: '',
	status: '1',
	gender: '1',
	cardId: '',
	mobile: '',
	email: '',
	address: '',
	assistSearch: '',
	sort: 0,
	remark: '',
	systemIdList: [],
	roleIdList: [],
	postIdList: []
})

// const rules
const rules = ref({
	username: [{ label:'用户名', valid:'r|le3-le200', unique:{ code:'bms.permission.user.username.update', args:[user.userId] }, lang:t, validator:validator, trigger:'blur' }],
	password: [{ label:'密码', valid:'le6-le32', lang:t, validator:validator, trigger:'blur' }],
	realName: [{ label:'真实姓名', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	status: [{ label:'状态', valid:'r', lang:t, validator:validator, trigger:'blur' }],
	gender: [{ label:'性别', valid:'r', lang:t, validator:validator, trigger:'blur' }],
	cardId: [{ label:'证件号', valid:'card18|l-le80', lang:t, validator:validator, trigger:'blur' }],
	mobile: [{ label:'手机号码', valid:'mobile|le11-le20', lang:t, validator:validator, trigger:'blur' }],
	email: [{ label:'邮箱', valid:'email|l-le200', lang:t, validator:validator, trigger:'blur' }],
	address: [{ label:'地址', valid:'l-l600', lang:t, validator:validator, trigger:'blur' }],
	assistSearch: [{ label:'辅助查询', valid:'l-l400', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-l200', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * init
 */
const init = (userId)=>{
	// set visible
	visible.value = true
	// get system list
	getSystemList()
	// get organ list
	getOrganList()
	// get role list
	getRoleList()
	// get post list
	getPostList()
	// get user data
	getUserData(userId)
}

/**
 * get system list
 */
const getSystemList = async () => {
	// get system list
	let handler = await $getSystemList()
	// set system datas
	systemList.value = handler.data
}

/**
 * get organ list
 */
const getOrganList = async () => {
	// get organ list
	let handler = await $getOrganList()
	// set organ datas
	organList.value = handler.data
}

/**
 * get role list
 */
const getRoleList = async () => {
	// get role list
	let handler = await $getRoleList()
	// set role datas
	roleList.value = handler.data
}

/**
 * get post list
 */
const getPostList = async () => {
	// get post list
	let handler = await $getPostList()
	// set post datas
	postList.value = handler.data
}

const getUserData = async (userId)=>{
	// get user data
	let handler = await $getUserData(userId)
	// set user data
	Object.assign(user, handler.data)
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
 * update user
 */
const updateUser = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update user
		$updateUser(user).then(()=>{
			// message
			ElMessage.success({ 
				message: '操作成功', 
				duration: 500, 
				onClose: () => {
					// set visible
					visible.value = false
					// callback
					emit('callback')
				}
			})
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