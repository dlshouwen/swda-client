// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/town';

/**
 * get town page result
 * @param query
 */
export const $getTownPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 * get town data
 * @param townId
 */
export const $getTownData = (townId: number) => {
	return request.get(path+'/data/'+townId)
}

/**
 * add town
 * @param town
 */
export const $addTown = (town: any) => {
	return request.post(path+'/add', town)
}

/**
 * update town
 * @param town
 */
export const $updateTown = (town: any) => {
	return request.post(path+'/update', town)
}

/**
 * delete town
 * @param townIdList
 */
export const $deleteTown = (townIdList: any) => {
	return request.post(path+'/delete', townIdList)
}
