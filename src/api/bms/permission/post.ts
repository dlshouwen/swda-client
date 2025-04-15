// import request
import request from '@/utils/request'

const path = '/bms/system/post';

export const $getPostPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

export const $getPostList = () => {
	return request.post(path+'/list')
}

export const $getPostData = (postId: number) => {
	return request.get(path+'/data/'+postId)
}

export const $addPost = (post: any) => {
	return request.post(path+'/add', post)
}

export const $updatePost = (post: any) => {
	return request.post(path+'/update', post)
}

export const $deletePost = (postIdList: any) => {
	return request.delete(path+'/delete', postIdList)
}

export const $getPostNameList = (postIdList: any) => {
	return request.post(path+'/name/list', postIdList)
}