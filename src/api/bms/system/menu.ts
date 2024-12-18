import request from '@/utils/request'

const path = '/bms/system/menu';

export const getMenuNav = () => {
	return request.get(path+'/nav')
}