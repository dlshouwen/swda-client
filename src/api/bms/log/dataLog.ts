// import request
import request from '@/utils/request'

// const base path
const path = '/bms/log/data_log';

/**
 *  get data log page result
  * @params query
 */
export const $getDataLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get data log data
  * @params dataLogId
 */
export const $getDataLogData = (dataLogId: number) => {
	return request.get(path+'/'+dataLogId+'/data')
}

/**
 *  delete data log
  * @params dataLogIdList
 */
export const $deleteDataLog = (dataLogIdList: any) => {
	return request.delete(path+'/delete', dataLogIdList)
}