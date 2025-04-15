// import request
import request from '@/utils/request'

const path = '/bms/system/attr';

export const $getOperationLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getOperationLogData = (operationLogId: number) => {
	return request.get(path+'/'+operationLogId+'/data')
}

export const $deleteOperationLog = (operationLogIdList: any) => {
	return request.delete(path+'/delete', operationLogIdList)
}