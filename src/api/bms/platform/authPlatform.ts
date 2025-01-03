import request from '@/utils/request'

const path = '/bms/platform/auth_platform';

export const $getAuthPlatformPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getAuthPlatformData = (authPlatformId: number) => {
	return request.get(path+'/'+authPlatformId+'/data')
}

export const $addAuthPlatform = (authPlatform: any) => {
	return request.post(path+'/add', authPlatform)
}

export const $updateAuthPlatform = (authPlatform: any) => {
	return request.post(path+'/update', authPlatform)
}

export const $deleteAuthPlatform = (authPlatformIdList: any) => {
	return request.delete(path+'/delete', authPlatformIdList)
}