// import request
import request from '@/utils/request'

// const base path
const path = '/bms/log/data_log';

/**
 *  get data log page result
  * @param query
 */
export const $getDataLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get data log data
  * @param dataLogId
 */
export const $getDataLogData = (dataLogId: number) => {
	return request.get(path+'/'+dataLogId+'/data')
}

/**
 *  delete data log
  * @param dataLogIdList
 */
export const $deleteDataLog = (dataLogIdList: any) => {
	return request.post(path+'/delete', dataLogIdList)
}