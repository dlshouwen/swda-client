import request from '@/utils/request'

const path = '/bms/system/permission';

export const $getLoginUserMenuList = () => {
	return request.post(path+'/login/user/menu/list')
}

export const $getLoginUserAuthorityList = () => {
	return request.post(path+'/login/user/authority/list')
}

export const $getPermissionList = (permissionType: number) => {
	return request.post(path+'/page', permissionType)
}

export const $getPermissionData = (permissionId: number) => {
	return request.get(path+'/data/'+permissionId)
}

export const $addPermission = (permission: any) => {
	return request.post(path+'/add', permission)
}

export const $updatePermission = (permission: any) => {
	return request.post(path+'/update', permission)
}

export const $deletePermission = (permissionIdList: any) => {
	return request.delete(path+'/delete', permissionIdList)
}