// import request
import request from '@/utils/request'

// const base path
const path = '/bms/permission/post';

/**
 *  get post page result
  * @params query
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
 *  get post data
  * @params postId
 */
export const $getPostData = (postId: number) => {
	return request.get(path+'/data/'+postId)
}

/**
 *  add post
  * @params post
 */
export const $addPost = (post: any) => {
	return request.post(path+'/add', post)
}

/**
 *  update post
  * @params post
 */
export const $updatePost = (post: any) => {
	return request.post(path+'/update', post)
}

/**
 *  delete post
  * @params postIdList
 */
export const $deletePost = (postIdList: any) => {
	return request.delete(path+'/delete', postIdList)
}

/**
 *  get post name list
  * @params postIdList
 */
export const $getPostNameList = (postIdList: any) => {
	return request.post(path+'/name/list', postIdList)
}