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
  * @params user
 */
export const $updateLoginUser = (user: any) => {
	return request.post(path+'/login/update', user)
}

/**
 *  update login user avatar
  * @params userAvatar
 */
export const $updateLoginUserAvatar = (userAvatar: any) => {
	return request.post(path+'/login/avatar/update', userAvatar)
}

/**
 *  update login user password
  * @params userPassword
 */
export const $updateLoginUserPassword = (userPassword: any) => {
	return request.post(path+'/login/password/update', userPassword)
}

/**
 *  get user page result
  * @params query
 */
export const $getUserPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get user data
  * @params userId
 */
export const $getUserData = (userId: number) => {
	return request.get(path+'/data/'+userId)
}

/**
 *  add user
  * @params user
 */
export const $addUser = (user: any) => {
	return request.post(path+'/add', user)
}

/**
 *  update user
  * @params user
 */
export const $updateUser = (user: any) => {
	return request.post(path+'/update', user)
}

/**
 *  delete user
  * @params userIdList
 */
export const $deleteUser = (userIdList: any) => {
	return request.delete(path+'/delete', userIdList)
}

/**
 *  get user name list
  * @params userIdList
 */
export const $getUserNameList = (userIdList: any) => {
	return request.post(path+'/name/list', userIdList)
}

/**
 *  import user
  * @params file
 */
export const $importUser = (file: any) => {
	return request.post(path+'/import', file)
}