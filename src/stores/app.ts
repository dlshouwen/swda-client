// import pinia
import { defineStore } from 'pinia'

// import config
import config from '@/config'

// import tools
import { local } from '@/utils/storage'

// import apis
import { $getAttrData, $getDictData } from '@/api/core/base/app'

// defined expired
const expired = {attr:0, dict:0}

// export store
export const useAppStore = defineStore('appStore', {
	// state
	state: () => ({
		attr: {} as {[key:string]:string},
		dict: {} as {[key:string]:any},
		lang: local.get(config.key.lang) || config.default.lang,
		size: local.get(config.key.size) || config.default.size,
		theme: local.get(config.key.theme) || config.default.theme,
	}),
	// actions
	actions: {
		/**
		 * load attr
		 */
		async loadAttr() {
			// get timestamp
			const timestamp = new Date().getTime()
			// if timeout
			if(timestamp>(expired.attr+config.app.attr.expired)){
				try{
					// get attr data
					const { data } = await $getAttrData()
					// set attr data
					this.attr = data
					// reset expired
					expired.attr = timestamp
				}catch(e){
					// output
					console.error(e)
				}
			}
		},
		/**
		 * load dict
		 */
		async loadDict() {
			// get timestamp
			const timestamp = new Date().getTime()
			// if timeout
			if(timestamp>(expired.dict+config.app.dict.expired)){
				try{
					// get dict data
					const { data } = await $getDictData()
					// set dict data
					this.dict = data
					// reset expired
					expired.dict = timestamp
				}catch(e){
					// output
					console.error(e)
				}
			}
		},
		/**
		 * set lang
		 * @param value
		 */
		setLang(value : string) {
			// set value
			this.lang = value
			// set storage
			local.set(config.key.lang, value)
		},
		/**
		 * set size
		 * @param value
		 */
		setSize(value : string) {
			// set value
			this.size = value
			// set storage
			local.set(config.key.size, value)
		},
		/**
		 * set theme
		 * @param value
		 */
		setTheme(value : any) {
			// set value
			this.theme = value
			// set storage
			local.set(config.key.theme, value)
		}
	}
})