// import request
import request from '@/utils/request'

/**
 * get auth list
 */
export const $getAuthList = () => {
	return request.post('/auth/list')
}

/**
 * render auth
 */
export const $renderAuth = (openType: string) => {
	return request.post('/auth/render/'+openType)
}

/**
 * callback auth
 */
export const $callbackAuth = (openType: string) => {
	return request.post('/callback/'+openType)
}

/**
 * bind auth
 */
export const $bindAuth = (callback: any) => {
	return request.post('/auth/bind', callback)
}

/**
 * unbind auth
 */
export const $unbindAuth = (openType: string) => {
	return request.post('/auth/unbind/'+openType)
}