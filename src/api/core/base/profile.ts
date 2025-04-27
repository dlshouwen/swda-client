// import request
import request from '@/utils/request'

/**
 * update login user
 * @param loginUser
 */
export const $updateLoginUser = (loginUser: any) => {
	return request.post('/profile/login/user/update', loginUser)
}

/**
 * update login user avatar
 * @param userAvatar
 */
export const $updateLoginUserAvatar = (userAvatar: any) => {
	return request.post('/profile/login/user/avatar/update', userAvatar)
}

/**
 * update login user password
 * @param userPassword
 */
export const $updateLoginUserPassword = (userPassword: any) => {
	return request.post('/profile/login/user/password/update', userPassword)
}

/**
 * get auth list
 */
export const $getAuthList = () => {
	return request.post('/profile/auth/list')
}

/**
 * render auth
 * @param openType
 */
export const $renderAuth = (openType: string) => {
	return request.post('/profile/auth/render/'+openType)
}

/**
 * callback auth
 * @param openType
 */
export const $callbackAuth = (openType: string) => {
	return request.post('/profile/callback/'+openType)
}

/**
 * bind auth
 * @param callback
 */
export const $bindAuth = (callback: any) => {
	return request.post('/profile/auth/bind', callback)
}

/**
 * unbind auth
 * @param openType
 */
export const $unbindAuth = (openType: string) => {
	return request.post('/profile/auth/unbind/'+openType)
}