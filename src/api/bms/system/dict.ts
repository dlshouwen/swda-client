import request from '@/utils/request'

const path = '/bms/system/dict';

export const $getDictPageResult = (dictType: string, query: any) => {
	return request.post(path+'/page/'+dictType, query)
}

export const $getDictData = (dictId: number) => {
	return request.get(path+'/'+dictId+'/data')
}

export const $addDict = (dict: any) => {
	return request.post(path+'/add', dict)
}

export const $updateDict = (dict: any) => {
	return request.post(path+'/update', dict)
}

export const $deleteDict = (dictIdList: any) => {
	return request.delete(path+'/delete', dictIdList)
}