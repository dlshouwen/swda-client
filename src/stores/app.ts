import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import config from '@/config/config'
import cache from '@/cache'
import { getAttrData, getDictData } from '@/api/bms/app/app'

export const useAppStore = defineStore('appStore', ()=>{
	
	const expired = {attr:0, dict:0}
	
	const attr = reactive({})
	
	const dict = reactive({})
	
	const sidebar = ref(cache.getSidebar())
	
	const lang = ref(cache.getLang())
	
	const size = ref(cache.getSize())
	
	const theme = reactive(cache.getTheme())
	
	const loadAttr = async () => {
		// get timestamp
		const timestamp = new Date().getTime()
		// if timeout
		if(timestamp>(expired.attr+config.app.attr.expired)){
			// get attr data
			const data = await getAttrData()
			// get attrs
			const attrs = data.data
			// for each attr
			attrs.forEach(_attr => {
				// set data
				attr[_attr.attrId] = _attr.content
			})
			// reset expired
			expired.attr = timestamp
		}
	}
	
	const loadDict = async () => {
		// get timestamp
		const timestamp = new Date().getTime()
		// if timeout
		if(timestamp>(expired.dict+config.app.dict.expired)){
			// get dict data
			const data = await getDictData()
			// get dict types, dicts
			const dictTypes = data.data.dictTypeList
			const dicts = data.data.dictList
			// for each dict type
			dictTypes.forEach(dictType=>{
				// reset dict
				dict[dictType.dict_type] = {}
				// defined datas
				const datas = []
				// for each dict
				dicts.forEach(_dict=>{
					// is dict type
					if(_dict.dict_type_id===dictType.dict_type_id){
						// add to datas
						datas.push(_dict)
						// set value
						dict[dictType.dict_type][_dict.dict_key] = {
							id: _dict.dict_id,
							name: _dict.dict_name,
							key: _dict.dict_key,
							value: _dict.dict_value,
							_class: _dict.dict_class
						}
					}
				})
				// set datas to dict
				dict[dictType.dict_type].datas = datas
			})
			// reset expired
			expired.dict = timestamp
		}
	}

	const setSidebar = (value: boolean) => {
		sidebar.value = value
		cache.setSidebar(value)
	}
	
	const setLang = (value: string) => {
		lang.value = value
		cache.setLang(value)
	}

	const setSize = (value: string) => {
		size.value = value
		cache.setSize(value)
	}
	
	const setTheme = (value: any) => {
		theme = value
		cache.setTheme(value)
	}
	
	return { expired, attr, dict, sidebar, lang, size, theme, loadAttr, loadDict, setSidebar, setLang, setSize, setTheme }
	
})