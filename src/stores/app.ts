import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import cache from '@/cache'
import { getAllAttrData } from '@/api/bms/system/attr'
import { getAllDictData } from '@/api/bms/system/dict'

export const useAppStore = defineStore('appStore', ()=>{
	
	let attr = reactive({})
	
	let dict = reactive({})
	
	const sidebar = ref(cache.getSidebar())
	
	const lang = ref(cache.getLang())
	
	const size = ref(cache.getSize())
	
	let theme = reactive(cache.getTheme())

	const getAttr = async () => {
		const { data } = await getAllDictData()
		attr = data;
	}

	const getDict = async () => {
		const { data } = await getAllDictData()
		dict = data
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
	
	return { attr, dict, sidebar, lang, size, theme, getAttr, getDict, setSidebar, setLang, setSize, setTheme }
	
})