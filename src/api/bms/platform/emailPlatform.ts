// import request
import request from '@/utils/request'

const path = '/bms/platform/email_platform';

export const $getEmailPlatformPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getEmailPlatformList = (emailPlatformType: number) => {
	return request.post(path+'/list', emailPlatformType)
}

export const $getEmailPlatformData = (emailPlatformId: number) => {
	return request.get(path+'/'+emailPlatformId+'/data')
}

export const $addEmailPlatform = (emailPlatform: any) => {
	return request.post(path+'/add', emailPlatform)
}

export const $updateEmailPlatform = (emailPlatform: any) => {
	return request.post(path+'/update', emailPlatform)
}

export const $deleteEmailPlatform = (emailPlatformIdList: any) => {
	return request.delete(path+'/delete', emailPlatformIdList)
}

export const $sendEmail = (emailSend: any) => {
	return request.post(path+'/send', emailSend)
}