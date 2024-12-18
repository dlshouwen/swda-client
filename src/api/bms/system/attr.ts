import request from '@/utils/request'

const path = '/bms/system/attr';

export const getAllAttrData = () => {
	return request.get(path+'/data/all')
}