import request from '@/utils/request'

export const userCaptcha = (data: any) => {
	return request.get('/login/captcha')
}