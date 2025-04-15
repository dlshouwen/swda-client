// import request
import request from '@/utils/request'

const path = '/bms/system/system';

export const $getLoginUserSystemList = () => {
	return request.post(path+'/login/user/system/list')
}

export const $getSystemPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getSystemData = (systemId: number) => {
	return request.get(path+'/data/'+systemId)
}

export const $addSystem = (system: any) => {
	return request.post(path+'/add', system)
}

export const $updateSystem = (system: any) => {
	return request.post(path+'/update', system)
}

export const $deleteSystem = (systemIdList: any) => {
	return request.delete(path+'/delete', systemIdList)
}
