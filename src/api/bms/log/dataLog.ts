// import request
import request from '@/utils/request'

const path = '/bms/log/data_log';

export const $getDataLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getDataLogData = (dataLogId: number) => {
	return request.get(path+'/'+dataLogId+'/data')
}

export const $deleteDataLog = (dataLogIdList: any) => {
	return request.delete(path+'/delete', dataLogIdList)
}