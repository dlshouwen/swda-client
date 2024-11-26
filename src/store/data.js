/**
 * import define store
 */
import { defineStore } from 'pinia'

/**
 * import request: getData
 */
import { $getData } from '@/assets/config/api';

/**
 * import config
 */
import * as config from '@/assets/config/config'

/**
 * export
 */
export const useDataStore = defineStore('data', {
	state: () => {
		return {
			attr: {},
			dict: {},
			value: {},
			path: {},
			expired: null
		}
	},
	actions: {
		/**
		 * getData
		 */
		getData() {
			return new Promise((resolve, reject) => {
				// get data
				$getData().then(handler => {
					// reject
					if (handler.data.code != 0) {
						reject(handler.data.message);
					} else {
						// set attr & dict & value & path & expired
						this.attr = handler.data.data.attr
						this.dict = handler.data.data.dict
						this.value = handler.data.data.value
						this.path = handler.data.data.path
						this.expired = handler.data.data.expired
						// resolve
						resolve()
					}
				}).catch(error => {
					// reject
					reject(config.message.error.get_data_error);
				});
			})
		}
	}
})