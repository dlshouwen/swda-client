// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/dict';

/**
 * get attr data
 * @params dictType
 * @params query
 */
export const $getDictPageResult = (dictType: string, query: any) => {
	return request.post(path+'/page/'+dictType, query)
}

/**
 * get attr data
 * @params dictType
 */
export const $getDictData = (dictId: number) => {
	return request.get(path+'/'+dictId+'/data')
}

/**
 * get attr data
 * @params dictType
 */
export const $addDict = (dict: any) => {
	return request.post(path+'/add', dict)
}

/**
 * get attr data
 * @params dictType
 */
export const $updateDict = (dict: any) => {
	return request.post(path+'/update', dict)
}

/**
 * get attr data
 * @params dictType
 */
export const $deleteDict = (dictIdList: any) => {
	return request.delete(path+'/delete', dictIdList)
}