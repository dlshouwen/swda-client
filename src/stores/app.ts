import { defineStore } from 'pinia'
import config from '@/config'
import { local } from '@/utils/storage'
import { $getAttrData, $getDictData } from '@/api/bms/app/app'

const expired = {attr:0, dict:0}

export const useAppStore = defineStore('appStore', {
	state: () => ({
		attr: {} as {[key:string]:string},
		dict: {} as {[key:string]:any},
		sidebar: local.get(config.key.sidebar) || config.default.sidebar,
		lang: local.get(config.key.lang) || config.default.lang,
		size: local.get(config.key.size) || config.default.size,
		theme: local.get(config.key.theme) || config.default.theme,
	}),
	actions: {
		async loadAttr() {
			// get timestamp
			const timestamp = new Date().getTime()
			// if timeout
			if(timestamp>(expired.attr+config.app.attr.expired)){
				try{
					// get attr data
					const { data } = await $getAttrData()
					// get attrs
					const attrs: [{attrId:string,content:string}] = data
					// for each attr
					attrs.forEach(attr => {
						// set data
						this.attr[attr.attrId] = attr.content
					})
					// reset expired
					expired.attr = timestamp
				}catch(e){
					
				}
			}
		},
		async loadDict() {
			// get timestamp
			const timestamp = new Date().getTime()
			// if timeout
			if(timestamp>(expired.dict+config.app.dict.expired)){
				try{
					// get dict data
					const { data } = await $getDictData()
					// get dict types, dicts
					const dictTypes: [{dictTypeId:number,dictType:string}] = data.dictTypeList
					const dicts: [{dictTypeId:number,dictType:string,dictKey:string,dictId:number,dictName:string,dictValue:string,dictClass:string}] = data.dictList
					// for each dict type
					dictTypes.forEach(dictType=>{
						// reset dict
						this.dict[dictType.dictType] = {}
						// defined datas
						const datas: any = []
						// for each dict
						dicts.forEach(_dict=>{
							// is dict type
							if(_dict.dictTypeId===dictType.dictTypeId){
								// add to datas
								datas.push(_dict)
								// set value
								this.dict[dictType.dictType][_dict.dictKey] = {
									id: _dict.dictId,
									name: _dict.dictName,
									key: _dict.dictKey,
									value: _dict.dictValue,
									_class: _dict.dictClass
								}
							}
						})
						// set datas to dict
						this.dict[dictType.dictType].datas = datas
					})
					// reset expired
					expired.dict = timestamp
				}catch(e){
					
				}
			}
		},
		setSidebar(value : boolean) {
			this.sidebar = value
			local.set(config.key.sidebar, value)
		},
		setLang(value : string) {
			this.lang = value
			local.set(config.key.lang, value)
		},
		setSize(value : string) {
			this.size = value
			local.set(config.key.size, value)
		},
		setTheme(value : any) {
			this.theme = value
			local.set(config.key.theme, value)
		}
	}
})