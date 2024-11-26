/** base url */
const baseURL = window._BASE_URL_;

/** message */
const message = {
	error: {
		server_error:'数据服务器未能链接成功。',
		get_permission_info_error:'权限信息获取失败。',
		token_timeout:'授权超时，请重新登录。',
		token_error:'授权信息不正确，请重新登录。',
		get_layout_data_error:'获取用户数据失败，请稍后重试。',
		login_error:'登录出现错误，请稍后重试。',
		logout_error:'登出出现错误，请稍后重试。',
		forbidden_error:'您无权访问此内容。',
	}
};

/**
 * export data
 */
export {
	baseURL,
	message
};