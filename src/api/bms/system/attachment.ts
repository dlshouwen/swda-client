import request from '@/utils/request'

const path = '/bms/system/attachment';

export const $getAttachmentPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getAttachmentData = (attachmentId: number) => {
	return request.get(path+'/'+attachmentId+'/data')
}

export const $addAttachment = (attachment: any) => {
	return request.post(path+'/add', attachment)
}

export const $updateAttachment = (attachment: any) => {
	return request.post(path+'/update', attachment)
}

export const $deleteAttachment = (attachmentIdList: any) => {
	return request.delete(path+'/delete', attachmentIdList)
}