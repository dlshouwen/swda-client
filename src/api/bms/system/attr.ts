// import request
import request from '@/utils/request'

const path = '/bms/system/attr';

export const $getAttrList = () => {
	return request.post(path+'/list')
}

export const $saveAttrList = (attrList: any) => {
	return request.post(path+'/save', attrList)
}