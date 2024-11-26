/**
 * lang
 */
export const zh_tw = {
	errors: {
		data_load_error: '數據加載失敗，請檢查您的條件配置是否存在錯誤。',
		data_export_error: '數據導出失敗，請檢查您的條件配置是否存在錯誤。'
	},
	text: {
		empty: '暫無數據',
		sum: '合計',
	},
	toolbar: {
		mode: {
			list: { label: '列表模式', icon: 's-grid', title: '點擊切換至分組模式' },
			group: { label: '分組模式', icon: 'menu', title: '點擊切換至分組模式' },
		},
		refresh:{ label: '刷新', icon: 'refresh', title: '刷新數據' },
		fast:{ label: '快速查詢', icon: 'search', title: '快速查詢' },
		advance:{ label: '高級查詢', icon: 'filter', title: '高級查詢' },
		'export':{ label: '導出', icon: 'upload', title: '導出' },
		print: { label: '打印', icon: 'printer', title: '打印' }
	},
	fast: {
		title: { icon: 'search', text: '快速查詢' },
		all: '全部',
		to: '至',
		buttons: {
			reset: { icon: 'refresh-left', text: '重置' },
			query: { icon: 'check', text: '查詢' },
		}
	},
	advance: {
		title: { icon: 'filter', text: '高級查詢' },
		list: {
			title: { icon: 'list', text: '查詢方案' },
		},
		main: {
			title: { icon: 'document', text: '方案信息' },
			name: { text:'方案名稱', placeholder:'請輸入方案名稱' },
			remark: { text:'備註', placeholder:'請輸入備註信息' },
			buttons: {
				add: { icon: 'plus', text: '新增' },
				update: { icon: 'edit', text: '編輯' },
				copy: { icon: 'document-copy', text: '復製' },
				delete: { icon: 'delete', text: '刪除' },
				sure: { icon: 'check', text: '確認' },
			},
			message: {
				add: { title: '警告', content: '確定新增查詢方案嗎？' },
				update: { title: '警告', content: '確定編輯查詢方案嗎？', nothing: '您未選擇查詢方案，無法執行編輯操作。' },
				copy: { title: '警告', content: '確定復製查詢方案嗎？', nothing: '您未選擇查詢方案，無法執行復製操作。'  },
				delete: { title: '警告', content: '確定刪除查詢方案嗎？', nothing: '您未選擇查詢方案，無法執行刪除操作。' },
			}
		},
		condition: {
			title: { icon: 'search', text: '條件配置' },
			column: {
				sequence: '序號',
				operation: '操作',
				leftParentheses: '左括號',
				field: '項目',
				condition: '條件',
				value: '值',
				rightParentheses: '右括號',
				logic: '邏輯',
				buttons: {
					up: { icon: 'top', title: '條件上移' },
					down: { icon: 'bottom', title: '條件下移' },
					delete: { icon: 'delete', title: '刪除條件（無法恢復）' },
				}
			},
			buttons: {
				insert: { icon: 'plus', text: '新增一行' },
				clear: { icon: 'delete', text: '清空條件' },
			},
			message: {
				clear: { title: '警告', content: '確定清空所有過濾條件嗎？清空後將無法還原。' }
			},
			errors: {
				left_parentheses_error: '只能填寫左括號',
				right_parentheses_error: '只能填寫右括號',
			}
		},
		sort: {
			title: { icon: 'sort', text: '排序配置' },
			column: {
				sequence: '序號',
				operation: '操作',
				field: '項目',
				logic: '邏輯',
				buttons: {
					up: { icon: 'top', title: '排序上移' },
					down: { icon: 'bottom', title: '排序下移' },
					delete: { icon: 'delete', title: '刪除排序（無法恢復）' },
				}
			},
			buttons: {
				insert: { icon: 'plus', text: '新增一行' },
				clear: { icon: 'delete', text: '清空排序' },
			},
			message: {
				clear: { title: '警告', content: '確定清空所有排序條件嗎？清空後將無法還原。' }
			}
		}
	},
	print: {
		title: { icon: 'printer', text: '打印' },
		column: {
			sequence: '序號',
			field: '項目',
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
		title: { icon: 'upload', text: '導出' },
		type: { excel: 'Excel', csv: 'Csv', pdf: 'Pdf', txt: 'Txt'},
		data: { current: '當前數據', all: '全部數據' },
		column: {
			sequence: '序號',
			field: '項目',
			operation: '操作',
			buttons: {
				up: { icon: 'top', title: '上移' },
				down: { icon: 'bottom', title: '下移' },
			}
		},
		buttons: {
			'export': { icon: 'upload', text: '導出' },
		}
	}
}