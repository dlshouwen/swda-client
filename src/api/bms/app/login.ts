import request from '@/utils/request'

export const $getLoginCaptcha = (data: any) => {
	return request.get('/login/captcha')
}

export const $accountLogin = (data: any) => {
	return request.post('/login/account', data)
}