/**
 * import request
 */
import { request } from '@/assets/utils/request'

/** data */
export const $getData = () => request({url:'/core/data', method:'post'});

/** export */
export const $exportExcel = params => request({url:'/core/export', method:'post', data:params});

/** unique */
export const $unique = params => request({url:'/core/unique', method:'post', data:params});

/** task */
export const $getTaskMessageList = params => request({url:'/core/task/list', method:'post', data:params});
export const $getTaskMessageData = params => request({url:'/core/task/data', method:'post', data:params});

/** login */
export const $login = params => request({url:'/core/login', method:'post', data:params});
export const $logout = params => request({url:'/core/logout', method:'post', data:params});

/** layout */
export const $getLayoutData = params => request({url:'/core/layout/data', method:'post', data:params});

/** home */
export const $getHomeData = params => request({url:'/core/home/data', method:'post', data:params});

/** assist */
export const $getAssistData = params => request({url:'/core/assist/data', method:'post', data:params});
export const $setUser = params => request({url:'/core/assist/set_user', method:'post', data:params});
export const $changePassword = params => request({url:'/core/assist/change_password', method:'post', params:params});
export const $setShortcut = params => request({url:'/core/assist/set_shortcut', method:'post', params:params});

/** attr */
export const $getAttrList = params => request({url:'/bms/system/attr/list', method:'post', data:params});
export const $saveAttr = params => request({url:'/bms/system/attr/save', method:'post', data:params});

/** dict category */
export const $getDictCategoryList = params => request({url:'/bms/system/dict_category/list', method:'post', data:params});
export const $getDictCategoryData = params => request({url:'/bms/system/dict_category/data', method:'post', params:params});
export const $addDictCategory = params => request({url:'/bms/system/dict_category/add', method:'post', data:params});
export const $updateDictCategory = params => request({url:'/bms/system/dict_category/update', method:'post', data:params});
export const $deleteDictCategory = params => request({url:'/bms/system/dict_category/delete', method:'post', params:params});

/** dict */
export const $getDictList = params => request({url:'/bms/system/dict/list', method:'post', data:params});
export const $getDictData = params => request({url:'/bms/system/dict/data', method:'post', params:params});
export const $addDict = params => request({url:'/bms/system/dict/add', method:'post', data:params});
export const $updateDict = params => request({url:'/bms/system/dict/update', method:'post', data:params});
export const $deleteDict = params => request({url:'/bms/system/dict/delete', method:'post', params:params});

/** region */
export const $getRegionList = params => request({url:'/bms/system/region/list', method:'post', data:params});
export const $getRegionCascaderList = params => request({url:'/bms/system/region/cascader/list', method:'post', data:params});
export const $getRegionData = params => request({url:'/bms/system/region/data', method:'post', params:params});
export const $addRegion = params => request({url:'/bms/system/region/add', method:'post', data:params});
export const $updateRegion = params => request({url:'/bms/system/region/update', method:'post', data:params});
export const $deleteRegion = params => request({url:'/bms/system/region/delete', method:'post', params:params});

/** town */
export const $getTownList = params => request({url:'/bms/system/town/list', method:'post', data:params});
export const $getTownData = params => request({url:'/bms/system/town/data', method:'post', params:params});
export const $addTown = params => request({url:'/bms/system/town/add', method:'post', data:params});
export const $updateTown = params => request({url:'/bms/system/town/update', method:'post', data:params});
export const $deleteTown = params => request({url:'/bms/system/town/delete', method:'post', params:params});

/** task */
export const $getTaskList = params => request({url:'/bms/system/task/list', method:'post', data:params});
export const $getTaskData = params => request({url:'/bms/system/task/data', method:'post', params:params});
export const $addTask = params => request({url:'/bms/system/task/add', method:'post', data:params});
export const $updateTask = params => request({url:'/bms/system/task/update', method:'post', data:params});
export const $deleteTask = params => request({url:'/bms/system/task/delete', method:'post', params:params});
export const $startTask = params => request({url:'/bms/system/task/start', method:'post', params:params});
export const $stopTask = params => request({url:'/bms/system/task/stop', method:'post', params:params});
export const $getTaskRoleList = params => request({url:'/bms/system/task/role/list', method:'post', data:params});
export const $getTaskUserList = params => request({url:'/bms/system/task/user/list', method:'post', data:params});

/** system */
export const $getSystemList = params => request({url:'/bms/system/system/list', method:'post', data:params});
export const $getSystemSelectList = params => request({url:'/bms/system/system/select/list', method:'post', data:params});
export const $getSystemData = params => request({url:'/bms/system/system/data', method:'post', params:params});
export const $addSystem = params => request({url:'/bms/system/system/add', method:'post', data:params});
export const $updateSystem = params => request({url:'/bms/system/system/update', method:'post', data:params});
export const $deleteSystem = params => request({url:'/bms/system/system/delete', method:'post', params:params});

/** permission */
export const $getPermissionList = params => request({url:'/bms/system/permission/list', method:'post', data:params});
export const $getPermissionCascaderList = params => request({url:'/bms/system/permission/cascader/list', method:'post', params:params});
export const $getPermissionTreeList = params => request({url:'/bms/system/permission/tree/list', method:'post', params:params});
export const $getPermissionData = params => request({url:'/bms/system/permission/data', method:'post', params:params});
export const $addPermission = params => request({url:'/bms/system/permission/add', method:'post', data:params});
export const $updatePermission = params => request({url:'/bms/system/permission/update', method:'post', data:params});
export const $deletePermission = params => request({url:'/bms/system/permission/delete', method:'post', params:params});

/** organ */
export const $getOrganList = params => request({url:'/bms/system/organ/list', method:'post', data:params});
export const $getOrganData = params => request({url:'/bms/system/organ/data', method:'post', params:params});
export const $addOrgan = params => request({url:'/bms/system/organ/add', method:'post', data:params});
export const $updateOrgan = params => request({url:'/bms/system/organ/update', method:'post', data:params});
export const $deleteOrgan = params => request({url:'/bms/system/organ/delete', method:'post', params:params});
export const $getSelectOrganList = params => request({url:'/bms/system/organ/select/list', method:'post', params:params});

/** user */
export const $getUserList = params => request({url:'/bms/system/user/list', method:'post', data:params});
export const $getUserData = params => request({url:'/bms/system/user/data', method:'post', params:params});
export const $addUser = params => request({url:'/bms/system/user/add', method:'post', data:params});
export const $updateUser = params => request({url:'/bms/system/user/update', method:'post', data:params});
export const $deleteUser = params => request({url:'/bms/system/user/delete', method:'post', params:params});
export const $resetPassword = params => request({url:'/bms/system/user/reset_password', method:'post', params:params});
export const $getUserSystemList = params => request({url:'/bms/system/user/set_system/list', method:'post', data:params});
export const $setUserSystem = params => request({url:'/bms/system/user/set_system', method:'post', params:params});
export const $getUserRoleList = params => request({url:'/bms/system/user/set_role/list', method:'post', data:params});
export const $setUserRole = params => request({url:'/bms/system/user/set_role', method:'post', params:params});

/** role */
export const $getRoleList = params => request({url:'/bms/system/role/list', method:'post', data:params});
export const $getRoleData = params => request({url:'/bms/system/role/data', method:'post', params:params});
export const $addRole = params => request({url:'/bms/system/role/add', method:'post', data:params});
export const $updateRole = params => request({url:'/bms/system/role/update', method:'post', data:params});
export const $deleteRole = params => request({url:'/bms/system/role/delete', method:'post', params:params});
export const $getRolePermissionList = params => request({url:'/bms/system/role/set_permission/list', method:'post', params:params});
export const $setRolePermission = params => request({url:'/bms/system/role/set_permission', method:'post', params:params});
export const $setRoleUserList = params => request({url:'/bms/system/role/set_user/list', method:'post', params:params});
export const $setRoleUser = params => request({url:'/bms/system/role/set_user', method:'post', params:params});

/** login log */
export const $getLoginLogList = params => request({url:'/bms/log/login_log/list', method:'post', data:params});
export const $getLoginLogChartData = params => request({url:'/bms/log/login_log/chart/data', method:'post', data:params});
export const $getLoginLogData = params => request({url:'/bms/log/login_log/data', method:'post', params:params});
export const $clearLoginLog = params => request({url:'/bms/log/login_log/clear', method:'post', data:params});

/** operation log */
export const $getOperationLogList = params => request({url:'/bms/log/operation_log/list', method:'post', data:params});
export const $getOperationLogChartData = params => request({url:'/bms/log/operation_log/chart/data', method:'post', data:params});
export const $getOperationLogData = params => request({url:'/bms/log/operation_log/data', method:'post', params:params});
export const $clearOperationLog = params => request({url:'/bms/log/operation_log/clear', method:'post', data:params});

/** data log */
export const $getDataLogList = params => request({url:'/bms/log/data_log/list', method:'post', data:params});
export const $getDataLogChartData = params => request({url:'/bms/log/data_log/chart/data', method:'post', data:params});
export const $getDataLogData = params => request({url:'/bms/log/data_log/data', method:'post', params:params});
export const $clearDataLog = params => request({url:'/bms/log/data_log/clear', method:'post', data:params});