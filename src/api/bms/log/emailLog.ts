// import request
import request from '@/utils/request'

// const base path
const path = '/bms/log/email_log';

/**
 *  get email log page result
  * @param query
 */
export const $getEmailLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get email log data
  * @param emailLogId
 */
export const $getEmailLogData = (emailLogId: number) => {
	return request.get(path+'/'+emailLogId+'/data')
}

/**
 *  delete email log
  * @param emailLogIdList
 */
export const $deleteEmailLog = (emailLogIdList: any) => {
	return request.post(path+'/delete', emailLogIdList)
}