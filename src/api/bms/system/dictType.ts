// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/dict_type';

/**
 * get dict type page result
 * @params query
 */
export const $getDictTypePageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 * get dict type data
 * @params dictTypeId
 */
export const $getDictTypeData = (dictTypeId: number) => {
	return request.get(path+'/'+dictTypeId+'/data')
}

/**
 * add dict type
 * @params dictType
 */
export const $addDictType = (dictType: any) => {
	return request.post(path+'/add', dictType)
}

/**
 *  update dict type
  * @params dictType
 */
export const $updateDictType = (dictType: any) => {
	return request.post(path+'/update', dictType)
}

/**
 *  delete dict type
  * @params dictTypeIdList
 */
export const $deleteDictType = (dictTypeIdList: any) => {
	return request.delete(path+'/delete', dictTypeIdList)
}

/**
 *  get sql dict list
  * @params dictTypeId
 */
export const $getSqlDictList = (dictTypeId: number) => {
	return request.get(path+'/delete'+dictTypeId)
}

/**
 * refresh dict trans cache
 */
export const $refreshDictTransCache = () => {
	return request.get(path+'/refresh')
}