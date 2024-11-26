/**
 * lang
 */
export const zh_cn = {
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
		refresh:{ label: '刷新', icon: 'refresh', title: '刷新数据' },
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
			reset: { icon: 'refresh-left', text: '重置' },
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
			title: { icon: 'sort', text: '排序配置' },
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
}