import request from '@/utils/request'

const path = '/bms/system/organ';

export const $getOrganList = () => {
	return request.post(path+'/list')
}

export const $getOrganData = (organId: number) => {
	return request.get(path+'/data/'+organId)
}

export const $addOrgan = (organ: any) => {
	return request.post(path+'/add', organ)
}

export const $updateOrgan = (organ: any) => {
	return request.post(path+'/update', organ)
}

export const $deleteOrgan = (organIdList: any) => {
	return request.delete(path+'/delete', organIdList)
}

export const $getOrganNameList = (organIdList: any) => {
	return request.post(path+'/name/list', organIdList)
}