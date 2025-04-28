// export
export default {
	loading: '正在加载...',
	login: {
		account: {
			title:'账户登录',
			placeholder: { username:'请输入用户名', password:'请输入密码', captcha: '请输入验证码' },
			button:'登录'
		},
		mobile: {
			title:'手机登录',
			placeholder: { mobile:'请输入手机号', captcha:'请输入校验码', code: '请输入手机验证码' },
			button:'登录'
		},
		other: { title: '其他方式登录', weixin: '微信登录', qiyeweixin: '企业微信登录', dingding: '钉钉登录', feishu: '飞书登录', }
	},
	options: {
		size:{ large: '最大', default: '默认', small: '最小' },
	},
	header: {
		operate: {
			sidebar: { open: '展开侧边栏', close: '折叠侧边栏' },
			refresh: '刷新当前页',
			system: '选择系统',
			lang: '选择语言',
			size: '选择大小',
			fullscreen: { open:'全屏', close:'取消全屏' },
			search: '搜索功能',
			profile: { userInfo: '个人信息', changePassword: '修改密码', auth: '账号绑定', logout: '退出登录' },
			setting: '更多设置',
		},
	},
	tab: { home: '首页', operate: { close: { self: '关闭', other: '关闭其他', all: '关闭所有' } } },
	
	menu: { home: '首页' },
	
	setting: { 
		title: '系统设置', 
		theme: { 
			mode: { title: '设置显示模式', label: '系统显示模式', options: { light: '明亮模式', dark: '夜间模式' } },
			primary: { title:'设置主题色' },
			layout: { title: '设置页面布局', options: { vertical: '垂直布局', horizontal: '水平布局' } },
			system: { title: '设置系统样式', label: '系统切换样式', options: { select: '选择', expand: '展开' } },
			logo: { 
				title: '设置 Logo 样式', 
				enable: { label: '显示 Logo' }, 
				style: { label: 'Logo 样式', options: { primary: '主题色', light: '亮色', dark: '暗色', } } 
			},
			sidebar:{ 
				title: '设置侧边栏样式', 
				style: { label: '侧边栏样式', options: { primary: '主题色', light: '亮色', dark: '暗色', } }, 
				unique: { label: '侧边栏排他' },
			},
			header:{ 
				title: '设置顶栏样式', 
				style: { label: '顶栏样式', options: { primary: '主题色', light: '亮色', dark: '暗色', } }, 
				breadcrumb: { label: '显示面包屑' }, 
			},
			tab: {
				title: '设置标签页样式',
				enable: { label: '启用标签页', },
				style: 	{ label: '标签页样式', options: { light: '亮色', dark: '暗色', } },
				mode: { label: '标签页模式', options: { single: '独立', series: '连续', } },
				cache: { label: '标签页缓存', }
			}
		},
		operate: { reset: '恢复默认配置' }
	},
	
	validator: {
		unique : {
			validating : '正在检查{label}是否可用...',
			success : '{label}可以使用',
			failure : '{label}已经被使用',
			error : '{label}检查使用过程中遇到错误'
		},
		validate : {
			format : '{label}必须为{format}格式',
			passwordNotEquals : '密码录入不一致，请重新录入',
			required : {
				input : '{label}不能为空',
				select : '{label}必须选择'
			},
			greatLess : {
				number : {
					greatThan : '{label}的值必须大于{min}',
					greatEqualsThan : '{label}的值必须大于等于{min}',
					lessThan : '{label}的值必须小于{max}',
					lessEqualsThan : '{label}的值必须小于等于{max}'
				},
				string : {
					greatThan : '{label}的长度必须大于{min}',
					greatEqualsThan : '{label}的长度最少为{min}',
					lessThan : '{label}的长度必须小于{max}',
					lessEqualsThan : '{label}的长度最多为{max}'
				},
				multiple : {
					greatThan : '{label}的数量请大于{min}个',
					greatEqualsThan : '{label}最少选择{min}个',
					lessThan : '{label}选择的数量请小于{max}个',
					lessEqualsThan : '{label}最多选择{max}个'
				}
			},
			card : {
				wrongLength : '{label}验证失败：身份证位数不正确',
				notCard15 : '{label}并非15位身份证',
				notCard18 : '{label}并非18位身份证',
				wrongCard15 : '{label}是错误的15位身份证格式',
				wrongCard18 : '{label}是错误的18位身份证格式'
			},
			validating : '{label}正在验证',
			success : '{label}验证成功'
		},
		alert : {
			validating : '{label}正在验证，请您稍后执行操作',
			error : '您录入的内容存在错误，请您核实。'
		},
		format : {
			email : '邮件',
			phone : '电话',
			english_number : '英文或数字',
			mobile : '手机',
			url : '链接',
			money : '金额',
			number : '数字',
			zip : '邮编',
			qq : 'QQ号',
			integer : '整数',
			double : '小数',
			english : '英文',
			chinese : '中文',
			card : '身份证',
			card15 : '15位身份证',
			card18 : '18位身份证'
		}
	},
	
	table: {
		errors: {
			data_load_error: '数据加载失败，请检查您的条件配置是否存在错误。',
			data_export_error: '数据导出失败，请检查您的条件配置是否存在错误。'
		},
		text: {
			empty: '暂无数据',
			sum: '合计',
		},
		toolbar: {
			mode: {
				list: { label: '列表模式', icon: 's-grid', title: '点击切换至分组模式' },
				group: { label: '分组模式', icon: 'menu', title: '点击切换至分组模式' },
			},
			refresh:{ label: '刷新', icon: 'sync', title: '刷新数据' },
			fast:{ label: '快速查询', icon: 'search', title: '快速查询' },
			advance:{ label: '高级查询', icon: 'filter', title: '高级查询' },
			'export':{ label: '导出', icon: 'upload', title: '导出' },
			print: { label: '打印', icon: 'printer', title: '打印' }
		},
		fast: {
			title: { icon: 'search', text: '快速查询' },
			all: '全部',
			to: '至',
			buttons: {
				reset: { icon: 'undo', text: '重置' },
				query: { icon: 'check', text: '查询' },
			}
		},
		advance: {
			title: { icon: 'filter', text: '高级查询' },
			list: {
				title: { icon: 'list', text: '查询方案' },
			},
			main: {
				title: { icon: 'document', text: '方案信息' },
				name: { text:'方案名称', placeholder:'请输入方案名称' },
				remark: { text:'备注', placeholder:'请输入备注信息' },
				buttons: {
					add: { icon: 'plus', text: '新增' },
					update: { icon: 'edit', text: '编辑' },
					copy: { icon: 'document-copy', text: '复制' },
					delete: { icon: 'delete', text: '删除' },
					sure: { icon: 'check', text: '确认' },
				},
				message: {
					add: { title: '警告', content: '确定新增查询方案吗？' },
					update: { title: '警告', content: '确定编辑查询方案吗？', nothing: '您未选择查询方案，无法执行编辑操作。' },
					copy: { title: '警告', content: '确定复制查询方案吗？', nothing: '您未选择查询方案，无法执行复制操作。'  },
					delete: { title: '警告', content: '确定删除查询方案吗？', nothing: '您未选择查询方案，无法执行删除操作。' },
				}
			},
			condition: {
				title: { icon: 'search', text: '条件配置' },
				column: {
					sequence: '序号',
					operation: '操作',
					leftParentheses: '左括号',
					field: '项目',
					condition: '条件',
					value: '值',
					rightParentheses: '右括号',
					logic: '逻辑',
					buttons: {
						up: { icon: 'top', title: '条件上移' },
						down: { icon: 'bottom', title: '条件下移' },
						delete: { icon: 'delete', title: '删除条件（无法恢复）' },
					}
				},
				buttons: {
					insert: { icon: 'plus', text: '新增一行' },
					clear: { icon: 'delete', text: '清空条件' },
				},
				message: {
					clear: { title: '警告', content: '确定清空所有过滤条件吗？清空后将无法还原。' }
				},
				errors: {
					left_parentheses_error: '只能填写左括号',
					right_parentheses_error: '只能填写右括号',
				}
			},
			sort: {
				title: { icon: 'sort-asc', text: '排序配置' },
				column: {
					sequence: '序号',
					operation: '操作',
					field: '项目',
					logic: '逻辑',
					buttons: {
						up: { icon: 'top', title: '排序上移' },
						down: { icon: 'bottom', title: '排序下移' },
						delete: { icon: 'delete', title: '删除排序（无法恢复）' },
					}
				},
				buttons: {
					insert: { icon: 'plus', text: '新增一行' },
					clear: { icon: 'delete', text: '清空排序' },
				},
				message: {
					clear: { title: '警告', content: '确定清空所有排序条件吗？清空后将无法还原。' }
				}
			}
		},
		print: {
			title: { icon: 'printer', text: '打印' },
			column: {
				sequence: '序号',
				field: '项目',
				operation: '操作',
				buttons: {
					up: { icon: 'top', title: '上移' },
					down: { icon: 'bottom', title: '下移' },
				}
			},
			buttons: {
				print: { icon: 'printer', text: '打印' },
			}
		},
		'export': {
			title: { icon: 'upload', text: '导出' },
			type: { excel: 'Excel', csv: 'Csv', pdf: 'Pdf', txt: 'Txt'},
			data: { current: '当前数据', all: '全部数据' },
			column: {
				sequence: '序号',
				field: '项目',
				operation: '操作',
				buttons: {
					up: { icon: 'top', title: '上移' },
					down: { icon: 'bottom', title: '下移' },
				}
			},
			buttons: {
				'export': { icon: 'upload', text: '导出' },
			}
		}
	},
	
	operation: {
		add: '新增',
		edit: '编辑',
	}
	
}
