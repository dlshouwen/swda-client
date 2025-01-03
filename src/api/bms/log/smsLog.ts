import request from '@/utils/request'

const path = '/bms/system/attr';

export const $getSmsLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getSmsLogData = (smsLogId: number) => {
	return request.get(path+'/'+smsLogId+'/data')
}

export const $deleteSmsLog = (smsLogIdList: any) => {
	return request.delete(path+'/delete', smsLogIdList)
}