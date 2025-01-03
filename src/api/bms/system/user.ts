import request from '@/utils/request'

const path = '/bms/system/user';

export const $getUserPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getUserData = (userId: number) => {
	return request.get(path+'/data/'+userId)
}

export const $getLoginUserData = () => {
	return request.get(path+'/login/data')
}

export const $updateLoginUser = (user: any) => {
	return request.post(path+'/login/update', user)
}

export const $updateAvatar = (userAvatar: any) => {
	return request.post(path+'/avatar/update', userAvatar)
}

export const $updatePassword = (userPassword: any) => {
	return request.post(path+'/password/update', userPassword)
}

export const $addUser = (user: any) => {
	return request.post(path+'/add', user)
}

export const $updateUser = (user: any) => {
	return request.post(path+'/update', user)
}

export const $deleteUser = (userIdList: any) => {
	return request.delete(path+'/delete', userIdList)
}

export const $getUserNameList = (userIdList: any) => {
	return request.post(path+'/name/list', userIdList)
}

export const $importUser = (file: any) => {
	return request.post(path+'/import', file)
}