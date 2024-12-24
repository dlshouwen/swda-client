import request from '@/utils/request'

export const useAccountLoginApi = (data: any) => {
	return request.post('/')
}