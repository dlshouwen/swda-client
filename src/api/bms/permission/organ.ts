// import request
import request from '@/utils/request'

// const base path
const path = '/bms/permission/organ';

/**
 * get organ list
 */
export const $getOrganList = () => {
	return request.post(path+'/list')
}

/**
 *  get organ data
  * @params organId
 */
export const $getOrganData = (organId: number) => {
	return request.get(path+'/data/'+organId)
}

/**
 *  add organ
  * @params organ
 */
export const $addOrgan = (organ: any) => {
	return request.post(path+'/add', organ)
}

/**
 *  update organ
  * @params organ
 */
export const $updateOrgan = (organ: any) => {
	return request.post(path+'/update', organ)
}

/**
 *  delete organ
  * @params organIdList
 */
export const $deleteOrgan = (organIdList: any) => {
	return request.delete(path+'/delete', organIdList)
}

/**
 *  get organ name list
  * @params organIdList
 */
export const $getOrganNameList = (organIdList: any) => {
	return request.post(path+'/name/list', organIdList)
}