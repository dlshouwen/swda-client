<template>
	<div class="login-container">
		<div class="info">
			<i class="icon-gear"></i>
			<h1>{{appStore.attr.login_title}}</h1>
			<p>{{appStore.attr.login_subtitle}}</p>
		</div>
		<div>
			<el-button @click="loginType='account'">{{$t('login.account.title')}}</el-button>
			<el-button @click="loginType='mobile'">{{$t('login.mobile.title')}}</el-button>
		</div>
		<div class="account-container" v-if="loginType=='account'">
			<el-form ref="accountLoginFormRef" :model="accountForm" :rules="accountRules" @keyup.enter="doAccountLogin">
				<el-form-item prop="username">
					<el-input v-model="accountForm.username" :prefix-icon="User" :placeholder="$t('login.account.placeholder.username')"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="accountForm.password" :prefix-icon="Lock" show-password :placeholder="$t('login.account.placeholder.password')"></el-input>
				</el-form-item>
				<el-form-item prop="captcha">
					<el-input v-model="accountForm.captcha" :prefix-icon="Key" :placeholder="$t('login.account.placeholder.captcha')"></el-input>
					<img style="width:80px;height:40px;" v-if="appStore.attr.login_need_valid_code=='1'&&appStore.attr.login_valid_code_type=='2'" :src="accountCaptchaBase64" @click="loadAccountCaptcha" />
				</el-form-item>
				<el-button @click="doAccountLogin">{{$t('login.account.button')}}</el-button>
			</el-form>
		</div>
		<div class="mobile-container" v-if="loginType=='mobile'">
			<el-form>
				<el-form-item prop="mobile">
					<el-input v-model="mobileForm.username" :prefix-icon="Iphone" :placeholder="$t('login.mobile.placeholder.username')"></el-input>
				</el-form-item>
				<el-form-item prop="code">
					<el-input v-model="mobileForm.code" :prefix-icon="Key" :placeholder="$t('login.mobile.placeholder.code')"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
	<span v-html="appStore.attr.copyright"></span>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { User, Lock, Key, Iphone } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { userCaptcha } from '@/api/bms/app/login'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()

const { t } = useI18n()

const loginType = ref('account')

const accountFormRef = reactive()

const accountCaptchaBase64 = ref()

const accountForm = reactive({
	username: '',
	password: '',
	key: '',
	captcha: ''
})

const accountRules = reactive({
	username: [{ required: true, message: t('valid.required'), trigger: 'blur' }],
	password: [{ required: true, message: t('valid.required'), trigger: 'blur' }],
	captcha: [{ required: true, message: t('valid.required'), trigger: 'blur' }]
})

const mobileForm = reactive({
	mobile: '',
	code: '',
})

const loadAccountCaptcha = async ()=>{
	if(appStore.attr.login_need_valid_code=='1'&&appStore.attr.login_valid_code_type=='2'){
		const {data} = await userCaptcha()
		accountForm.key = data.key
		accountCaptchaBase64.value = data.image
	}
}

const doAccountLogin = ()=>{
	accountFormRef.validate((valid: boolean)=>{
		if(!valid){
			return false
		}
		userStore.accountLogin(accountForm).then(()=>{
			router.push({path:''})
		})
	})
}


onMounted(() => {
	loadAccountCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container{
	position:absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 0.3rem;
	box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
	display:flex;
	flex-direction:column;
	
	.info{
		
	}
}
</style>