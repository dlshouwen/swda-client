// import request
import request from '@/utils/request'

// const base path
const path = '/bms/platform/email_platform';

/**
 * get email platform page result
 * @param query
 */
export const $getEmailPlatformPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 * get email platform list
 * @param emailPlatformType
 */
export const $getEmailPlatformList = (emailPlatformType: number) => {
	return request.post(path+'/list', emailPlatformType)
}

/**
 * get email platform data
 * @param emailPlatformId
 */
export const $getEmailPlatformData = (emailPlatformId: number) => {
	return request.get(path+'/'+emailPlatformId+'/data')
}

/**
 * add email platform
 * @param emailPlatform
 */
export const $addEmailPlatform = (emailPlatform: any) => {
	return request.post(path+'/add', emailPlatform)
}

/**
 * update email platform
 * @param emailPlatform
 */
export const $updateEmailPlatform = (emailPlatform: any) => {
	return request.post(path+'/update', emailPlatform)
}

/**
 * delete email platform
 * @param emailPlatformIdList
 */
export const $deleteEmailPlatform = (emailPlatformIdList: any) => {
	return request.delete(path+'/delete', emailPlatformIdList)
}

/**
 * send email
 * @param emailSend
 */
export const $sendEmail = (emailSend: any) => {
	return request.post(path+'/send', emailSend)
}