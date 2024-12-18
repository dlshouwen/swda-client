import request from '@/utils/request'

const path = '/bms/system/dict';

export const getAllDictData = () => {
	return request.get(path+'/data/all')
}