<template>
	<el-container>
		<!-- login form -->
		<el-form class="login-form" ref="loginForm" :model="loginUser" label-width="80px">
			<!-- login panel -->
			<div class="login-panel">
				<!-- title -->
				<div class="title">
					<div class="system-icon"><i :class="dataStore.attr.system_icon"></i></div>
					<div class="login-title">{{dataStore.attr.login_title}}</div>
					<div class="login-title-en">{{dataStore.attr.login_title_en}}</div>
					<div class="system-version">v {{dataStore.attr.version}}</div>
				</div>
				<!-- form items -->
				<el-form-item prop="userCode" label-width="0" :rules="{ required: true, message: '请输入用户名', trigger: 'blur' }">
					<el-input v-model="loginUser.userCode" prefix-icon="user" placeholder="请输入用户名" @keydown.enter="login" />
				</el-form-item>
				<el-form-item prop="password" label-width="0" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
					<el-input v-model="loginUser.password" prefix-icon="lock" show-password placeholder="请输入密码" @keydown.enter="login" />
				</el-form-item>
				<el-form-item v-show="dataStore.attr.login_need_valid_code=='1'&&dataStore.attr.login_valid_code_type=='1'" prop="validCode" label-width="0" 
					:rules="{ required: dataStore.attr.login_need_valid_code=='1'&&dataStore.attr.login_valid_code_type=='1', message: '请输入验证码', trigger: 'blur' }">
					<el-input v-model="loginUser.validCode" prefix-icon="key" placeholder="请输入验证码" @keydown.enter="login" style="width:226px;" />
					<img :src="`${this.$config.baseURL}/core/captcha?key=${loginUser.key}&v=${now}`" style="margin-left:10px;vertical-align:middle;" @click="now=new Date().getTime();" />
				</el-form-item>
				<!-- operation -->
				<div class="form-group form-btn-group">
					<el-link class="link-about" href="https://www.dlshouwen.com" target="blank" icon="link" :underline="false" type="danger">大连首闻科技有限公司官方网站</el-link>
					<el-button type="primary" @click="login" icon="right" :loading="loading">登录</el-button>
				</div>
			</div>
		</el-form>
		<!-- footer -->
		<div class="footer" v-html="dataStore.attr.copyright"></div>
		<!-- particles -->
		<Particles v-show="dataStore.attr.login_show_animate=='1'" id="tsparticles" :particlesInit="particlesInit" :options="particles" />
		<!-- vcode -->
		<Vcode :show="show.vcode" @success="doLogin" @close="cancelLogin" />
	</el-container>
</template>

<script setup>
// import vue: reactive & to refs
import { reactive, toRefs } from 'vue'

// import tool
import * as tool from '@/assets/utils/tool';

// import components: vcode
import Vcode from "vue3-puzzle-vcode";
// registe components
components: { Vcode }

// import tsparticles: load full
import { loadFull } from "tsparticles";

// import store: data & user & tab
import { useDataStore } from '@/store/data'
import { useUserStore } from '@/store/user'
import { useTabStore } from '@/store/tab'
// get store: data & user & tab
const dataStore = useDataStore();
const userStore = useUserStore();
const tabStore = useTabStore();

// import use router
import { useRouter } from 'vue-router'
// get router
const router = useRouter()

// defined particles params
const particles = {
	interactivity: { events: { onHover: { enable: true, mode: "grab", }, }, },
	particles: {
		links: { distance: 150, enable: true, opacity: 0.8, },
		move: { enable: true, speed: 2, },
		number: { density: { enable: true, area: 800, }, value: 80, },
		opacity: { value: 0.8, },
	},
}

// const state
const state = reactive({
	// login form
	loginForm: null,
	// loading
	loading: false,
	// show
	show:{ vcode: false },
	// now
	now: new Date().getTime(),
	// login user
	loginUser: { 
		userCode:'', 
		password:'',
		key: tool.guid(),
		validCode:''
	}
});

// to refs
const { loginForm, loading, show, now, loginUser } = toRefs(state);

/**
 * plarticles init
 * @param engine
 */
const particlesInit = async engine => {
    await loadFull(engine);
}

/**
 * login
 */
const login = () => {
	state.loginForm.validate((valid) => {
		// valid pass
		if (valid) {
			// if need vcode
			if(dataStore.attr.login_need_valid_code=='1'&&dataStore.attr.login_valid_code_type=='2'){
				state.show.vcode = true;
			}else{
				// do login
				doLogin();
			}
		}
	})
}

/**
 * do login
 */
const doLogin = () => {
	// set loading
	state.loading = true;
	// login
	userStore.login(state.loginUser).then(() => {
		// set cookie
		tool.setCookie('swda_login_user_code', state.loginUser.userCode, { expires: parseInt(dataStore.attr.login_cookie_days) });
		// clear all tab
		tabStore.clearTabs();
		// hide vcode
		state.show.vcode = false;
		// go to home page
		router.push({ path: '/core/home' });
	}).catch(error => {
		// reset now to refresh valid code
		state.now = new Date().getTime();
		// hide vcode
		state.show.vcode = false;
		// set loading
		state.loading = false;
	});
}

/**
 * calcel login
 */
const cancelLogin = () => {
	// hide vcode
	show.vcode = false;
}
</script>

<style scoped>
/** login form */
.login-form {border: 0;}

/** el form item */
.el-form-item {position: relative;padding: 0 20px;margin-top: 20px;height: 40px;}
.el-form-item /deep/ .el-form-item__error {top: 42px;}

/** el input */
.el-input {line-height: 40px;font-size: 12px;height:40px;}
.el-input /deep/ .el-input__wrapper{background: #eaeaea;box-shadow:none;border-radius:0;padding:0;}
.el-input /deep/ input {border-radius: 0;height: 40px;line-height: 40px;background: #eaeaea;border: 0;}
.el-input /deep/ span {font-size: 14px;margin-left: 6px;}
.el-input:hover /deep/ span {color: #409EFF}
.el-input /deep/ .el-input__icon{line-height:40px;margin-right:12px;}

/** background */
.el-container {
	height: 100%;background: #2494F2;background-attachment: fixed;opacity:0.8;
	background: radial-gradient(200% 100% at bottom center, #f7f7b6, #e96f92, #2494F2, #2494F2);
	background: radial-gradient(220% 105% at top center, #1264a9 10%, #24bff2 40%, #2494F2 65%, #1878c9);
}
@keyframes rotate {
	0% { transform : perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);}
	100% { transform : perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);}
}

/** login panel */
.login-panel {position: absolute;background: rgba(255, 255, 255, 1);left: 50%;top: 40%;width: 400px;margin-left: -200px;margin-top: -200px;z-index: 10;}
.login-panel {-webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);-moz-box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);-o-box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);}
.login-panel>.title {position: relative;height: 92px;border-bottom: 1px solid #e0e0e0;cursor: pointer;}
.login-panel>.title>.system-icon {position: absolute;top: 18px;left: 40px;font-size: 54px;line-height: 0;text-align: center;color: #409EFF;}
.login-panel>.title>.login-title {position: absolute;top: 24px;left: 120px;width: 280px;height: 28px;font-size: 18px;line-height: 28px;font-weight: bold;color: #409EFF;}
.login-panel>.title>.login-title-en {position: absolute;top: 44px;left: 120px;width: 280px;height: 28px;font-size: 8px;line-height: 28px;color: #409EFF;}
.login-panel>.title>.system-version {position: absolute;top: 16px;right: 20px;background: #d9534f;font-size: 10px;padding: 2px 6px;color: white;font-weight: bold;}

/** form group */
.form-group {position: relative;padding: 0 20px;margin-top: 20px;height: 40px;}
.form-group a.link-about {font-size: 12px;height: 36px;line-height: 36px;}
.form-group a.link-about /deep/ i {margin-right: 6px;}
.form-btn-group {height: 32px;margin-bottom: 20px;}
.form-group .el-button {position: absolute;top: 0;right: 20px;border-radius: 0;height: 32px;line-height: 32px;text-decoration: none;border: 0;color: white;padding: 0 15px;font-size: 14px;margin-right:0;}
.form-group .el-button /deep/ i {height:32px;line-height:32px;}

/* footer */
.footer {position: absolute;width: 100%;z-index: 6;text-align: center;color: #eee;font-size: 12px;text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.6);line-height: 32px;bottom:15px;}
.footer /deep/ a {color: #eee;text-decoration:none;}
.footer /deep/ a:hover {border-bottom: 1px dotted #eee;}
</style>

<style>
/** vcode */
.vue-puzzle-vcode .vue-auth-box_{padding:8px;border-radius:0;}
.vue-puzzle-vcode .vue-auth-box_ .auth-body_{border-radius:0;}
.vue-puzzle-vcode .vue-auth-box_ .auth-control_ .range-box{margin-top:10px;border-radius:0;}
.vue-puzzle-vcode .vue-auth-box_ .auth-control_ .range-box .range-text{font-size:12px;}
.vue-puzzle-vcode .vue-auth-box_ .auth-control_ .range-box .range-slider{border-radius:0;}
.vue-puzzle-vcode .vue-auth-box_ .auth-control_ .range-box .range-slider .range-btn{border-radius:0;}
</style>