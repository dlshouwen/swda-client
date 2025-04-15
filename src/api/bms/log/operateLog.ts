// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/attr';

/**
 *  get operation log page result
  * @params query
 */
export const $getOperationLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get operation log data
  * @params operationLogId
 */
export const $getOperationLogData = (operationLogId: number) => {
	return request.get(path+'/'+operationLogId+'/data')
}

/**
 *  delete operation log
  * @params operationLogIdList
 */
export const $deleteOperationLog = (operationLogIdList: any) => {
	return request.delete(path+'/delete', operationLogIdList)
}