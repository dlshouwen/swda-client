import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

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
		createTime: null
	})
	
	const token = ref('')
	
	const refreshToken = ref('')
	
	const authorityList = reactive([])
	
	const setToken = (val:any)=>{
		token.value = val;
	}
	
	const setRefreshToken = (val:any)=>{
		refreshToken.value = val;
	}
	
	return { user, token, refreshToken, authorityList, setToken, setRefreshToken }
	
})