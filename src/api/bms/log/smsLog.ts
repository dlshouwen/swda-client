// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/attr';

/**
 *  get sms log page result
  * @param query
 */
export const $getSmsLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get sms log data
  * @param smsLogId
 */
export const $getSmsLogData = (smsLogId: number) => {
	return request.get(path+'/'+smsLogId+'/data')
}

/**
 *  delete sms log
  * @param smsLogIdList
 */
export const $deleteSmsLog = (smsLogIdList: any) => {
	return request.post(path+'/delete', smsLogIdList)
}