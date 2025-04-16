// import pinia
import { defineStore } from 'pinia'

// import tools
import { local } from '@/utils/storage'

// import config
import config from '@/config'

// import apis
import { $accountLogin, $logout } from '@/api/core/base/login'
import { $getLoginUserData } from '@/api/bms/permission/user'
import { $getLoginUserSystemList } from '@/api/bms/system/system'
import { $getLoginUserMenuList, $getLoginUserAuthorityList } from '@/api/bms/system/menu'

// export store
export const useUserStore = defineStore('userStore', {
	// state
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
	// actions
	actions: {
		/**
		 * set user
		 * @param value
		 */
		setUser(value: any) {
			// set user
			this.user = value
		},
		/**
		 * set token
		 * @param value
		 */
		setToken(value:any) {
			// set token
			this.token = value
			// set storage token
			local.set(config.key.token, value)
		},
		/**
		 * set refresh token
		 * @param value
		 */
		setRefreshToken(value:any) {
			// set refresh token
			this.refreshToken = value
			// set storage refresh token
			local.set(config.key.refreshToken, value)
		},
		/**
		 * login
		 * @param type
		 * @param loginForm
		 */
		async login(type:string, loginForm:any) {
			// type: account
			if(type==='account'){
				// accoutn login
				const { data } = await $accountLogin(loginForm)
				// set token
				this.setToken(data.access_token)
				// set refresh token
				this.setRefreshToken(data.refresh_token)
			}
		},
		/**
		 * get login user data
		 */
		async getLoginUserData() {
			// get login user data
			const { data } = await $getLoginUserData()
			// set user
			this.setUser(data)
		},
		/**
		 * get login user system list
		 */
		async getLoginUserSystemList() {
			// get login user system list
			const { data } = await $getLoginUserSystemList()
			// set system list
			this.systemList = data || []
			// set system id is first system id
			this.systemId = this.systemList.length>0?this.systemList[0].systemId:0
		},
		/**
		 * get login user menu list
		 */
		async getLoginUserMenuList() {
			// get login user menu list
			const { data } = await $getLoginUserMenuList()
			// set menu list
			this.menuList = data || []
		},
		/**
		 * get login user authority list
		 */
		async getLoginUserAuthorityList() {
			// get login user authority list
			const { data } = await $getLoginUserAuthorityList()
			// set authority list
			this.authorityList = data || []
		},
		/**
		 * logout
		 */
		async logout() {
			// logout
			await $logout()
			// clear token
			this.setToken(null)
			// clear refresh token
			this.setRefreshToken(null)
		}
	}
})