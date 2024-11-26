/**
 * lang
 */
export const en = {
	errors: {
		data_load_error: 'Data load error, please check your query datas.',
		data_export_error: 'Data export error, please check your query datas.'
	},
	text: {
		empty: 'No Data',
		sum: 'Sum',
	},
	toolbar: {
		mode: {
			list: { label: 'List', icon: 's-grid', title: 'switch to list mode' },
			group: { label: 'Group', icon: 'menu', title: 'switch to group mode' },
		},
		refresh:{ label: 'Refresh', icon: 'refresh', title: 'Refresh' },
		fast:{ label: 'Fast', icon: 'search', title: 'Fast Query' },
		advance:{ label: 'Advance', icon: 'filter', title: 'Advance Query' },
		'export':{ label: 'Export', icon: 'upload', title: 'Print' },
		print: { label: 'Print', icon: 'printer', title: 'Print' }
	},
	fast: {
		title: { icon: 'search', text: 'Fast Query' },
		all: 'all',
		to: 'to',
		buttons: {
			reset: { icon: 'refresh-left', text: 'Reset' },
			query: { icon: 'check', text: 'Search' },
		}
	},
	advance: {
		title: { icon: 'filter', text: 'Advance Query' },
		list: {
			title: { icon: 'list', text: 'Advance Query List' },
		},
		main: {
			title: { icon: 'document', text: 'Advance Query Info' },
			name: { text:'Name', placeholder:'Please input name info' },
			remark: { text:'Remark', placeholder:'Please input remark info' },
			buttons: {
				add: { icon: 'plus', text: 'Add' },
				update: { icon: 'edit', text: 'Update' },
				copy: { icon: 'document-copy', text: 'Copy' },
				delete: { icon: 'delete', text: 'Delete' },
				sure: { icon: 'check', text: 'Search' },
			},
			message: {
				add: { title: 'Warning', content: 'Sure to add advance query?' },
				update: { title: 'Warning', content: 'Sure to update advance query?', nothing: 'You are not select any advance query, cannot execute update.' },
				copy: { title: 'Warning', content: 'Sure to copy advance query?', nothing: 'You are not select any advance query, cannot execute copy.' },
				delete: { title: 'Warning', content: 'Sure to delete advance query?', nothing: 'You are not select any advance query, cannot execute delete.' },
			}
		},
		condition: {
			title: { icon: 'search', text: 'Condition' },
			column: {
				sequence: 'No.',
				operation: 'Op.',
				leftParentheses: '(',
				field: 'Project',
				condition: 'Condition',
				value: 'Value',
				rightParentheses: ')',
				logic: 'Logic',
				buttons: {
					up: { icon: 'top', title: 'up condition' },
					down: { icon: 'bottom', title: 'down condition' },
					delete: { icon: 'delete', title: 'delete condition' },
				}
			},
			buttons: {
				insert: { icon: 'plus', text: 'Insert Condition' },
				clear: { icon: 'delete', text: 'Clear Conditions' },
			},
			message: {
				clear: { title: 'Warning', content: 'Sure to clear all conditions? It`s connot be reduction.' }
			},
			errors: {
				left_parentheses_error: 'Only can input left parentheses.',
				right_parentheses_error: 'Only can input right parentheses.',
			}
		},
		sort: {
			title: { icon: 'sort', text: 'Sort' },
			column: {
				sequence: 'No.',
				operation: 'Op.',
				field: 'Project',
				logic: 'Logic',
				buttons: {
					up: { icon: 'top', title: 'up sort' },
					down: { icon: 'bottom', title: 'down sort' },
					delete: { icon: 'delete', title: 'delete sort' },
				}
			},
			buttons: {
				insert: { icon: 'plus', text: 'Insert Sort' },
				clear: { icon: 'delete', text: 'Clear Sort' },
			},
			message: {
				clear: { title: 'Warning', content: 'Sure to clear all sorts? It`s connot be reduction.' }
			}
		}
	},
	print: {
		title: { icon: 'printer', text: 'Print' },
		column: {
			sequence: 'No.',
			field: 'Project',
			operation: 'Op.',
			buttons: {
				up: { icon: 'top', title: 'up column' },
				down: { icon: 'bottom', title: 'down column' },
			}
		},
		buttons: {
			print: { icon: 'printer', text: 'Print' },
		}
	},
	'export': {
		title: { icon: 'upload', text: 'Export' },
		type: { excel: 'Excel', csv: 'Csv', pdf: 'Pdf', txt: 'Txt'},
		data: { current: 'Current', all: 'All' },
		column: {
			sequence: 'No.',
			field: 'Project',
			operation: 'Op.',
			buttons: {
				up: { icon: 'top', title: 'up column' },
				down: { icon: 'bottom', title: 'down column' },
			}
		},
		buttons: {
			'export': { icon: 'upload', text: 'Export' },
		}
	}
}