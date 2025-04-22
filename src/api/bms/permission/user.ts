// import request
import request from '@/utils/request'

// const base path
const path = '/bms/permission/user';

/**
 * get login user data
 */
export const $getLoginUserData = () => {
	return request.get(path+'/login/data')
}

/**
 *  update login user
  * @param user
 */
export const $updateLoginUser = (user: any) => {
	return request.post(path+'/login/update', user)
}

/**
 *  update login user avatar
  * @param userAvatar
 */
export const $updateLoginUserAvatar = (userAvatar: any) => {
	return request.post(path+'/login/avatar/update', userAvatar)
}

/**
 *  update login user password
  * @param userPassword
 */
export const $updateLoginUserPassword = (userPassword: any) => {
	return request.post(path+'/login/password/update', userPassword)
}

/**
 *  get user page result
  * @param query
 */
export const $getUserPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get user data
  * @param userId
 */
export const $getUserData = (userId: number) => {
	return request.get(path+'/'+userId+'/data')
}

/**
 *  add user
  * @param user
 */
export const $addUser = (user: any) => {
	return request.post(path+'/add', user)
}

/**
 *  update user
  * @param user
 */
export const $updateUser = (user: any) => {
	return request.put(path+'/update', user)
}

/**
 *  delete user
  * @param userIdList
 */
export const $deleteUser = (userIdList: any) => {
	return request.delete(path+'/delete', userIdList)
}

/**
 *  get user name list
  * @param userIdList
 */
export const $getUserNameList = (userIdList: any) => {
	return request.post(path+'/name/list', userIdList)
}

/**
 *  import user
  * @param file
 */
export const $importUser = (file: any) => {
	return request.post(path+'/import', file)
}