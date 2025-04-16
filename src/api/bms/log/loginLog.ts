// import request
import request from '@/utils/request'

// const base path
const path = '/bms/log/login_log';

/**
 *  get login log page result
  * @param query
 */
export const $getLoginLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get login log data
  * @param loginLogId
 */
export const $getLoginLogData = (loginLogId: number) => {
	return request.get(path+'/'+loginLogId+'/data')
}

/**
 *  delete login log
  * @param loginLogIdList
 */
export const $deleteLoginLog = (loginLogIdList: any) => {
	return request.delete(path+'/delete', loginLogIdList)
}