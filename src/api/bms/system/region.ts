// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/region';

/**
 * get region list
 * @param regionId
 */
export const $getRegionList = (regionId) => {
	return request.post(path+'/list', regionId)
}

/**
 * get region data
 * @param regionId
 */
export const $getRegionData = (regionId: number) => {
	return request.get(path+'/'+regionId+'/data')
}

/**
 * add region
 * @param region
 */
export const $addRegion = (region: any) => {
	return request.post(path+'/add', region)
}

/**
 * update region
 * @param region
 */
export const $updateRegion = (region: any) => {
	return request.post(path+'/update', region)
}

/**
 * delete region
 * @param regionId
 */
export const $deleteRegion = (regionId: any) => {
	return request.post(path+'/delete', regionId)
}
