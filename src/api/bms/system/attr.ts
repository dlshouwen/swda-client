// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/attr';

/**
 * get attr list
 */
export const $getAttrList = () => {
	return request.post(path+'/list')
}

/**
 * save attr list
 */
export const $saveAttrList = (attrList: any) => {
	return request.post(path+'/save', attrList)
}