<template>
	<el-dialog v-model="visible" title="个人信息" width="460">
		<el-form ref="formRef" :model="loginUser" :rules="rules" label-width="120px" @keyup.enter="updateLoginUser">
			<el-upload class="avatar-upload" drag :http-request="uploadAvatar" :before-upload="avatarBeforeUpload" :on-success="avatarUploadSuccess" :on-error="avatarUploadError"
					accept="image/jpeg,image/png,image/gif">
				<template v-if="loginUserAvatar.avatar">
					<img :src="loginUserAvatar.avatar" class="upload-image" />
					<div class="operations" @click.stop>
						<div class="operation" @click="uploadImage">
							<sw-icon icon="edit"></sw-icon>
							<span>编辑</span>
						</div>
						<div class="operation" @click="previewImage=true">
							<sw-icon icon="plus"></sw-icon>
							<span>查看</span>
						</div>
						<div class="operation" @click="deleteImage">
							<sw-icon icon="delete"></sw-icon>
							<span>删除</span>
						</div>
					</div>
				</template>
				<template v-else>
					<slot name="empty">
						<div class="operation">
							<sw-icon icon="plus"></sw-icon>
							<span>请上传图片</span> 
						</div>
					</slot>
				</template>
			</el-upload>
			<el-form-item label="所属系统">
				<el-tag v-for="system in userStore.systemList" type="primary" style="margin-right:8px;">{{system.systemName}}</el-tag>
			</el-form-item>
			<el-form-item label="所属机构">{{loginUser.organName}}</el-form-item>
			<el-form-item label="用户名">{{loginUser.username}}</el-form-item>
			<el-form-item label="所属岗位">
				<el-tag v-for="postName in userStore.user.postNameList" type="primary">{{postName}}</el-tag>
			</el-form-item>
			<el-form-item prop="realName" label="真实姓名">
				<el-input v-model="loginUser.realName" placeholder="真实姓名"></el-input>
			</el-form-item>
			<el-form-item prop="gender" label="性别">
				<el-radio-group v-model="loginUser.gender">
					<el-radio-button v-for="item in appStore.dict.gender.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="cardId" label="证件号">
				<el-input v-model="loginUser.cardId" placeholder="证件号"></el-input>
			</el-form-item>
			<el-form-item prop="mobile" label="手机号码">
				<el-input v-model="loginUser.mobile" placeholder="手机号码"></el-input>
			</el-form-item>
			<el-form-item prop="email" label="电子邮箱">
				<el-input v-model="loginUser.email" placeholder="电子邮箱"></el-input>
			</el-form-item>
			<el-form-item prop="address" label="联系地址">
				<el-input v-model="loginUser.address" placeholder="联系地址"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateLoginUser"><sw-icon icon="save"></sw-icon>保存</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<style lang="scss" scoped>
.avatar-upload{
	text-align:center;
	padding:20px;
	:deep(.el-upload){
		border: 1px dashed var(--el-border-color);
		height:120px;
		width:120px;
		border-radius:50%;
		&.is-drag{display:inline-block;}
		.el-upload-dragger{
			display:flex;
			flex-direction:row;
			border:0;
			height:100%;
			width:100%;
			border-radius:50%;
			padding:0;
			background:none;
			align-items:center;
			text-align:center;
			.operation{
				flex:1;
			}
		}
		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
		.operations{display:none;}
		&:hover .operations{
			position:absolute;top:0;left:0;height:100%;width:100%;display:flex;align-items:center;justify-content: center;background: rgb(0 0 0 / 60%);
			.operation{
				color: aliceblue;padding:2px 0;display:flex;flex-direction:column;align-items:center;justify-content: center;
				
				.sw-icon{font-size:16px;}
				span{margin-top:4px;font-size:12px;}
			}
		}
	}
}
</style>

<script setup lang="ts">
// import vue elements
import { ref, reactive, computed } from 'vue'

// import element plus elements
import { ElMessage, ElNotification } from 'element-plus'

// import use i18n
import { useI18n } from 'vue-i18n'

// import apis
import { $updateLoginUser, $updateLoginUserAvatar } from '@/api/core/base/profile'

// import validator
import { validator } from '@/utils/validator'
 
// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// import emits
import emits from '@/utils/emits'

// get i18n
const { t } = useI18n()

// get stores
const appStore = useAppStore()
const userStore = useUserStore()

// const visible
const visible = ref(false)

const previewImage = ref(false)

import request from '@/utils/request'

const uploadImage = (formData)=>{
	return request.postForm('/storage/upload', formData)
}

const deleteImage = async () =>{
	loginUserAvatar.avatar = ''
	await $updateLoginUserAvatar(loginUserAvatar)
	await userStore.getLoginUserData()
}

const uploadAvatar = async (options)=>{
	let formData = new FormData()
	formData.append('file', options.file)
	try {
		const { data } = await uploadImage(formData)
		loginUserAvatar.avatar = data.url
		await $updateLoginUserAvatar(loginUserAvatar)
		await userStore.getLoginUserData()
	} catch (error) {
		options.onError(error as any)
	}
}

const avatarBeforeUpload = (rawFile)=>{
	const limitSize = 200
	if (rawFile.size / 1024 / 1024 > limitSize) {
		ElNotification({
			title: '温馨提示',
			message: `上传图片大小不能超过 ${limitSize}M！`,
			type: 'warning'
		})
		return false
	}
	const limitType = ["image/jpeg", "image/png", "image/gif"]
	if (!limitType.includes(rawFile.type)) {
		ElNotification({
			title: '温馨提示',
			message: '上传图片不符合所需的格式！',
			type: 'warning'
		})
		return false
	}
	return true
}

const avatarUploadSuccess = ()=>{
	ElNotification({
			title: '温馨提示',
			message: '图片上传成功！',
			type: 'success'
		})
}

const avatarUploadError = ()=>{
	ElNotification({
			title: '温馨提示',
			message: '图片上传失败，请您重新上传！',
			type: 'error'
		})
}

// const form ref
const formRef = ref()

// const login user
const loginUser = reactive({})

const loginUserAvatar = reactive({
	avatar:''
})

Object.assign(loginUser, userStore.user)
loginUserAvatar.avatar = userStore.user.avatar

// const rules
const rules = reactive({
	realName: [{ label:'真实姓名', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	gender: [{ label:'性别', valid:'r', lang:t, validator:validator, trigger:'blur' }],
	cardId: [{ label:'证件号', valid:'card18|l-le80', lang:t, validator:validator, trigger:'blur' }],
	mobile: [{ label:'手机号码', valid:'mobile|le11-le20', unique:{ code:'bms.permission.user.mobile.update', args:[loginUser.userId] }, lang:t, validator:validator, trigger:'blur' }],
	email: [{ label:'邮箱', valid:'email|l-le200', lang:t, validator:validator, trigger:'blur' }],
	address: [{ label:'地址', valid:'l-l600', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * update login user
 */
const updateLoginUser = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update login user
		$updateLoginUser(loginUser).then(()=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// set visible
				visible.value = false
				// get login user data
				userStore.getLoginUserData()
			}})
		})
	})
}

// emits on
emits.on('setUserInfo', () => (visible.value = true))
</script>