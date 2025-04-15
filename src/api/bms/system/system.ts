// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/system';

/**
 * get login user system list
 */
export const $getLoginUserSystemList = () => {
	return request.post(path+'/login/user/system/list')
}

/**
 *  get system page result
  * @params query
 */
export const $getSystemPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get system data
  * @params systemId
 */
export const $getSystemData = (systemId: number) => {
	return request.get(path+'/data/'+systemId)
}

/**
 *  add system
  * @params system
 */
export const $addSystem = (system: any) => {
	return request.post(path+'/add', system)
}

/**
 *  update system
  * @params system
 */
export const $updateSystem = (system: any) => {
	return request.post(path+'/update', system)
}

/**
 *  delete system
  * @params systemIdList
 */
export const $deleteSystem = (systemIdList: any) => {
	return request.delete(path+'/delete', systemIdList)
}
