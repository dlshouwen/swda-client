// import request
import request from '@/utils/request'

// const base path
const path = '/bms/permission/role';

/**
 *  get role page result
  * @params query
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
 *  get role data
  * @params roleId
 */
export const $getRoleData = (roleId: number) => {
	return request.get(path+'/data/'+roleId)
}

/**
 *  add role
  * @params role
 */
export const $addRole = (role: any) => {
	return request.post(path+'/add', role)
}

/**
 *  update role
  * @params role
 */
export const $updateRole = (role: any) => {
	return request.post(path+'/update', role)
}

/**
 *  set role data scope
  * @params roleDataScope
 */
export const $setRoleDataScope = (roleDataScope: any) => {
	return request.post(path+'/data_scope/set', roleDataScope)
}

/**
 *  delete role
  * @params roleIdList
 */
export const $deleteRole = (roleIdList: any) => {
	return request.delete(path+'/delete', roleIdList)
}

/**
 *  get role user page result
  * @params query
 */
export const $getRoleUserPageResult = (query: any) => {
	return request.post(path+'/user/page', query)
}

/**
 *  add role user
 * @params roleId
 * @params userIdList
 */
export const $addRoleUser = (roleId: number, userIdList: any) => {
	return request.post(path+'/'+roleId+'/user/add', userIdList)
}

/**
 *  delete role user
  * @params roleId
  * @params userIdList
 */
export const $deleteRoleUser = (roleId: number, userIdList: any) => {
	return request.post(path+'/'+roleId+'/user/delete', userIdList)
}

/**
 *  get role name list
  * @params roleIdList
 */
export const $getRoleNameList = (roleIdList: any) => {
	return request.post(path+'/name/list', roleIdList)
}