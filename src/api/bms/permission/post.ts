// import request
import request from '@/utils/request'

// const base path
const path = '/bms/permission/post';

/**
 * get post page result
 * @param query
 */
export const $getPostPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 * get post list
 */
export const $getPostList = () => {
	return request.post(path+'/list')
}

/**
 * get post data
 * @param postId
 */
export const $getPostData = (postId: number) => {
	return request.get(path+'/data/'+postId)
}

/**
 * add post
 * @param post
 */
export const $addPost = (post: any) => {
	return request.post(path+'/add', post)
}

/**
 * update post
 * @param post
 */
export const $updatePost = (post: any) => {
	return request.post(path+'/update', post)
}

/**
 * delete post
 * @param postIdList
 */
export const $deletePost = (postIdList: any) => {
	return request.delete(path+'/delete', postIdList)
}

/**
 * get post name list
 * @param postIdList
 */
export const $getPostNameList = (postIdList: any) => {
	return request.post(path+'/name/list', postIdList)
}