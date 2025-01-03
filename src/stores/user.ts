import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { $accountLogin } from '@/api/bms/app/login'
import { local } from '@/utils/storage'
import key from '@/config/key'

export const useUserStore = defineStore('userStore', ()=>{
	
	const user = reactive({
		userId: '',
		username: '',
		realName: '',
		avatar: '',
		gender: 0,
		email: '',
		mobile: '',
		organId: 0,
		organName: '',
		superAdmin: 0,
		createTime: null,
		postIdList: [],
		postNameList: []
	})
	
	const token = ref(local.get(key.cache.token))
	
	const refreshToken = ref(local.get(key.cache.refreshToken))
	
	const authorityList = reactive([])
	
	const setToken = (val:any)=>{
		token.value = val;
		local.set(key.cache.token, val)
	}
	
	const setRefreshToken = (val:any)=>{
		refreshToken.value = val;
		local.set(key.cache.refreshToken, val)
	}
	
	const accountLogin = async (loginForm: any)=>{
		const { data } = await $accountLogin(loginForm)
		setToken(data.access_token)
		setRefreshToken(data.refresh_token)
	}
	
	const getLoginData = async ()=>{
		const { data } = await $getLoginData()
		
	}
	
	return { user, token, refreshToken, authorityList, setToken, setRefreshToken, accountLogin }
	
})