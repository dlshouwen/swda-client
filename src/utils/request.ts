// import axios
import axios, { AxiosResponse } from 'axios'

// import config
import appConfig from '@/config'

// import qs
import qs from 'qs'

// import elements
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus/es'

// import stores
import { useUserStore } from '@/stores/user'

// import tools
import { local } from '@/utils/storage'
 
// defined axios instance
const request = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 60000,
	headers: { 'Content-Type':'application/json;charset=UTF-8' }
})

// request interceptor
request.interceptors.request.use(
	// config
	config => {
		// get user store
		const userStore = useUserStore()
		// has token
		if(userStore?.token){
			// add auth header
			config.headers['Authorization'] = userStore.token
		}
		// set lang header
		config.headers['Accept-Language'] = local.get(appConfig.key.lang);
		// get
		if(config.method?.toLowerCase() === 'get'){
			// force refresh cache
			config.params = { ...config.params, t: new Date().getTime() }
		}
		// content type not json
		if(Object.values(config.headers).includes('application/x-www-form-urlencoded')){
			// set data to string
			config.data = qs.stringify(config.data)
		}
		console.log(1111)
		// return config
		return config
	},
	// error
	error => {
		// reject
		return Promise.reject(error)
	}
)

// is refresh token
let isRefreshToken = false

// requests
let requests: any[] = []

// response interceptor
request.interceptors.response.use(
	// response
	async (response: AxiosResponse<any>)=>{
		// get user store
		const userStore = useUserStore()
		// error
		if(response.status!==200){
			// reject
			return Promise.reject(new Error(response.statusText||'error'))
		}
		// data is blob
		if(Object.prototype.toString.call(response.data)==='[object Blob]'){
			// return response
			return response
		}
		// success
		if(response.data.code===200){
			// return data
			return response.data
		}
		// refresh token expired
		if(response.data.code===400){
			// handle unauthorize
			return handleUnauthorize()
		}
		// unauthorize
		if(response.data.code===401){
			// get response config
			const config = response.config
			// not get refresh token
			if(!isRefreshToken){
				// set refresh token flag
				isRefreshToken = true
				// get refresh token from storage
				const refreshToken = local.get(appConfig.key.refreshToken)
				// if no refresh token
				if(!refreshToken){
					// handle unauthorize
					return handleUnauthorize()
				}
				// try catch
				try{
					// get token from refresh token
					const {data} = await request.post('/login/token?refreshToken='+refreshToken)
					// set token
					userStore.setToken(data.access_token)
					// set header token
					config.headers!.Authorization = data.access_token
					// for each requests execute
					requests.forEach((cb:any)=>{
						cb()
					})
					// clear requests
					requests = []
					// return
					return request(config)
				}catch(e){
					// for each requests execute
					requests.forEach((cb:any)=>{
						cb()
					})
					// handle unauthorize
					return handleUnauthorize()
				}finally{
					// clear requests
					requests = []
					// reset refresh token flag
					isRefreshToken = false
				}
			}else{
				// return promise
				return new Promise(resolve=>{
					// push request
					requests.push(()=>{
						// set header token
						config.headers!.Authorzation = userStore.token
						// resolve
						resolve(request(config))
					})
				})
			}
		}
		// show error message
		ElMessage.error(response.data.message)
		// reject
		return Promise.reject(new Error(response.data.message||'error'))
	},
	// error
	error => {
		// show error message
		ElMessage.error(error.message)
		// reject
		return Promise.reject(error)
	}
)

/**
 * handle unauthorize
 */
const handleUnauthorize = ()=>{
	// set option
	const option = { showCancelButton: false, closeOnClickModal: false, showClose: false, confirmButtonText: '重新登录', type: 'warning' };
	// show message box
	ElMessageBox.confirm('登录超时，请重新登录', '提示', option).then(() => {
		// get user store
		const userStore = useUserStore()
		// clear token
		userStore?.setToken('')
		// clear refresh token
		userStore?.setRefreshToken('')
		// refresh page
		window.location.reload()
		// reject
		return Promise.reject('登录超时，请重新登录')
	})
}

// export
export default request