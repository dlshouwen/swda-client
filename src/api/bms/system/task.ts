// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/task';

/**
 * get task page result
 * @param query
 */
export const $getTaskPageResult = (query: any) => {
	return request.post(path+'/page', query)
}

/**
 * get task data
 * @param taskId
 */
export const $getTaskData = (taskId: number) => {
	return request.get(path+'/'+taskId+'/data')
}

/**
 * add task
 * @param task
 */
export const $addTask = (task: any) => {
	return request.post(path+'/add', task)
}

/**
 * update task
 * @param task
 */
export const $updateTask = (task: any) => {
	return request.post(path+'/update', task)
}

/**
 * open task
 * @param taskIdList
 */
export const $openTask = (taskIdList: any) => {
	return request.post(path+'/open', taskIdList)
}

/**
 * pause task
 * @param taskIdList
 */
export const $pauseTask = (taskIdList: any) => {
	return request.post(path+'/pause', taskIdList)
}

/**
 * execute task
 * @param taskIdList
 */
export const $executeTask = (taskIdList: any) => {
	return request.post(path+'/execute', taskIdList)
}

/**
 * delete task
 * @param taskIdList
 */
export const $deleteTask = (taskIdList: any) => {
	return request.post(path+'/delete', taskIdList)
}
