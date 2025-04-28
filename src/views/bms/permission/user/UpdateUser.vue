<template>
	<el-dialog v-model="visible" title="编辑用户" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="user" label-width="120px" @keyup.enter="updateUser">
			<sw-select-system prop="systemIdList" v-model="user.systemIdList" multiple label="所属系统" valid="r" valid-type="select" />
			<sw-select-organ prop="organId" v-model="user.organId" check-strictly label="所属系统" valid="r" valid-type="select" />
			<sw-input prop="username" v-model="user.username" label="用户名" valid="r|le3-le200" :valid-unique="{ code:'bms.permission.user.username.update', args:[user.userId] }" />
			<sw-input type="password" prop="password" v-model="user.password" label="密码" valid="le6-le32" show-password />
			<sw-select-role prop="roleIdList" v-model="user.roleIdList" multiple label="隶属角色" valid="" />
			<sw-select-role prop="postIdList" v-model="user.postIdList" multiple label="所属岗位" valid="" />
			<sw-input prop="realName" v-model="user.realName" label="真实姓名" valid="r|l-le400" />
			<sw-radio-group prop="status" v-model="user.status" label="状态" dict="open_close" valid="r" />
			<sw-radio-group prop="gender" v-model="user.gender" label="性别" dict="gender" valid="r" />
			<sw-input prop="cardId" v-model="user.cardId" label="证件号" valid="card18|l-le80" />
			<sw-input prop="mobile" v-model="user.mobile" label="手机号码" valid="mobile|le11-le20" />
			<sw-input prop="email" v-model="user.email" label="电子邮箱" valid="email|l-le200" />
			<sw-input prop="address" v-model="user.address" label="联系地址" valid="l-le600" />
			<sw-input prop="assistSearch" v-model="user.assistSearch" label="辅助查询" valid="l-le400" />
			<sw-input type="number" prop="sort" v-model="user.sort" label="排序码" :min="0" valid="r|integer" />
			<sw-input type="textarea"prop="remark" v-model="user.remark" label="备注" :autosize="{ minRows: 2, maxRows: 4 }" valid="l-le200" />
			<el-form-item>
				<sw-button type="warning" @click="reset" icon="undo">重置</sw-button>
				<sw-button type="success" @click="updateUser" icon="save" divider>保存</sw-button>
				<sw-button type="danger" @click="close" icon="close">关闭</sw-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive } from 'vue'

// import element plus elements
import { ElMessage } from 'element-plus'

// import apis
import { $getUserData, $updateUser } from '@/api/bms/permission/user'

// const emit
const emit = defineEmits(['callback'])

// const visible
const visible = ref(false)

// const form ref
const formRef = ref()

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

/**
 * init
 */
const init = async (userId: number)=>{
	// get user data
	await getUserData(userId)
	// set visible
	visible.value = true
}

/**
 * get user data
 * @param userId
 */
const getUserData = async (userId: number)=>{
	// get user data
	let { data } = await $getUserData(userId)
	// set user data
	Object.assign(user, data)
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
const updateUser = async ()=>{
	// valid
	let valid = await formRef.value.validate()
	// unpass
	if(!valid){
		return false
	}
	// update user
	await $updateUser(user)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: close })
}

/**
 * close
 */
const close = ()=>{
	// set visible
	visible.value = false
	// callback
	emit('callback')
}

// expose
defineExpose({ init })
</script>