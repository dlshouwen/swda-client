// import request
import request from '@/utils/request'

const path = '/bms/system/role';

export const $getRolePageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getRoleList = () => {
	return request.post(path+'/list')
}

export const $getRoleData = (roleId: number) => {
	return request.get(path+'/data/'+roleId)
}

export const $addRole = (role: any) => {
	return request.post(path+'/add', role)
}

export const $updateRole = (role: any) => {
	return request.post(path+'/update', role)
}

export const $setRoleDataScope = (roleDataScope: any) => {
	return request.post(path+'/data_scope/set', roleDataScope)
}

export const $deleteRole = (roleIdList: any) => {
	return request.delete(path+'/delete', roleIdList)
}

export const $getRoleUserPageResult = (query: any) => {
	return request.post(path+'/user/page', query)
}

export const $addRoleUser = (roleId: number, userIdList: any) => {
	return request.post(path+'/'+roleId+'/user/add', userIdList)
}

export const $deleteRoleUser = (roleId: number, userIdList: any) => {
	return request.post(path+'/'+roleId+'/user/delete', userIdList)
}

export const $getRoleNameList = (roleIdList: any) => {
	return request.post(path+'/name/list', roleIdList)
}