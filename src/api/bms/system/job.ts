// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/job';

/**
 * get job data
 * @param jobId
 */
export const $getJobData = (jobId: number) => {
	return request.get(path+'/'+jobId+'/data')
}

/**
 * add job
 * @param job
 */
export const $addJob = (job: any) => {
	return request.post(path+'/add', job)
}

/**
 * update job
 * @param job
 */
export const $updateJob = (job: any) => {
	return request.post(path+'/update', job)
}

/**
 * delete job
 * @param jobIdList
 */
export const $deleteJob = (jobIdList: any) => {
	return request.post(path+'/delete', jobIdList)
}

/**
 * pause job
 * @param jobIdList
 */
export const $pauseJob = (jobIdList: any) => {
	return request.post(path+'/pause', jobIdList)
}

/**
 * resume job
 * @param jobIdList
 */
export const $resumeJob = (jobIdList: any) => {
	return request.post(path+'/resume', jobIdList)
}

/**
 * run job
 * @param jobIdList
 */
export const $runJob = (jobIdList: any) => {
	return request.post(path+'/run', jobIdList)
}
