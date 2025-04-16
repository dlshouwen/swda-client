// import request
import request from '@/utils/request'

// const base path
const path = '/bms/system/menu';

/**
 * get login user menu list
 */
export const $getLoginUserMenuList = () => {
	return request.post(path+'/login/user/menu/list')
}

/**
 * get login user authority list
 */
export const $getLoginUserAuthorityList = () => {
	return request.post(path+'/login/user/authority/list')
}

/**
 *  get menu list
  * @param menuType
 */
export const $getMenuList = (menuType: number) => {
	return request.post(path+'/page', menuType)
}

/**
 *  get menu data
  * @param menuId
 */
export const $getMenuData = (menuId: number) => {
	return request.get(path+'/data/'+menuId)
}

/**
 *  add menu
  * @param menu
 */
export const $addMenu = (menu: any) => {
	return request.post(path+'/add', menu)
}

/**
 *  update menu
  * @param menu
 */
export const $updateMenu = (menu: any) => {
	return request.post(path+'/update', menu)
}

/**
 *  delete menu
  * @param menuIdList
 */
export const $deleteMenu = (menuIdList: any) => {
	return request.delete(path+'/delete', menuIdList)
}