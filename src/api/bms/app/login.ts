import request from '@/utils/request'

export const $getLoginCaptcha = () => {
	return request.get('/login/captcha')
}

export const $accountLogin = (data: any) => {
	return request.post('/login/account', data)
}

export const $logout = () => {
	return request.post('/logout')
}