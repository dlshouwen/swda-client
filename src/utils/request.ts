import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus/es'
import { useUserStore } from '@/stores/user'
import { local } from '@/utils/storage'
import appConfig from '@/config' 

// defined axios instance
const request = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 60000,
	headers: { 'Content-Type':'application/json;charset=UTF-8' }
})

// request interceptor
request.interceptors.request.use(
	config => {
		const userStore = useUserStore()
		if(userStore?.token){
			config.headers['Authorization'] = userStore.token
		}
		config.headers['Accept-Language'] = local.get(appConfig.key.lang);
		if(config.method?.toLowerCase() === 'get'){
			config.params = { ...config.params, t: new Date().getTime() }
		}
		if(Object.values(config.headers).includes('application/x-www-form-urlencoded')){
			config.data = qs.stringify(config.data)
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// is refresh token
let isRefreshToken = false

// requests
let requests: any[] = []

// response interceptor
request.interceptors.response.use(
	async (response: AxiosResponse<any>)=>{
		const userStore = useUserStore()
		if(response.status!==200){
			return Promise.reject(new Error(response.statusText||'error'))
		}
		if(Object.prototype.toString.call(response.data)==='[object Blob]'){
			return response
		}

		if(response.data.code===200){
			return response.data
		}
		if(response.data.code===400){
			return handleUnauthorize()
		}
		if(response.data.code===401){
			const config = response.config
			if(!isRefreshToken){
				isRefreshToken = true
				const refreshToken = local.get(appConfig.key.refreshToken)
				if(!refreshToken){
					return handleUnauthorize()
				}
				try{
					const {data} = await request.post('/login/token?refreshToken='+refreshToken)
					userStore.setToken(data.access_token)
					config.headers!.Authorization = data.access_token
					requests.forEach((cb:any)=>{
						cb()
					})
					requests = []
					return request(config)
				}catch(e){
					requests.forEach((cb:any)=>{
						cb()
					})
					return handleUnauthorize()
				}finally{
					requests = []
					isRefreshToken = false
				}
			}else{
				return new Promise(resolve=>{
					requests.push(()=>{
						config.headers!.Authorzation = userStore.token
						resolve(request(config))
					})
				})
			}
		}
		ElMessage.error(response.data.message)
		return Promise.reject(new Error(response.data.message||'error'))
	},
	error => {
		ElMessage.error(error.message)
		return Promise.reject(error)
	}
)

/**
 * handle unauthorize
 */
const handleUnauthorize = ()=>{
	ElMessageBox.confirm('登录超时，请重新登录', '提示', {
		showCancelButton: false,
		closeOnClickModal: false,
		showClose: false,
		confirmButtonText: '重新登录',
		type: 'warning'
	})	.then(() => {
		const userStore = useUserStore()
		userStore?.setToken('')
		userStore?.setRefreshToken('')
		location.reload()
		return Promise.reject('登录超时，请重新登录')
	})
}

// export
export default request