// import axios
import axios from 'axios';

// import element plus
import { ElMessage } from 'element-plus';

import { useUserStore } from '@/store/user'

import { useDataStore } from '@/store/data'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// import config
import * as config from '@/assets/config/config';

// create axios instance
const request = axios.create({
	baseURL: config.baseURL, 
	timeout: 5000
});

// axios request interceptor
request.interceptors.request.use(config => {
	// start progress
	NProgress.start()
	// get user store
	const userStore = useUserStore()
	// get data store
	const dataStore = useDataStore()
	// if in permissions & no permission
	if (dataStore.path&&dataStore.path[config.url]&&!userStore.paths[config.url]){
		// done progress
		NProgress.done()
		// show message
		ElMessage({ message: config.message.error.forbidden_error, type: 'error', duration: 5*1000 });
		// return
		return;
	}
	// if has token
	if (userStore.token) {
		// add toekn to header
		config.headers['token'] = userStore.token
	}
	// return
	return config
}, error => {
	// reject
	return Promise.reject(error)
});

// axios response interceptor
request.interceptors.response.use(resolve=>{
	// done progress
	NProgress.done()
	// original resolve
	if(resolve.config.headers['x-original-resolve']=='1'){
		return Promise.resolve(resolve);
	}
	// get user store
	const userStore = useUserStore()
	// success
	if(resolve.data.code==0){
		return Promise.resolve(resolve);
	}
	// 90002: token timeout
	else if(resolve.data.code==90002){
		// show message
		ElMessage({ message: config.message.error.token_timeout, type: 'error', duration: 5*1000 });
		// reset token
		userStore.resetToken().then(()=>{
			// reload
			location.reload()
		})
		// return
		return;
	}
	// 90003: token error
	else if(resolve.data.code==90003){
		// show message
		ElMessage({ message: config.message.error.token_error, type: 'error', duration: 5*1000 });
		// reset token
		userStore.resetToken().then(()=>{
			// reload
			location.reload()
		})
		// return
		return;
	}else{
		// show message
		if(resolve.data.message){
			ElMessage({ message: resolve.data.message, type: 'error', duration: 5*1000 });
		}
		// reject
		return Promise.reject(resolve)
	}
}, error => {
	// done progress
	NProgress.done()
	// show error message
	if(error.data.message){
		ElMessage({ message: error.data.message, type: 'error', duration: 5*1000 });
	}
	// console error
	console.error(error);
	// reject
	return Promise.reject(error)
});

export { request }