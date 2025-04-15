// import request
import request from '@/utils/request'

const path = '/bms/platform/sms_platform';

export const $getSmsPlatformPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getSmsPlatformList = (smsPlatformType: number) => {
	return request.post(path+'/list', smsPlatformType)
}

export const $getSmsPlatformData = (smsPlatformId: number) => {
	return request.get(path+'/'+smsPlatformId+'/data')
}

export const $addSmsPlatform = (smsPlatform: any) => {
	return request.post(path+'/add', smsPlatform)
}

export const $updateSmsPlatform = (smsPlatform: any) => {
	return request.post(path+'/update', smsPlatform)
}

export const $deleteSmsPlatform = (smsPlatformIdList: any) => {
	return request.delete(path+'/delete', smsPlatformIdList)
}

export const $sendSms = (sendSms: any) => {
	return request.post(path+'/send', sendSms)
}
