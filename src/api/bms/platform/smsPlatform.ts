// import request
import request from '@/utils/request'

// const base path
const path = '/bms/platform/sms_platform';

/**
 * get sms platform page result
 * @param query
 */
export const $getSmsPlatformPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 * get sms platform list
 * @param smsPlatformType
 */
export const $getSmsPlatformList = (smsPlatformType: number) => {
	return request.post(path+'/list', smsPlatformType)
}

/**
 * get sms platform data
 * @param smsPlatformId
 */
export const $getSmsPlatformData = (smsPlatformId: number) => {
	return request.get(path+'/'+smsPlatformId+'/data')
}

/**
 * add sms platform
 * @param smsPlatform
 */
export const $addSmsPlatform = (smsPlatform: any) => {
	return request.post(path+'/add', smsPlatform)
}

/**
 * update sms platform
 * @param smsPlatform
 */
export const $updateSmsPlatform = (smsPlatform: any) => {
	return request.post(path+'/update', smsPlatform)
}

/**
 * delete sms platform
 * @param smsPlatformIdList
 */
export const $deleteSmsPlatform = (smsPlatformIdList: any) => {
	return request.post(path+'/delete', smsPlatformIdList)
}

/**
 * send sms
 * @param sendSms
 */
export const $sendSms = (sendSms: any) => {
	return request.post(path+'/send', sendSms)
}
