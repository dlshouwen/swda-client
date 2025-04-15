// import request
import request from '@/utils/request'

/**
 * get attr data
 */
export const $getAttrData = () => {
	return request.get('/app/attr')
}

/**
 * get dict data
 */
export const $getDictData = () => {
	return request.get('/app/dict')
}