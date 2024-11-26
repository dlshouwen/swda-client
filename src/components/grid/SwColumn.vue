<template>
	<el-table-column v-if="!hide"
		:ref="'column_'+id" 
		:prop="column.prop?column.prop:column.id" 
		:type="column.type"
		:index="column.index"
		:column-key="column.columnKey"
		:label="column.label"
		:width="columnWidth"
		:min-width="column.minWidth"
		:fixed="column.fixed"
		:render-header="column.renderHeader"
		:sortable="column.sortable"
		:sort-method="column.sortMethod"
		:sort-by="column.sortBy"
		:sort-orders="column.sortOrders"
		:resizable="column.resizable"
		:formatter="dataFormatter"
		:show-overflow-tooltip="column.showOverflowTooltip"
		:align="column.align"
		:header-align="column.headerAlign"
		:class-name="column.className"
		:label-class-name="column.labelClassName"
		:selectable="column.selectable"
		:reserve-selection="column.reserveSelection"
		:filters="column.filters"
		:filter-placement="column.filterPlacement"
		:filter-multiple="column.filterMultiple"
		:filter-method="column.filterMethod"
		:filtered-value="column.filteredValue"
	>
		<template v-if="$slots.default" #default="scope">
			<slot :row="scope.row" :column="scope.column" :$index="scope.$index" :$column="column"></slot>
		</template>
	</el-table-column>
</template>

<script setup>
// import vue: ref & reactive & to refs & inject
import { ref, reactive, toRefs, inject } from 'vue'

// import tool
import * as tool from './tool/tool';

// props
const props = defineProps({
	/**
	 * props
	 */
	// sw column
	id: { default: null, type: String, required: false  },
	min: { default: 40, type: Number, required: false  },
	max: { default: 120, type: Number, required: false  },
	fit: { default: false, type: Boolean, required: false  },
	dataType: { default: 'string', type: String, required: false  },
	dict: { default: null, required: false  },
	header: { default: false, type: Boolean, required: false  },
	info: { default: false, type: Boolean, required: false  },
	format: { default: null, type: String, required: false  },
	otype: { default: null, type: String, required: false  },
	oformat: { default: null, type: String, required: false  },
	encode: { default: false, type: Boolean, required: false  },
	decode: { default: false, type: Boolean, required: false  },
	hide: { default: false, type: Boolean, required: false  },
	merge: { default: false, required: false  },
	fast: { default: false, required: false  },
	fastType: { default: 'select', type: String, required: false  },
	advance: { default: true, type: Boolean, required: false  },
	'export': { default: true, type: Boolean, required: false  },
	print: { default: true, type: Boolean, required: false  },
	// el column
	type: { default: null, type: String, required: false  },
	index: { default: null, required: false  },
	columnKey: { default: null, type: String, required: false  },
	label: { default: null, type: String, required: false  },
	prop: { default: null, type: String, required: false  },
	width: { default: 80, required: false  },
	minWidth: { default: null, type: String, required: false  },
	fixed: { default: null, required: false  },
	renderHeader: { default: null, type: Function, required: false  },
	sortable: { default: true, required: false  },
	sortMethod: { default: null, type: Function, required: false  },
	sortBy: { default: null, required: false  },
	sortOrders: { default: ()=>['ascending', 'descending', null], type: Array, required: false  },
	resizable: { default: true, type: Boolean, required: false  },
	formatter: { default: null, type: Function, required: false  },
	showOverflowTooltip: { default: false, type: Boolean, required: false  },
	align: { default: 'center', type: String, required: false  },
	headerAlign: { default: 'center', type: String, required: false  },
	className: { default: null, type: String, required: false  },
	labelClassName: { default: null, type: String, required: false  },
	selectable: { default: null, type: Function, required: false  },
	reserveSelection: { default: false, type: Boolean, required: false  },
	filters: { default: null, type: Array, required: false  },
	filterPlacement: { default: null, type: String, required: false  },
	filterMultiple: { default: true, type: Boolean, required: false  },
	filterMethod: { default: null, type: Function, required: false  },
	filteredValue: { default: null, type: Array, required: false  },
})

// const state
const state = reactive({
	// width
	columnWidth: props.width,
	// column
	column: {
		id: props.id,
		min: props.min,
		max: props.max,
		fit: props.fit,
		dataType: props.dataType,
		dict: props.dict,
		info: props.info,
		format: props.format,
		otype: props.otype,
		oformat: props.oformat,
		encode: props.encode,
		decode: props.decode,
		hide: props.hide,
		merge: props.merge,
		fast: props.fast,
		fastType: props.fastType,
		advance: props.advance,
		'export': props['export'],
		print: props.print,
		type: props.type,
		index: props.index,
		columnKey: props.columnKey,
		label: props.label,
		prop: props.prop,
		width: props.width,
		minWidth: props.minWidth,
		fixed: props.fixed,
		renderHeader: props.renderHeader,
		sortable: props.sortable,
		sortMethod: props.sortMethod,
		sortBy: props.sortBy,
		sortOrders: props.sortOrders,
		resizable: props.resizable,
		formatter: props.formatter,
		showOverflowTooltip: props.showOverflowTooltip,
		align: props.align,
		headerAlign: props.headerAlign,
		className: props.className,
		labelClassName: props.labelClassName,
		selectable: props.selectable,
		reserveSelection: props.reserveSelection,
		filters: props.filters,
		filterPlacement: props.filterPlacement,
		filterMultiple: props.filterMultiple,
		filterMethod: props.filterMethod,
		filteredValue: props.filteredValue,
		hasChildren: false,
		changeWidth: (width) => { state.columnWidth = width },
		children: []
	}
});

// to refs
const { columnWidth, column } = toRefs(state);

// inject
const _dataFormatter = inject('dataFormatter')
const _appendColumn = inject('appendColumn')

/**
 * data formatter
 * @param row
 * @param column
 * @param value
 * @param index
 * @return value
 */
const dataFormatter = (row, column, value, index) => {
	return _dataFormatter(row, state.column, value, index);
}

// append column
_appendColumn(state.column);
</script>