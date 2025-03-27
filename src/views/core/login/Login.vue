<template>
	<!-- container -->
	<el-container>
		<!-- haeder -->
		<div class="header">
			<el-dropdown class="language" trigger="click" @command="changeLanguage">
				<!--<ma-icon icon="icon-translate"></ma-icon>-->
				<span><sw-icon icon="icon-language"></sw-icon> {{messages[locale].name}}</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item v-for="language in languages" :key="language" :disabled="locale === language" :command="language">
							{{ messages[language].name }}
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
		<!-- login container -->
		<div class="login-container">
			<!-- info -->
			<div class="info">
				<!-- logo -->
				<div class="logo"><sw-icon icon="icon-dlshouwen"></sw-icon></div>
				<!-- title -->
				<div class="title">
					<h1>
						<!-- title -->
						{{appStore.attr.login_title}}
						<!-- version -->
						<el-badge :value="`v${appStore.attr.version}`"></el-badge>
					</h1>
					<!-- subtitle -->
					<p>{{appStore.attr.login_subtitle}}</p>
				</div>
			</div>
			<!-- container -->
			<div class="container">
				<!-- tab -->
				<el-tabs v-model="loginType" >
					<!-- account -->
					<el-tab-pane :label="$t('login.account.title')" name="account">
						<!-- form -->
						<el-form ref="accountLoginFormRef" :model="accountLoginFormData" :rules="accountLoginFormRules" @keyup.enter="doAccountLogin">
							<!-- username -->
							<el-form-item prop="username">
								<el-input v-model="accountLoginFormData.username" :prefix-icon="User" :placeholder="$t('login.account.placeholder.username')"></el-input>
							</el-form-item>
							<!-- password -->
							<el-form-item prop="password">
								<el-input v-model="accountLoginFormData.password" :prefix-icon="Lock" show-password :placeholder="$t('login.account.placeholder.password')"></el-input>
							</el-form-item>
							<!-- captcha -->
							<el-form-item prop="captcha" v-if="appStore.attr.account_login_captcha_enabled=='1'" class="captcha">
								<el-input v-model="accountLoginFormData.captcha" :prefix-icon="Key" :placeholder="$t('login.account.placeholder.captcha')"></el-input>
								<img :src="accountLoginCaptchaBase64Ref" @click="loadAccountCaptcha" />
							</el-form-item>
							<!-- login -->
							<el-button type="primary" :icon="Avatar" style="width:100%" size="large" :loading="loading" @click="doAccountLogin">{{$t('login.account.button')}}</el-button>
						</el-form>
					</el-tab-pane>
					<!-- mobile -->
					<el-tab-pane :label="$t('login.mobile.title')" name="mobile">
						<!-- form -->
						<el-form>
							<!-- username -->
							<el-form-item prop="mobile">
								<el-input v-model="mobileForm.mobile" :prefix-icon="Iphone" :placeholder="$t('login.mobile.placeholder.mobile')"></el-input>
							</el-form-item>
							<!-- captcha -->
							<el-form-item prop="captcha" class="captcha">
								<el-input v-model="mobileForm.captcha" :prefix-icon="Key" :placeholder="$t('login.mobile.placeholder.captcha')"></el-input>
								<img :src="accountCaptchaBase64" @click="loadAccountCaptcha" />
							</el-form-item>
							<!-- code -->
							<el-form-item prop="code">
								<el-input v-model="mobileForm.code" :prefix-icon="Lock" :placeholder="$t('login.mobile.placeholder.code')"></el-input>
							</el-form-item>
							<!-- login -->
							<el-button type="primary" :icon="Avatar" style="width:100%" size="large" :loading="loading" @click="doAccountLogin">{{$t('login.mobile.button')}}</el-button>
						</el-form>
					</el-tab-pane>
				</el-tabs>
				<el-divider class="divider">{{$t('login.other.title')}}</el-divider>
				<div class="other">
					<span :title="$t('login.other.weixin')" :span="6"><sw-icon icon="weixin" size="3rem"></sw-icon></span>
					<span :title="$t('login.other.qiyeweixin')" :span="6"><sw-icon icon="qiyeweixin" size="3rem"></sw-icon></span>
					<span :title="$t('login.other.dingding')" :span="6"><sw-icon icon="dingding" size="3rem"></sw-icon></span>
					<span :title="$t('login.other.feishu')" :span="6"><sw-icon icon="feishu" size="3rem"></sw-icon></span>
				</div>
			</div>
		</div>
		<!-- copyright -->
		<div class="copyright" v-html="appStore.attr.copyright"></div>
	</el-container>
</template>

<script setup lang="ts">
// import ref, reactive, on mounted
import { ref, reactive, onMounted } from 'vue'
// import apis
import { $getLoginCaptcha } from '@/api/bms/app/login'
// import element icons
import { User, Lock, Key, Avatar, Iphone } from '@element-plus/icons-vue'
// import tools
import { sm2Encrypt } from '@/utils/tools'

// import & get i18n props
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// import & get message from i18n
import { messages } from '@/i18n'
const languages = Object.keys(messages)

// import & get router
import { useRouter } from 'vue-router'
const router = useRouter()

// import & get app store
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()

// import & get user store
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const changeLanguage = (lang: string)=>{
	appStore.setLang(lang)
	locale.value = lang
	window.location.reload()
}

// loading
const loading = ref(false);

// login type
const loginType = ref('account')

// account login form ref
const accountLoginFormRef = ref()

// account login captcha base64 ref
const accountLoginCaptchaBase64Ref = ref()

// account login form data
const accountLoginFormData = reactive({
	username: '',
	password: '',
	key: '',
	captcha: ''
})

// account login form rules
const accountLoginFormRules = reactive({
	username: [{ required: true, message: t('valid.required'), trigger: 'blur' }],
	password: [{ required: true, message: t('valid.required'), trigger: 'blur' }],
	captcha: [{ required: true, message: t('valid.required'), trigger: 'blur' }]
})

const loadAccountCaptcha = async ()=>{
	if(appStore.attr.account_login_captcha_enabled=='1'){
		const {data} = await $getLoginCaptcha()
		accountLoginFormData.key = data.key
		accountLoginCaptchaBase64Ref.value = data.image
	}
}

const doAccountLogin = ()=>{
	accountLoginFormRef.value.validate((valid: boolean)=>{
		if(!valid){
			return false
		}
		loading.value = true;
		const data = {
			username: accountLoginFormData.username,
			password: sm2Encrypt(accountLoginFormData.password),
			key: accountLoginFormData.key,
			captcha: accountLoginFormData.captcha
		}
		userStore.login('account', data).then(()=>{
			router.push({path:'/workbench'})
		}).catch(()=>{
			loadAccountCaptcha()
			loading.value = false;
		})
	})
}

const mobileForm = reactive({
	mobile: '',
	key: '',
	captcha: '',
	code: '',
})

onMounted(() => {
	loadAccountCaptcha()
})
</script>

<style lang="scss" scoped>
.el-container {
	
	position:relative;
	height: 100%;
	background: #2494F2;
	background-attachment: fixed;
	opacity:0.8;
	background: radial-gradient(200% 100% at bottom center, #f7f7b6, #e96f92, #2494F2, #2494F2);
	background: radial-gradient(220% 105% at top center, #1264a9 10%, #24bff2 40%, #2494F2 65%, #1878c9);
	
	.header{
		width:100%;
		height:2.6rem;
		line-height:2.6rem;
		background:white;
		box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.5);
		
		.language{
			float:right;
			font-size:1rem;
			height:2.6rem;
			line-height:2.6rem;
			padding:0 1rem;
			cursor:pointer;
		}
	}

	.login-container{
		
		background:white;
		position: absolute;
		top: 20%;
		left: 50%;
		width: 36rem;
		margin-left:-18rem;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.5);
		border-radius:0.5rem;
		
		.info{
			
			display:flex;
			flex-direction:row;
			margin-top:1rem;
			height:8rem;
			
			.logo{
				padding: 0.5rem 2rem;
				font-size:4.8rem;
				text-align:center;
				color: #2494f2;
			}
			
			.title{
				
				flex:1;
				display:flex;
				flex-direction:column;
				
				h1{margin-top:1.6rem;font-size:1.8rem;color:#4494f2;}
				
				p{color:#2494f2;margin-top: 0.3rem;}
				
			}
			
		}
		
		.container{
			
			border-top:0.1rem solid #ddd;
			padding:0 3rem 3rem 3rem;
			
			:deep(.el-tabs__nav-wrap:after){height:0;}
			:deep(.el-tabs__nav-scroll){display: flex;flex-direction: row;justify-content: center;height:3rem;margin:0.5rem 0;}
			
			:deep(.el-input__inner){height:3rem;}
			:deep(.el-form-item--default){margin-bottom:1.8rem;}
			
			.captcha{
				.el-input{width:17rem;}
				img{height:3rem;margin-left:0.5rem;}
			}
			
			.divider{
				margin:3rem 0;
				
				:deep(.el-divider__text){
					font-size:12px;
					color:#888;
				}
			}
			
			.other{
				
				display:flex;
				flex-direction:row;
				
				span{
					flex:1;
					text-align:center;
				}
				
			}
			
		}

	}

	.copyright{
		
		position:absolute;
		left:0;
		bottom:0;
		width:100%;
		text-align:center;
		padding:1rem 0;
		color:rgba(255, 255, 255, 0.8);
		
		:deep(a) {
			color:rgba(255, 255, 255, 0.9);
			text-decoration: none;
		}
		
	}
}
</style>