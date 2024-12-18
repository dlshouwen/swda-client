import { local, session } from '@/utils/storage'
import key from '@/config/key'
import theme from '@/config/theme'

class Cache {
	
	getAttr = (): any => {
		return local.get(key.cache.attr)
	}
	
	setAttr = (value: any) => {
		return local.set(key.cache.attr, value)
	}
	
	getDict = (): any => {
		return local.get(key.cache.dict)
	}
	
	setDict = (value: any) => {
		return local.set(key.cache.dict, value)
	}
	
	getToken = (): string => {
		return local.get(key.cache.token) || ''
	}

	setToken = (value: string) => {
		local.set(key.cache.token, value)
	}

	getRefreshToken = (): string => {
		return local.get(key.cache.refreshToken) || ''
	}

	setRefreshToken = (value: string) => {
		local.set(key.cache.refreshToken, value)
	}

	getSidebar = (): boolean => {
		return local.get(key.cache.sidebar) || false
	}

	setSidebar = (value: boolean) => {
		local.set(key.cache.sidebar, value)
	}

	getLang = (): string => {
		return local.get(key.cache.lang) || 'zh-cn'
	}

	setLang = (value: string) => {
		local.set(key.cache.lang, value)
	}

	getSize = (): string => {
		return local.get(key.cache.size) || 'default'
	}

	setSize= (value: string) => {
		local.set(key.cache.size, value)
	}

	getTheme = () => {
		return (session.get(key.cache.theme)) || theme
	}

	setTheme = (value: any) => {
		session.set(key.cache.theme, value)
	}

	removeTheme = () => {
		session.remove(key.cache.theme)
	}

}

export default new Cache()