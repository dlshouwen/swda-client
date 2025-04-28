<template>
	<!-- el table column -->
	<el-table-column :type="column.type" :index="column.index" :label="column.label" :columnKey="column.columnKey" :prop="column.prop" 
		:width="width" :minWidth="column.minWidth" :fixed="column.fixed" :renderHeader="column.renderHeader" 
		:sortable="column.sortable" :sortMethod="column.sortMethod" :sortBy="column.sortBy" :sortOrders="column.sortOrders"
		:resizable="column.resizable" :formatter="formatter" :showOverflowTooltip="column.showOverflowTooltip" 
		:align="column.align" :headerAlign="column.headerAlign" :className="column.className" :labelClassName="column.labelClassName" 
		:selectable="column.selectable" :reserveSelection="column.reserveSelection" 
		:filters="column.filters" :filterPlacement="column.filterPlacement" :filterClassName="column.filterClassName" 
		:filterMultiple="column.filterMultiple" :filterMethod="column.filterMethod" :filteredValue="column.filteredValue" 
		:tooltipFormatter="column.tooltipFormatter">
		<!-- slot: default -->
		<template v-if="$slots.default" #default="scope">
			<slot :row="scope.row" :column="scope.column" :$index="scope.$index"></slot>
		</template>
		<!-- slot: header -->
		<template v-if="$slots.header" #header="scope">
			<slot name="header" :column="scope.column" :$index="scope.$index"></slot>
		</template>
		<!-- slot: filter-icon -->
		<template v-if="$slots.filterIcon" #filter-icon="scope">
			<slot name="filter-icon" :filter-opened="scope.filterOpened"></slot>
		</template>
	</el-table-column>
</template>

<script setup lang="ts" name="SwTableColumn">
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue lements
import { ref, reactive, inject, computed, createVNode } from 'vue'

// import element plus elements
import { ElTag } from 'element-plus'

// import stores
import { useAppStore } from '@/stores/app'

// import tools
import { parseDate, formatDate, formatSeconds, formatFileSize, formatNumber, htmlEncode, htmlDecode } from '@/utils/tools'

// get stores
const appStore = useAppStore()

// define props
const props = defineProps({
	// type
	type: { type:String, required:false, default: ()=>'default' },
	// index
	index: { type:[Number, Function], required:false, default: null },
	// label: - -> label
	label: { type:String, required:false, default: ()=>'Label' },
	// data type
	dataType: { type:String, required:false, default: ()=>'string' },
	// column-key: - -> label
	columnKey: { type:String, required:false, default: null },
	// prop
	prop: { type:String, required:false, default: ()=>'' },
	// width
	width: { type:[String, Number], required:false, default: null },
	// min width
	minWidth: { type:[String, Number], required:false, default: null },
	// min: min width
	min: { type:[String, Number], required:false, default: ()=>80 },
	// max: max width
	max: { type:[String, Number], required:false, default: ()=>320 },
	// fit: fit width
	fit: { type:Boolean, required:false, default: ()=>true },
	// merge
	merge: { type:[Boolean, Array, String], required:false, default: ()=>false },
	// fit: dict
	dict: { type:[Object, Array, String], required:false, default: null },
	// fixed
	fixed: { type:[String, Boolean], required:false, default: ()=>false },
	// render-header
	renderHeader: { type:Function, required:false, default: null },
	// sortable: false -> true
	sortable: { type:Boolean, required:false, default: ()=>true	},
	// sort-method
	sortMethod: { type:Function, required:false, default: null },
	// sort-by
	sortBy: { type:[Function, String, Object], required:false, default: null },
	// sort-orders
	sortOrders: { type:Object, required:false, default: ()=>['ascending', 'descending', null] },
	// resizable
	resizable: { type:Boolean, required:false, default: ()=>true },
	// formatter
	formatter: { type:[String, Function], required:false, default: null },
	// format
	format: { type:[String], required:false, default: null },
	// otype
	otype: { type:[String], required:false, default: null },
	// oformat
	oformat: { type:[String], required:false, default: null },
	// show-overflow-tooltip: undefined -> true
	showOverflowTooltip: { type:[Boolean, Object], required:false, default: ()=>true },
	// align: left -> center
	align: { type:String, required:false, default: ()=>'center' },
	// header-align: left -> center
	headerAlign: { type:String, required:false, default: ()=>'center' },
	// class-name
	className: { type:String, required:false, default: ()=>'' },
	// label-class-name
	labelClassName: { type:String, required:false, default: ()=>'' },
	// selectable
	selectable: { type:Function, required:false, default: ()=>true },
	// reserve-selection: false -> true
	reserveSelection: { type:Boolean, required:false, default: ()=>true },
	// filters
	filters: { type:Array, required:false, default: null },
	// filter-placement
	filterPlacement: { type:String, required:false, default: null },
	// filter-class-name
	filterClassName: { type:String, required:false, default: null },
	// filter-multiple
	filterMultiple: { type:Boolean, required:false, default: ()=>true },
	// filter-method
	filterMethod: { type:Function, required:false, default: null },
	// filtered-value
	filteredValue: { type:Object, required:false, default: null },
	// tooltip-formatter
	tooltipFormatter: { type:Function, required:false, default: null },
	// fast: fast query
	fast: { type:[Boolean, String], required:false, default: ()=>false },
	// fast type
	fastType: { type:String, required:false, default: ()=>'select' },
	// advance: advance query
	advance: { type:Boolean, required:false, default: ()=>true },
	// printable
	printable: { type:Boolean, required:false, default: ()=>true },
	// exportable
	exportable: { type:Boolean, required:false, default: ()=>true }
})

// const column from props
const column = reactive({})

Object.assign(column, props)

// computed width
const width = computed(()=>{
	// explicit
	if(props.width){
		// return width
		return props.width
	}
})

// const dict
const dict = reactive({ visible: false, style: 'primary', label: '' })

/**
 * formatter
 * @param _row
 * @param _column
 * @param _value
 * @param _index
 */
const formatter = (_row, _column, _value, _index)=>{
	// date
	// expilcit
	if(typeof column.formatter === 'function'){
		// return formatter
		return props.formatter(_row, _column, _value, _index)
	}
	// dict
	if(column.dict){
		// defined style, label
		let style = 'primary'
		let label = _value
		// string
		if(typeof column.dict === 'string'){
			// if valid
			if(appStore.dict&&appStore.dict[column.dict]&&appStore.dict[column.dict][_value]){
				// set dict style
				style = appStore.dict[column.dict][_value].style
				// set dict label
				label = appStore.dict[column.dict][_value].label
			}
		}
		// array
		if(typeof column.dict === 'array'){
			// if valid
			if(column.dict[_value]){
				// set dict style
				style = column.dict[_value].style
				// set dict label
				label = column.dict[_value].label
			}
		}
		// object
		if(typeof column.dict === 'object'){
			// if valid
			if(column.dict[_value]){
				// set dict label
				label = column.dict[_value]
			}
		}
		// return tag
		return createVNode(ElTag, { type:style }, ()=>label)
	}
	// date
	if(column.formatter=='date') {
		// array
		if(_value instanceof Array){
			if(_value.length<6){
				for(let i=5;i>=0;i--){
					if(_value[i]){
						break;
					}
					_value[i] = 0;
				}
			}
			if(_value.length==6){
				_value = new Date(_value[0], _value[1]-1, _value[2], _value[3], _value[4], _value[5]);
			}
			if(_value.length==7){
				_value = new Date(_value[0], _value[1]-1, _value[2], _value[3], _value[4], _value[5], _value[6]);
			}
		}
		// string
		if(typeof _value==='string'){
			// default string
			column.otype = column.otype?column.otype:'string';
			// timestamp second
			if(column.otype=='tss'){
				_value = new Date(parseFloat(_value)*1000);
			}
			// timestamp millisecond
			if(column.otype=='ts'){
				_value = new Date(parseFloat(_value));
			}
			// string
			if(column.otype=='string'){
				if(column.oformat){
					_value = parseDate(_value, column.oformat);
				}else{
					_value = new Date()
				}
			}
		}
		return formatDate(_value, column.format);
	}
	// secend
	if(column.formatter=='secend') return formatSeconds(_value);
	// size
	if(column.formatter=='size') return formatFileSize(_value);
	// number
	if(column.formatter=='number') return formatNumber(_value, column.format);
	// encode
	if(column.formatter=='encode') return htmlEncode(_value);
	// decode
	if(column.formatter=='decode') return htmlDecode(_value);
	// default
	return _value
}

// inject
const appendColumn = inject('appendColumn', ()=>{})

// append column
appendColumn(column)
</script>