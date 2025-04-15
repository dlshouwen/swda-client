// import request
import request from '@/utils/request'

// const base path
const path = '/bms/platform/sms_platform';

/**
 *  get sms platform page result
  * @params query
 */
export const $getSmsPlatformPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get sms platform list
  * @params smsPlatformType
 */
export const $getSmsPlatformList = (smsPlatformType: number) => {
	return request.post(path+'/list', smsPlatformType)
}

/**
 *  get sms platform data
  * @params smsPlatformId
 */
export const $getSmsPlatformData = (smsPlatformId: number) => {
	return request.get(path+'/'+smsPlatformId+'/data')
}

/**
 *  add sms platform
  * @params smsPlatform
 */
export const $addSmsPlatform = (smsPlatform: any) => {
	return request.post(path+'/add', smsPlatform)
}

/**
 *  update sms platform
  * @params smsPlatform
 */
export const $updateSmsPlatform = (smsPlatform: any) => {
	return request.post(path+'/update', smsPlatform)
}

/**
 *  delete sms platform
  * @params smsPlatformIdList
 */
export const $deleteSmsPlatform = (smsPlatformIdList: any) => {
	return request.delete(path+'/delete', smsPlatformIdList)
}

/**
 *  send sms
  * @params sendSms
 */
export const $sendSms = (sendSms: any) => {
	return request.post(path+'/send', sendSms)
}
