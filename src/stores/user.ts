import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { $accountLogin, $logout } from '@/api/bms/app/login'
import { $getLoginUserData } from '@/api/bms/system/user'
import { $getLoginUserSystemList } from '@/api/bms/system/system'
import { $getLoginUserMenuList, $getLoginUserAuthorityList } from '@/api/bms/system/permission'
import { local } from '@/utils/storage'
import config from '@/config'

export const useUserStore = defineStore('userStore', {
	state: () => ({
		user:{
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
		},
		token: local.get(config.key.token),
		refreshToken: local.get(config.key.refreshToken),
		systemId: 0,
		systemList: [],
		menuList: [],
		authorityList: []
	}),
	actions: {
		setUser(value: any) {
			this.user = value
		},
		setToken(value:any) {
			this.token = value
			local.set(config.key.token, value)
		},
		setRefreshToken(value:any) {
			this.refreshToken = value
			local.set(config.key.refreshToken, value)
		},
		async login(type:string, loginForm:any) {
			if(type==='account'){
				const { data } = await $accountLogin(loginForm)
				this.setToken(data.access_token)
				this.setRefreshToken(data.refresh_token)
			}
		},
		async getLoginUserData() {
			const { data } = await $getLoginUserData()
			this.setUser(data)
		},
		async getLoginUserSystemList() {
			const { data } = await $getLoginUserSystemList()
			this.systemList = data || []
			this.systemId = this.systemList.length>0?this.systemList[0].systemId:0
		},
		async getLoginUserMenuList() {
			const { data } = await $getLoginUserMenuList()
			this.menuList = data || []
		},
		async getLoginUserAuthorityList() {
			const { data } = await $getLoginUserAuthorityList()
			this.authorityList = data || []
		},
		async logout() {
			await $logout()
			this.setToken(null)
			this.setRefreshToken(null)
		}
	}
})