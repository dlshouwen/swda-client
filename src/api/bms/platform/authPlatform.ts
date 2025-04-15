// import request
import request from '@/utils/request'

// const base path
const path = '/bms/platform/auth_platform';

/**
 *  get auth platform page result
  * @params query
 */
export const $getAuthPlatformPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get auth platform data
  * @params authPlatformId
 */
export const $getAuthPlatformData = (authPlatformId: number) => {
	return request.get(path+'/'+authPlatformId+'/data')
}

/**
 *  add auth platform
  * @params authPlatform
 */
export const $addAuthPlatform = (authPlatform: any) => {
	return request.post(path+'/add', authPlatform)
}

/**
 *  update auth platform
  * @params authPlatform
 */
export const $updateAuthPlatform = (authPlatform: any) => {
	return request.post(path+'/update', authPlatform)
}

/**
 *  delete auth platform
  * @params authPlatformIdList
 */
export const $deleteAuthPlatform = (authPlatformIdList: any) => {
	return request.delete(path+'/delete', authPlatformIdList)
}