// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/attr';

/**
 *  get sms log page result
  * @params query
 */
export const $getSmsLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 *  get sms log data
  * @params smsLogId
 */
export const $getSmsLogData = (smsLogId: number) => {
	return request.get(path+'/'+smsLogId+'/data')
}

/**
 *  delete sms log
  * @params smsLogIdList
 */
export const $deleteSmsLog = (smsLogIdList: any) => {
	return request.delete(path+'/delete', smsLogIdList)
}