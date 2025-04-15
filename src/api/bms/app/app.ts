// import request
import request from '@/utils/request'

export const $getAttrData = () => {
	return request.get('/app/attr')
}

export const $getDictData = () => {
	return request.get('/app/dict')
}