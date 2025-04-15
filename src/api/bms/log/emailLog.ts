// import request
import request from '@/utils/request'

// const base path
const path = '/bms/log/email_log';

/**
 *  get email log page result
  * @params query
 */
export const $getEmailLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get email log data
  * @params emailLogId
 */
export const $getEmailLogData = (emailLogId: number) => {
	return request.get(path+'/'+emailLogId+'/data')
}

/**
 *  delete email log
  * @params emailLogIdList
 */
export const $deleteEmailLog = (emailLogIdList: any) => {
	return request.delete(path+'/delete', emailLogIdList)
}