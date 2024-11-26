/**
 * import create app
 */
import { createApp } from 'vue'

/**
 * import app
 */
import App from './App.vue'

/**
 * create app
 */
const app = createApp(App);

/**
 * import config
 */
import * as config from '@/assets/config/config';
app.config.globalProperties.$config = config;

/**
 * import element plus
 */
//import element plus & css & lang
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'
// use element ui
app.use(ElementPlus, {locale});

/**
 * import element el message
 */
import { ElMessage } from 'element-plus';

/**
 * import element icons
 */
import * as ElIcon from '@element-plus/icons-vue'
Object.keys(ElIcon).forEach((key) => {
	app.component(key, ElIcon[key])
})

/**
 * import & config router
 */
// import router
import router from '@/router';
// use router
app.use(router);

/**
 * import vuex
 */
// import pinia
import { createPinia } from 'pinia'
// use pinia
app.use(createPinia());

/**
 * import store
 */
import { useDataStore } from '@/store/data'
import { useUserStore } from '@/store/user'
const dataStore = useDataStore();
const userStore = useUserStore();

/**
 * import & config axios
 */
// import axios
import axios from 'axios';
// new axios instance
const service = axios.create({
	baseURL: config.baseURL
});

// provide
app.provide('$axios', service);

/**
 * import default passive events
 * <p>use to void non-passive warning</p>
 */
import 'default-passive-events'

/**
 * import particles
 * <p>use to login back animate</p>
 */
import Particles from "particles.vue3";
app.use(Particles);

/**
 * import tools
 */
import * as tool from '@/assets/utils/tool';
app.config.globalProperties.$tool = tool;

/**
 * import echarts
 */
import * as echarts from 'echarts';
app.config.globalProperties.$echarts = echarts;

/**
 * import keymaster
 */
// import key
import key from 'keymaster';
app.config.globalProperties.$key = key;

/**
 * import highlight
 */
import Highlight from '@/assets/plugins/highlight/highlight';
app.use(Highlight);

/**
 * import permission component
 */
// import sw link
import SwLink from '@/components/permission/SwLink';
app.component('sw-link', SwLink);
// import sw button
import SwButton from '@/components/permission/SwButton';
app.component('sw-button', SwButton);

/**
 * import form component
 */
// import sw form
import SwForm from '@/components/form/SwForm';
app.component('sw-form', SwForm);
// import sw form item
import SwFormItem from '@/components/form/SwFormItem';
app.component('sw-form-item', SwFormItem);

/**
 * import grid component
 */
// import sw grid
import SwGrid from '@/components/grid/SwGrid';
app.component('sw-grid', SwGrid);
// import sw column
import SwColumn from '@/components/grid/SwColumn';
app.component('sw-column', SwColumn);

/**
 * import icon
 */
import '@/assets/icon/icon.css'

/**
 * import css
 */
import "@/style/reset.css";
import "@/style/global.css";
import "@/style/panel.css";
import "@/style/button.css";
import "@/style/element.css";

/**
 * import broswer utils & get lower ie
 */
// get lower ie
const isLowerIE = tool.isLowerIE();

/**
 * defined white page list
 */
const whitePageList = ['/core/login', '/core/captcha', '/core/data', '/browser'];

/**
 * import nprogress
 */
// import nprogress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// hide spinner
NProgress.configure({ showSpinner: false });

/**
 * config router before filter
 * @param to
 * @param from
 * @param next
 */
router.beforeEach((to, from, next) => {
	NProgress.start();
	// if lower ie
	if (isLowerIE) {
		// to lower browser page
		window.location.href = '/static/broswer/broswer.html';
		// return
		return;
	}
	// if store not has data or data expired
	if (dataStore.attr == null || new Date().getTime() > dataStore.expired) {
		// get data
		dataStore.getData().then(() => {
			// handle route
			handleRoute(router, to, from, next)
		}).catch(error=>{
			NProgress.done();
			// server error
			ElMessage({ message: config.message.error.server_error, type: 'error', duration: 5*1000 });
			// console error
			console.error(error);
		});
	} else {
		// handle route
		handleRoute(router, to, from, next)
	}
});

/**
 * handle router
 * @param router
 * @param to
 * @param from
 * @param next
 */
const handleRoute = function(router, to, from, next) {
	NProgress.done();
	// set title
	if (to.meta&&to.meta.permission&&to.meta.permission.permission_name) {
		document.title = dataStore.attr.page_title+' - '+to.meta.permission.permission_name;
	}else{
		document.title = dataStore.attr.page_title;
	}
	// if white page list then do next
	if (whitePageList.indexOf(to.path) !== -1) {
		next();
		return;
	}
	// not has token then to login
	if (!userStore.token) {
		// to login
		next('/core/login');
	} else {
		// not has user
		if (!userStore.user) {
			// get layout data
			userStore.getLayoutData().then(() => {
				// get permission datas
				var permissionList = userStore.permissions
				// defined routes
				var routes = []
				// for each permission
				permissionList.forEach((permission) => {
					// defined content
					let component;
					// try to import component
					try{
						component = () => import('@/views/'+permission.component);
					}catch(e){
					}
					// if component exist
					if (component) {
						// init route
						var route = {
							path: permission.path,
							name: permission.permission_code,
							meta: { permission: permission },
							component: component
						};
						// push route
						routes.push(route);
					}
				})
				// for each routes
				routes.forEach(route => {
					// add route to main children
					router.addRoute('main', route)
				})
				// do next
				next(to.path);
			}).catch(error => {
				// get permission info error
				// ElMessage({ message: config.message.error.get_permission_info_error, type: 'error', duration: 5*1000 });
				// console error
				console.error(error);
			});
		} else {
			// if in permissions & no permission
			if (dataStore.path&&dataStore.path[to.path]&&!userStore.paths[to.path]){
				next('/core/error/403');
				return;
			}
			// if not has matched data then to 404
			if (to.matched.length<=0){
				next('/core/error/404');
				return;
			}
			// if path is login then to home
			if (to.path == '/core/login') {
				next('/core/home');
			} else {
				// do next
				next();
			}
		}
	}
}

/**
 * amount app
 */
app.mount('#app');