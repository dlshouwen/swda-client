// import request
import request from '@/utils/request'

const path = '/bms/log/email_log';

export const $getEmailLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getEmailLogData = (emailLogId: number) => {
	return request.get(path+'/'+emailLogId+'/data')
}

export const $deleteEmailLog = (emailLogIdList: any) => {
	return request.delete(path+'/delete', emailLogIdList)
}