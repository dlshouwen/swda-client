// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/attr';

/**
 *  get operation log page result
  * @param query
 */
export const $getOperationLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get operation log data
  * @param operationLogId
 */
export const $getOperationLogData = (operationLogId: number) => {
	return request.get(path+'/'+operationLogId+'/data')
}

/**
 *  delete operation log
  * @param operationLogIdList
 */
export const $deleteOperationLog = (operationLogIdList: any) => {
	return request.post(path+'/delete', operationLogIdList)
}