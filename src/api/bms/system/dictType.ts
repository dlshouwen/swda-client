import request from '@/utils/request'

const path = '/bms/system/dict_type';

export const $getDictTypePageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getDictTypeData = (dictTypeId: number) => {
	return request.get(path+'/'+dictTypeId+'/data')
}

export const $addDictType = (dictType: any) => {
	return request.post(path+'/add', dictType)
}

export const $updateDictType = (dictType: any) => {
	return request.post(path+'/update', dictType)
}

export const $deleteDictType = (dictTypeIdList: any) => {
	return request.delete(path+'/delete', dictTypeIdList)
}

export const $getSqlDictList = (dictTypeId: number) => {
	return request.get(path+'/delete'+dictTypeId)
}

export const $refreshDictTransCache = () => {
	return request.get(path+'/refresh')
}