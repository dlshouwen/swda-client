// export
export default {
	
	loading: '正在加载...',
	
	login: {
		account: {
			title:'账户登录',
			placeholder: {
				username:'请输入用户名',
				password:'请输入密码',
				captcha: '请输入验证码'
			},
			button:'登录'
		},
		mobile: {
			title:'手机登录',
			placeholder: {
				mobile:'请输入手机号',
				captcha:'请输入校验码',
				code: '请输入手机验证码'
			},
			button:'登录'
		},
		other: {
			title: '其他方式登录',
			weixin: '微信登录',
			qiyeweixin: '企业微信登录',
			dingding: '钉钉登录',
			feishu: '飞书登录',
		}
	},
	
	options: {

		size:{
			
			large: '最大',
			default: '默认',
			small: '最小'
			
		},
		
		theme:{
			
			system: {
				select:'选择模式',
				merge:'合并显示'
			},
			style: {
				light:'明亮模式',
				dark:'深色模式'
			},
			
		}
		
	},
	
	header: {
		
		operate: {
			
			sidebar: {
				open: '展开侧边栏',
				close: '折叠侧边栏'
			},
			refresh: '刷新当前页',
			system: '选择系统',
			lang: '选择语言',
			size: '选择大小',
			fullscreen: {
				open:'全屏',
				close:'取消全屏'
			},
			search: '搜索功能',
			profile: {
				userInfo: '个人信息',
				changePassword: '修改密码',
				auth: '账号绑定',
				logout: '退出登录'
			},
			setting: '更多设置',
			
		},
		
	},
	
	tab: {
		
		home: '首页',
		
		operate: {

			close: {
				self: '关闭',
				other: '关闭其他',
				all: '关闭所有'
			}
			
		}
		
	},
	
	menu: {
		
		home: '首页'
		
	},
	
	setting: {
		
		title: '系统设置',
		color: '设置主题色',
		style: '设置样式',
		
		theme: {
			
			system: '系统切换样式',
			style: '设置主题',
			logo: '显示LOGO',
			breadcrumb: '显示面包屑',
			sidebar: {
				unique: '侧边栏排他'
			},
			tab: {
				enable: '显示标签页',
				style: '标签页样式',
				cache: '标签页缓存',
			}
			
		},
		
		operate: '操作',
		
		reset: '重置所有选项'
		
	},
	
	valid: {
		required: '必须填写',
	},
	
	operation: {
		add: '新增',
		edit: '编辑',
	}
	
}
