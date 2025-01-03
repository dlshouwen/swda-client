import request from '@/utils/request'

export const $getAuthList = () => {
	return request.post('/auth/list')
}

export const $renderAuth = (openType: string) => {
	return request.post('/auth/render/'+openType)
}

export const $callbackAuth = (openType: string) => {
	return request.post('/callback/'+openType)
}

export const $bindAuth = (callback: any) => {
	return request.post('/auth/bind', callback)
}

export const $unbindAuth = (openType: string) => {
	return request.post('/auth/unbind/'+openType)
}