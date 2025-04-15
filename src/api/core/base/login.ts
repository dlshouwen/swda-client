// import request
import request from '@/utils/request'

/**
 * get login captcha
 */
export const $getLoginCaptcha = () => {
	return request.get('/login/captcha')
}

/**
 * account login
 */
export const $accountLogin = (data: any) => {
	return request.post('/login/account', data)
}

/**
 * logout
 */
export const $logout = () => {
	return request.post('/logout')
}