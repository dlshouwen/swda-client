// import request
import request from '@/utils/request'

// const base path
const path = '/bms/permission/role';

/**
 * get role page result
 * @param query
 */
export const $getRolePageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 * get role list
 */
export const $getRoleList = () => {
	return request.post(path+'/list')
}

/**
 * get role data
 * @param roleId
 */
export const $getRoleData = (roleId: number) => {
	return request.get(path+'/data/'+roleId)
}

/**
 * add role
 * @param role
 */
export const $addRole = (role: any) => {
	return request.post(path+'/add', role)
}

/**
 * update role
 * @param role
 */
export const $updateRole = (role: any) => {
	return request.post(path+'/update', role)
}

/**
 * set role data scope
 * @param roleDataScope
 */
export const $setRoleDataScope = (roleDataScope: any) => {
	return request.post(path+'/data_scope/set', roleDataScope)
}

/**
 * delete role
 * @param roleIdList
 */
export const $deleteRole = (roleIdList: any) => {
	return request.post(path+'/delete', roleIdList)
}

/**
 * get role user page result
 * @param query
 */
export const $getRoleUserPageResult = (query: any) => {
	return request.post(path+'/user/page', query)
}

/**
 * add role user
 * @param roleId
 * @param userIdList
 */
export const $addRoleUser = (roleId: number, userIdList: any) => {
	return request.post(path+'/'+roleId+'/user/add', userIdList)
}

/**
 * delete role user
 * @param roleId
 * @param userIdList
 */
export const $deleteRoleUser = (roleId: number, userIdList: any) => {
	return request.post(path+'/'+roleId+'/user/delete', userIdList)
}

/**
 * get role name list
 * @param roleIdList
 */
export const $getRoleNameList = (roleIdList: any) => {
	return request.post(path+'/name/list', roleIdList)
}