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
		
		theme: {
			
			mode: {
				
				title: '设置显示模式',
				
				label: '系统显示模式',

				options: {
					
					light: '明亮模式',
					dark: '夜间模式'
					
				}
				
			},
			
			primary: {
				
				title:'设置主题色'
				
			},

			layout: {
				
				title: '设置页面布局',
				
				options: {
					
					vertical: '垂直布局',
					horizontal: '水平布局'
					
				}
				
			},
			
			system: {
				
				title: '设置系统样式',
				
				label: '系统切换样式',
				
				options: {
					
					select: '选择',
					expand: '展开'
					
				}
				
			},
			
			logo: {
				
				title: '设置 Logo 样式',
				
				enable: {
					
					label: '显示 Logo'
					
				},
				style: {
					
					label: 'Logo 样式',
					
					options: {
						
						primary: '主题色',
						light: '亮色',
						dark: '暗色',
						
					}
					
				}
			
			},
			
			sidebar:{
			
				title: '设置侧边栏样式',
				style: {
					
					label: '侧边栏样式',
					
					options: {
						
						primary: '主题色',
						light: '亮色',
						dark: '暗色',
						
					}
					
				},
				unique: {
					
					label: '侧边栏排他'
					
				},
			
			},
			
			header:{
				
				title: '设置顶栏样式',
			
				style: {
					
					label: '顶栏样式',
					
					options: {
						
						primary: '主题色',
						light: '亮色',
						dark: '暗色',
						
					}
					
				},
				breadcrumb: {
					
					label: '显示面包屑'
					
				},
			
			},
			
			tab: {
				
				title: '设置标签页样式',
				enable: {
					
					label: '启用标签页',
					
				},
				style: 	{
					
					label: '标签页样式',
					
					options: {
						
						light: '亮色',
						dark: '暗色',
						
					}
					
				},
				mode: 	{
					
					label: '标签页模式',
					
					options: {
						
						single: '独立',
						series: '连续',
						
					}
					
				},
				cache: {
					
					label: '标签页缓存',
					
				}
				
			}
			
		},
		
		operate: {
			
			reset: '恢复默认配置'
			
		}
		
	},
	
	valid: {
		required: '必须填写',
	},
	
	operation: {
		add: '新增',
		edit: '编辑',
	}
	
}
