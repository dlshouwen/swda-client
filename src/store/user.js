/**
 * import define store
 */
import { defineStore } from 'pinia'

/**
 * import storage: get token & set token & remove token
 */
import { getToken, setToken, removeToken } from '@/assets/utils/storage'

/**
 * import request: login & get layout data & logout
 */
import { $login, $getLayoutData, $logout } from '@/assets/config/api'

/**
 * import config
 */
import * as config from '@/assets/config/config'

/**
 * export
 */
export const useUserStore = defineStore('user', {
	state: () => {
		return {
			token: getToken(),
			user: null,
			systemId: null,
			systems: [],
			permissions: [],
			values: [],
			paths: [],
			shortcuts: []
		}
	},
	actions: {
		/**
		 * login
		 * @param params
		 */
		login(params) {
			return new Promise((resolve, reject) => {
				// do login
				$login(params).then(handler => {
					// if error reject
					if (handler.data.code != 0) {
						reject(handler.data.message)
					} else {
						// set token
						setToken(handler.data.data.token)
						// set token to store
						this.token = handler.data.data.token
						// resolve
						resolve()
					}
				}).catch((error) => {
					// reject
					reject(error.data.message)
					// console error
					console.error(error);
				})
			})
		},
		/**
		 * get layout data
		 * @param params
		 */
		getLayoutData(params) {
			return new Promise((resolve, reject) => {
				// get layout data
				$getLayoutData(params).then(handler => {
					// if error reject
					if (handler.data.code != 0) {
						reject(handler.data.message)
					} else {
						// set user & system id & systems & permissions & shortcuts
						this.user = handler.data.data.user
						this.systemId = handler.data.data.systemList[0].system_id + ''
						this.systems = handler.data.data.systemList
						this.permissions = handler.data.data.permissionList
						this.values = handler.data.data.permissionValueInfo
						this.paths = handler.data.data.permissionPathInfo
						this.shortcuts = handler.data.data.shortcutList
						// resolve
						resolve()
					}
				}).catch(error => {
					// reject
					reject(config.message.error.get_layout_data_error)
					// console error
					console.error(error)
				})
			})
		},
		/**
		 * change system
		 * @param systemId
		 */
		changeSystem(systemId) {
			this.systemId = systemId;
		},
		/**
		 * logout
		 */
		logout() {
			return new Promise((resolve, reject) => {
				// do logout
				$logout().then(handler => {
					// if error reject
					if (handler.data.code != 0) {
						reject(handler.data.message)
					} else {
						// remove token
						removeToken();
						// reset token  & user & system id & systems & permissions & shortcuts
						this.token = ''
						this.user = null
						this.systemId = null
						this.systems = []
						this.permissions = []
						this.values =[]
						this.paths = []
						this.shortcuts = []
						// resolve
						resolve()
					}
				}).catch(error => {
					// reject
					reject(config.message.error.logout_error)
					// console error
					console.error(error)
				})
			})
		},
		/**
		 * reset token
		 */
		resetToken() {
			return new Promise((resolve) => {
				// remove token
				removeToken();
				// reset token  & user & system id & systems & permissions & shortcuts
				this.token = ''
				this.user = null
				this.systemId = null
				this.systems = []
				this.permissions = []
				this.values =[]
				this.paths = []
				this.shortcuts = []
				// resolve
				resolve()
			})
		}
	}
})