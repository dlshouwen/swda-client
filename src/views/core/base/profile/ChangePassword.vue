<template>
	<el-dialog v-model="visible" title="修改密码" width="480px">
		<el-form ref="formRef" :model="userPassword" :rules="rules" label-width="120px" @keyup.enter="changePassword">
			<el-form-item prop="password" label="原密码">
				<el-input v-model="userPassword.password" type="password" placeholder="请输入原密码" show-password></el-input>
			</el-form-item>
			<el-form-item prop="newPassword" label="新密码">
				<el-input ref="newPasswordRef" v-model="userPassword.newPassword" type="password" placeholder="请输入新密码" show-password></el-input>
				<div class="password-letter">
					<span class="strength s1" :class="userPassword.strength>0?'password-strength-color':''"></span>
					<span class="strength s2" :class="userPassword.strength>1?'password-strength-color':''"></span>
					<span class="strength s3" :class="userPassword.strength>2?'password-strength-color':''"></span>
				</div>
			</el-form-item>
			<el-form-item prop="repeatPassword" label="重复密码">
				<el-input v-model="userPassword.repeatPassword" type="password" placeholder="请输入重复密码" show-password></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="changePassword"><sw-icon icon="save"></sw-icon>保存</el-button>
				<el-divider direction="vertical" />
				<el-button type="danger" @click="close"><sw-icon icon="close"></sw-icon>关闭</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<style scoped>
/** password letter */
.password-letter{margin:6px 0 2px 0;height:8px;font-size:12px;}
.password-letter span{float:left;display:inline-block;width:68px;height:8px;margin-right:2px;text-align:center;color:#fff;background-color:#d0d0d0;border-radius:2px;}
.password-letter span.s1.password-strength-color{ background-color:#e62929;}
.password-letter span.s2.password-strength-color{ background-color:#ec971f;}
.password-letter span.s3.password-strength-color{ background-color:#449d44;}
/** operation container */
.operation-container{padding:4px 0;text-align:center;border-top:1px solid #f0f0f0;}
</style>

<script setup lang="ts">
// import vue elements
import { ref, reactive, watch } from 'vue'

// import emits
import emits from '@/utils/emits'

// import element plus elements
import { ElMessage } from 'element-plus'

// import use i18n
import { useI18n } from 'vue-i18n'

// import apis
import { $updateLoginUserPassword } from '@/api/core/base/profile'

// import validator
import { validator } from '@/utils/validator'

// get i18n
const { t } = useI18n()

// const visible
const visible = ref(false)

// const form ref
const formRef = ref()

// const new password ref
const newPasswordRef = ref()

// user password
const userPassword = reactive({
	password: '',
	newPassword: '',
	repeatPassword: '',
	strength: 0
})

// rules
const rules = reactive({
	password: [{ label:'密码', valid:'r|le6-le32', lang:t, validator:validator, trigger:'blur' }],
	newPassword: [{ label:'新密码', valid:'r|le6-le32', lang:t, validator:validator, trigger:'blur' }],
	repeatPassword: [{ label:'重复密码', valid:'r|le6-le32', lang:t, validator:validator, trigger:'blur' }],
})

// watch
watch(()=>userPassword.newPassword, (newValue, oldValue)=>{
	if(newValue.length>=6) {
		let o=(/[0-9]+/.test(newValue))?1:0, p=(/[a-zA-Z]+/.test(newValue))?1:0, q=(/[^0-9a-zA-Z]+/.test(newValue))?1:0; 
		userPassword.strength = o + p + q;
	}else{
		userPassword.strength = 0;
	}
}, {immediate: true, deep: true}) 

/**
 * change password
 */
const changePassword = () => {
	// strength
	if(userPassword.strength<=2){
		ElMessage.warning('密码强度不符合规范，请重新填写。');
		newPasswordRef.value.focus();
		return;
	}
	// equals
	if(userPassword.newPassword!==userPassword.repeatPassword){
		ElMessage.warning('重复密码与新密码不一致，请重新填写。');
		newPasswordRef.value.focus();
		return;
	}
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// change password
		$updateLoginUserPassword(userPassword).then(()=>{
			// message
			ElMessage.success({ message: '密码修改成功。', duration: 500, onClose: () => {
				// set visible
				visible.value = false
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

// emits
emits.on('changePassword', () => (visible.value = true))
</script>