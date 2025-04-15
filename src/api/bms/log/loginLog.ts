// import request
import request from '@/utils/request'

const path = '/bms/log/login_log';

export const $getLoginLogPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getLoginLogData = (loginLogId: number) => {
	return request.get(path+'/'+loginLogId+'/data')
}

export const $deleteLoginLog = (loginLogIdList: any) => {
	return request.delete(path+'/delete', loginLogIdList)
}