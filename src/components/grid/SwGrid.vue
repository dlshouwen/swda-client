<template>
	<!-- grid main -->
	<div ref="grid_main">
		<!-- grid container -->
		<div ref="grid_container" class="grid-container">
			<!-- table -->
			<el-table 
				ref="grid" 
				:loading="loading"
				:data="datas.exhibit"
				:height="height"
				:max-height="maxHeight"
				:stripe="stripe"
				:border="border"
				:size="size"
				:fit="fit"
				:show-header="showHeader"
				:highlight-current-row="highlightCurrentRow"
				:current-row-key="currentRowKey"
				:row-class-name="rowClassName"
				:row-style="rowStyle"
				:cell-class-name="cellClassName"
				:cell-style="cellStyle"
				:header-row-class-name="headerRowClassName"
				:header-row-style="headerRowStyle"
				:header-cell-class-name="headerCellClassName"
				:header-cell-style="headerCellStyle"
				:row-key="rowKey"
				:empty-text="language.text.empty"
				:default-expand-all="defaultExpandAll"
				:expand-row-keys="expandRowKeys"
				:default-sort="defaultSort"
				:tooltip-effect="tooltipEffect"
				:show-summary="showSummary"
				:sum-text="language.text.sum"
				:summary-method="summaryMethod"
				:span-method="handleSpanMethod"
				:select-on-indeterminate="selectOnIndeterminate"
				:indent="indent"
				:lazy="lazy"
				:load="handleTreeLoad"
				:tree-props="treeProps"
				@select="select"
				@select-all="selectAll"
				@selection-change="selectionChange"
				@cell-mouse-enter="cellMouseEnter"
				@cell-mouse-leave="cellMouseLeave"
				@cell-click="cellClick"
				@cell-dblclick="cellDblclick"
				@row-click="rowClick"
				@row-contextmenu="rowContextmenu"
				@row-dblclick="rowDblclick"
				@header-click="headerClick"
				@header-contextmenu="headerContextmenu"
				@sort-change="sortChange"
				@filter-change="filterChange"
				@current-row-change="currentRowChange"
				@header-dragend="headerDragend"
				@expand-change="expandChange"
			>
				<el-table-column v-if="tree&&treeExpandNode" :prop="treeProp" v-bind="treeExpandNodeProps"></el-table-column>
				<slot></slot>
			</el-table>
		</div>
		<!-- grid toolbar container -->
		<div ref="grid_toolbar_container" class="grid-toolbar-container">
			<!-- grid toolbar -->
			<div v-if="toolbar" class="grid-toolbar-operations">
				<!-- grid toobar operations -->
				<template v-for="operation in toolbarOperations.split(/[ ]*,[ ]*/)">
					<el-button v-if="operation=='refresh'" type="default" :underline="false" @click.native="load" 
						:title="language.toolbar.refresh.title" 
						:icon="toolbarIcon?language.toolbar.refresh.icon:false">
						<template v-if="toolbarLabel">{{language.toolbar.refresh.label}}</template>
					</el-button>
					<el-button v-if="operation=='fast'" type="default" :underline="false" @click.native="openFastQuery" 
						:title="language.toolbar.fast.title" 
						:icon="toolbarIcon?language.toolbar.fast.icon:false">
						<template v-if="toolbarLabel">{{language.toolbar.fast.label}}</template>
					</el-button>
					<el-button v-if="operation=='advance'" type="default" :underline="false" @click.native="openAdvanceQuery"
						:title="language.toolbar.advance.title" 
						:icon="toolbarIcon?language.toolbar.advance.icon:false">
						<template v-if="toolbarLabel">{{language.toolbar.advance.label}}</template>
					</el-button>
					<el-button v-if="operation=='export'" type="default" :underline="false" @click.native="openExport" 
						:title="language.toolbar.export.title" 
						:icon="toolbarIcon?language.toolbar.export.icon:false">
						<template v-if="toolbarLabel">{{language.toolbar.export.label}}</template>
					</el-button>
					<el-button v-if="operation=='print'" type="default" :underline="false" @click.native="openPrint" 
						:title="language.toolbar.print.title" 
						:icon="toolbarIcon?language.toolbar.print.icon:false">
						<template v-if="toolbarLabel">{{language.toolbar.print.label}}</template>
					</el-button>
				</template>
			</div>
			<!-- grid pagination -->
			<el-pagination 
				:current-page="query.page.current" 
				:total="query.page.total"
				:page-size="pageSize"
				:page-sizes="pageSizes" 
				:layout="layout"
				@size-change="sizeChange"
				@current-change="currentChange" 
			>
			</el-pagination>
		</div>
		<!-- fast query dialog -->
		<el-dialog center width="520px" v-model="show.fast" :append-to-body="true">
			<template #header><el-link :icon="language.fast.title.icon">{{language.fast.title.text}}</el-link></template>
			<FastQuery :language="language" :columns="columns" :params="query.params.fast"></FastQuery>
		</el-dialog>
		<!-- advance query dialog -->
		<el-dialog center width="960px" v-model="show.advance" :append-to-body="true">
			<template #header><i :class="language.advance.title.icon"></i> {{language.advance.title.text}}</template>
			<AdvanceQuery :language="language" :option="option" :server="server" :columns="columns" :column="column" :params="query.params.advance"></AdvanceQuery>
		</el-dialog>
		<!-- print dialog -->
		<el-dialog center width="400px" v-model="show.print" :append-to-body="true">
			<template #header><i :class="language.print.title.icon"></i> {{language.print.title.text}}</template>
			<Print :language="language" :columns="columns"></Print>
		</el-dialog>
		<!-- export dialog -->
		<el-dialog center width="400px" v-model="show.export" :append-to-body="true">
			<template #header><i :class="language.export.title.icon"></i> {{language.export.title.text}}</template>
			<Export :language="language" :columns="columns"></Export>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & get current instance & provide
import { ref, reactive, toRefs, watch, getCurrentInstance, provide, nextTick } from 'vue'

// import request
import { request } from '@/assets/utils/request'

//import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

// import column
import SwColumn from './SwColumn';

// import extend component: fast query & advance query & print & export
import FastQuery from './extend/FastQuery';
import AdvanceQuery from './extend/AdvanceQuery';
import Print from './extend/Print';
import Export from './extend/Export';

// import print js
import printJS from 'print-js';

// import tool
import * as tool from './tool/tool';

// import languages: en & zh_cn & zh_tw
import { en } from './i18n/en';
import { zh_cn } from './i18n/zh_cn';
import { zh_tw } from './i18n/zh_tw';
// construct languages
const languages = { en, zh_cn, zh_tw };

// props
const props = defineProps({
	/**
	 * props
	 */
	// sw grid
	id: { default: null, type: String, required: false },
	title: { default: null, type: String, required: false },
	lang: { default: 'zh_cn', required: false },
	once: { default: false, type: Boolean, required: false },
	url: { default: null, type: String, required: false },
	advance: { default: null, type: String, required: false },
	server: { default: '/core/grid', type: String, required: false },
	tree: { default: false, type: Boolean, required: false },
	treeProp: { default: null, type: String, required: false },
	treeTopValue: { default: null, required: false },
	treeExpandNode: { default: true, type: Boolean, required: false },
	treeExpandNodeProps: { default: ()=>{ return {align:'left', headerAlign:'center'}; }, type: Object, required: false },
	cookie: { default: false, type: Boolean, required: false },
	request: { default: null, required: false },
	validation: { default: null, required: false },
	message: { default: null, required: false },
	messageBox: { default: null, required: false },
	params: { default: null, required: false },
	search: { default: null, required: false },
	toolbar: { default: true, type: Boolean, required: false },
	toolbarIcon: { default: true, type: Boolean, required: false },
	toolbarLabel: { default: true, type: Boolean, required: false },
	toolbarOperations: { 
		default: 'refresh, fast, advance, export, print', 
		type: String, 
		required: false
	},
	rowClickSelection: { default: true, type: Boolean, required: false },
	// el grid
	data: { default: null, type: Array, required: false },
	height: { default: null, required: false },
	maxHeight: { default: null, required: false },
	stripe: { default: true, type: Boolean, required: false },
	border: { default: true, type: Boolean, required: false },
	size: { default: null, type: String, required: false },
	fit: { default: true, type: Boolean, required: false },
	showHeader: { default: true, type: Boolean, required: false },
	highlightCurrentRow: { default: false, type: Boolean, required: false },
	currentRowKey: { default: null, required: false },
	rowClassName: { default: null, required: false },
	rowStyle: { default: null, required: false },
	cellClassName: { default: null, required: false },
	cellStyle: { default: null, required: false },
	headerRowClassName: { default: null, required: false },
	headerRowStyle: { default: null, required: false },
	headerCellClassName: { default: null, required: false },
	headerCellStyle: { default: null, required: false },
	rowKey: { default: null, required: false },
	emptyText: { default: '', type: String, required: false },
	defaultExpandAll: { default: false, type: Boolean, required: false },
	expandRowKeys: { default: null, type: Array, required: false },
	defaultSort: { type: Object, required: false },
	tooltipEffect: { default: null, type: String, required: false },
	showSummary: { default: false, type: Boolean, required: false },
	sumText: { default: null, type: String, required: false },
	summaryMethod: { default: null, type: Function, required: false },
	spanMethod: { default: null, type: Function, required: false },
	selectOnIndeterminate: { default: true, type: Boolean, required: false },
	indent: { default: 16, type: Number, required: false },
	lazy: { default: null, type: Boolean, required: false },
	treeLoad: { default: null, type: Function, required: false },
	treeProps: { default: ()=>{ return {hasChildren: 'hasChildren', children: 'children'} }, type: Object, required: false },
	// el pager
	pagerSmall: { default: false, type: Boolean, required: false },
	pagerBackground: { default: false, type: Boolean, required: false },
	pageSize: { default: 50, type: Number, required: false },
	pageTotal: { default: null, type: Number, required: false },
	pageCount: { default: null, type: Number, required: false },
	pagerCount: { default: 7, type: Number, required: false },
	currentPage: { default: 1, type: Number, required: false },
	layout: { default: 'sizes, prev, pager, next, jumper, ->, total', type: String, required: false },
	pageSizes: { default: ()=>[50, 200, 1000], required: false },
	pagerPopperClass: { default: null, type: String, required: false },
	prevText: { default: null, type: String, required: false },
	nextText: { default: null, type: String, required: false },
	pagerDisabled: { default: false, type: Boolean, required: false },
	hideOnSinglePage: { default: null, type: Boolean, required: false },
	/**
	 * events
	 */
	// sw grid
	beforeInit: { default: null, type: Function, required: false },
	beforeLoad: { default: null, type: Function, required: false },
	datasRender: { default: null, type: Function, required: false },
})

// ref
const grid = ref();

// instance
const instance = getCurrentInstance()

// const state
const state = reactive({
	// loading
	loading: false,
	// option
	option: {
		// id
		id: props.id?props.id:tool.guid(),
		// advance
		advance: props.advance?props.advance:(props.id?props.id:(window.location.href+'/vnode:'+instance.uid)),
		// request
		request: props.request?props.request:request,
		// validation
		validation: props.validation?props.validation:tool.validation,
		// message
		message: props.message?props.message:ElMessage,
		// message box
		messageBox: props.messageBox?props.messageBox:ElMessageBox,
	},
	// columns
	columns: [],
	// column
	column: {},
	// language
	language: languages['zh_cn'],
	// show
	show: { fast: false, advance: false, print: false, 'export': false },
	// inner
	inner: { loaded: false, cleaned: false },
	// query
	query: {
		// page
		page: { current: 1, size:props.pageSize, total: 0 },
		// params
		params:{ fast: {}, advance: { conditions: [], sorts: [] } }
	},
	// datas: origin -> clean -> filter -> render -> pager -> exhibit
	datas: { origin: [], clean: [], filter: [], render: [], pager: [], exhibit: [] }
});

// to refs
const { loading, option, columns, column, language, show, inner, query, datas } = toRefs(state);

/**
 * init
 */
const init = () => {
	// loading
	state.loading = true;
	// default language
	if(typeof props.lang == 'object'){
		state.language = tool.merge({}, state.language, props.lang);
	}else{
		state.language = languages[props.lang]?languages[props.lang]:props.language;
	}
	// empty text
	if(props.emptyText) state.language.text.empty = props.emptyText;
	// sum text
	if(props.sumText) state.language.text.sum = props.sumText;
	// loading
	state.loading = false;
}

/**
 * load
 */
const load = () => {
	// loading
	state.loading = true;
	// if has data
	if(state.data){
		// loading
		state.loading = false;
		// data loaded
		state.inner.loaded = true;
		// data clean
		state.inner.cleaned = false;
		// set data
		state.datas.origin = props.data;
		// data handle
		dataHandle();
		// return
		return;
	}
	// if once or tree
	if(props.once||props.tree){
		// if not loaded
		if(!state.inner.loaded){
			// set params
			let params = props.params?tool.merge({}, props.params):{};
			// tree lazy top
			if(props.lazy)
				params['$sw-tree-load-key'] = props.treeTopValue;
			// load data
			state.option.request({url:props.url, method:'post', headers:{'x-resolve':'1'}, data:params}).then((handler)=>{
				// loading
				state.loading = false;
				// handler
				if(!handler.data.result){
					// message
					state.option.message({message:handler.data.message, type:'error'});
					// return
					return;
				}
				// data loaded
				state.inner.loaded = true;
				// data clean
				state.inner.cleaned = false;
				// set data
				state.datas.origin = handler.data.data.datas;
				// data handle
				dataHandle();
			}).catch(error=>{
				// loading
				state.loading = false;
				// message
				state.option.message({message:state.language.errors.data_load_error, type:'error'});
				// log
				console.error(error);
			});
		}else{
			// loading
			state.loading = false;
			// data handle
			dataHandle();
		}
		// return
		return;
	}
	// ajax load
	let data = {};
	data.current = state.query.page.current;
	data.size = props.pageSize;
	data.parameters = props.params;
	data.searchQueryParameters = props.search;
	data.fastQueryParameters = state.query.params.fast;
	data.advanceQueryConditions = state.query.params.advance.conditions;
	data.advanceQuerySorts = state.query.params.advance.sorts;
	// load data
	state.option.request({url:props.url, method:'post', headers:{'x-resolve':'1'}, data:data}).then((handler)=>{
		// loading
		state.loading = false;
		// handler
		if(!handler.data.result){
			// message
			state.option.message({message:state.language.errors.data_load_error, type:'error'});
			// log
			console.error(handler.data.message);
			// return
			return;
		}
		// set pager
		state.pager = handler.data.data.pager;
		// set total
		state.query.page.total = parseFloat(handler.data.data.pager.page.total);
		// set data
		state.datas.origin = handler.data.data.pager.page.records;
		// data clean
		state.inner.cleaned = false;
		// data handle
		dataHandle();
	}).catch(error=>{
		// loading
		state.loading = false;
		// message
		state.option.message({message:state.language.errors.data_load_error, type:'error'});
		// log
		console.error(error);
	});
}

/**
 * data handle
 * @param column
 * @param scope
 */
const dataHandle = () => {
	/**
	 * 1. reset
	 */
	// reset clean
	if(!state.inner.cleaned){
		state.datas.clean = [];
	}
	// reset filter
	state.datas.filter = [];
	// reset exhibit
	state.datas.exhibit = [];
	/**
	 * 2. clean datas
	 */
	if(!state.inner.cleaned){
		// set clean
		state.inner.cleaned = true;
		// clean data
		state.datas.clean = cleanDatas(state.datas.origin);
	}
	/**
	 * 3. filter datas
	 */
	// filter datas
	if(props.data||props.once||props.tree){
		state.datas.filter = filterDatas(state.datas.clean);
	}else{
		state.datas.filter = state.datas.clean;
	}
	/**
	 * 4. sort data
	 */
	// need sort
	if(props.data||props.once||props.tree){
		state.datas.filter = sortDatas(state.datas.filter);
	}
	/**
	 * 5. render
	 */
	// set render datas
	state.datas.render = state.datas.filter;
	// if has datas render
	if(props.datasRender){
		// render datas
		state.datas.render = props.datasRender(state.datas.render);
	}
	/**
	 * 6. pager
	 */
	// need pager
	if(props.data||props.once||props.tree){
		// get total
		state.query.page.total = state.datas.render.length;
		// splice
		state.datas.pager = state.datas.render.concat([]).splice((state.query.page.current-1)*state.query.page.size, state.query.page.size);
	}else{
		// set pager datas
		state.datas.pager = state.datas.render;
	}
	/**
	 * 7. exhibit data
	 */
	 state.datas.exhibit = state.datas.pager;
	/**
	 * 9. completed
	 */
	if(instance.attrs.onGridCompleted) try{ instance.attrs.onGridCompleted(); }catch(e){ console.error(e); }
}

/**
 * clean datas
 * @param datas
 * @return clean datas
 */
const cleanDatas = (datas) => {
	// defined result datas
	let rdatas = [];
	// for each origin datas
	datas.forEach((_data_, index)=>{
		// copy data
		let data = tool.merge({}, _data_);
		state.columns.forEach(column=>{
			var value = data[column.id];
			// default empty
			if(column.dataType!='date'&&column.dataType!='number'){
				value = value?value:'';
			}
			// date convert
			if(column.dataType=='date'){
				// array
				if(value instanceof Array){
					if(value.length<6){
						for(let i=5;i>=0;i--){
							if(value[i]){
								break;
							}
							value[i] = 0;
						}
					}
					if(value.length==6){
						value = new Date(value[0], value[1]-1, value[2], value[3], value[4], value[5]);
					}
					if(value.length==7){
						value = new Date(value[0], value[1]-1, value[2], value[3], value[4], value[5], value[6]);
					}
				}
				// string
				if(typeof value==='string'){
					// default string
					column.otype = column.otype?column.otype:'string';
					// timestamp second
					if(column.otype=='tss'){
						value = new Date(parseFloat(value)*1000);
					}
					// timestamp millisecond
					if(column.otype=='ts'){
						value = new Date(parseFloat(value));
					}
					// string
					if(column.otype=='string'){
						if(column.oformat){
							value = tool.parseDate(value, column.oformat);
						}
					}
				}
				// special
				if(value&&value.chronology){
					value = new Date(value.year, value.monthValue-1, value.dayOfMonth, value.hour, value.minute, value.second, value.nano);
				}
			}
			// set value
			data[column.id] = value
		});
		rdatas.push(data);
	});
	// return
	return rdatas;
}

/**
 * filter datas
 * @param datas
 * @return filter datas
 */
const filterDatas = (datas) => {
	// defined result datas
	let rdatas = [];
	// for each origin
	for(let i=0; i<datas.length; i++){
		// get data
		let data = tool.merge({}, datas[i]);
		// defined is show
		let show = true;
		// manual fast concat
		let manuals = [];
		for(let key in props.search){
			manuals.push({key:key, value:props.search[key]});
		}
		for(let key in state.query.params.fast){
			manuals.push({key:key, value:state.query.params.fast[key]});
		}
		// fileter manual and fast
		for(let i=0; i<manuals.length; i++){
			// get manual
			const manual = manuals[i];
			// get key & value
			const key = manual.key;
			const value = manual.value;
			// empty continue
			if(!key||!value){
				continue;
			}
			// get prefix & id
			const prefix = key.split('_')[0];
			const id = key.replace(prefix+'_', '');
			// empty continue
			if(!prefix||!id){
				continue;
			}
			// get column
			const column = state.column[id];
			// get content
			const content = column&&column.info?data.info[id]:data[id];
			// equals
			if(prefix=='eq'){
				if(content!=value){
					show = false;
					continue;
				}
			}
			// not equals
			if(prefix=='ne'){
				if(content==value){
					show = false;
					continue;
				}
			}
			// like
			if(prefix=='lk'){
				if(content==undefined||content.indexOf(value)==-1){
					show = false;
					continue;
				}
			}
			// left like
			if(prefix=='ll'){
				if(!tool.startsWith(content, value)){
					show = false;
					continue;
				}
			}
			// right like
			if(prefix=='rl'){
				if(!tool.endsWith(content, value)){
					show = false;
					continue;
				}
			}
			// great than
			if(prefix=='gt'){
				// date
				if(content instanceof Date){
					if((content.getTime()-tool.parseDate(value, state.column[key.replace('gt_', '')].format).getTime())<=0){
						show = false;
						continue;
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))<=0){
						show = false;
						continue;
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(content)){
					if(content.localeCompare(value)<=0){
						show = false;
						continue;
					}
				}
			}
			// great than equals
			if(prefix=='ge'){
				// date
				if(content instanceof Date){
					if((content.getTime()-tool.parseDate(value, state.column[key.replace('ge_', '')].format).getTime())<0){
						show = false;
						continue;
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))<0){
						show = false;
						continue;
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(value)){
					if(content.localeCompare(value)<0){
						show = false;
						continue;
					}
				}
			}
			// less than
			if(prefix=='lt'){
				// date
				if(content instanceof Date){
					if((content.getTime()-tool.parseDate(value, state.column[key.replace('lt_', '')].format).getTime())>=0){
						show = false;
						continue;
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))>=0){
						show = false;
						continue;
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(content)){
					if(content.localeCompare(value)>=0){
						show = false;
						continue;
					}
				}
			}
			// less than equals
			if(prefix=='le'){
				// date
				if(content instanceof Date){
					if((content.getTime()-tool.parseDate(value, gridReflectionObj.elementFormat[key.replace('le_', '')]).getTime())>0){
						show = false;
						continue;
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))>0){
						show = false;
						continue;
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(content)){
					if(content.localeCompare(value)>0){
						show = false;
						continue;
					}
				}
			}
		}
		// fix eval
		let startsWith = tool.startsWith;
		let endsWith = tool.endsWith;
		let parseDate = tool.parseDate;
		// advance query condition
		if(state.query.params.advance&&state.query.params.advance.conditions&&state.query.params.advance.conditions.length>0){
			// get conditions
			let conditions = state.query.params.advance.conditions;
			// defined rules
			var rules = '';
			// for each condition
			for(let k=0; k<conditions.length; k++){
				let condition = conditions[k];
				// column
				const column = state.column[condition.conditionField];
				// value
				const value = 'data'+(column&&column.info?'.info':'')+'["'+condition.conditionField+'"]';
				// left parentheses
				rules += condition.leftParentheses;
				// rule
				if(condition.conditionType=='0'){
					rules += value+'=="'+condition.conditionValue+'"';
				}
				if(condition.conditionType=='1'){
					rules += value+'!="'+condition.conditionValue+'"';
				}
				if(condition.conditionType=='2'){
					rules += value+'.indexOf("'+condition.conditionValue+'")!=-1';
				}
				if(condition.conditionType=='3'){
					rules += 'startsWith('+value+', "'+condition.conditionValue+'")';
				}
				if(condition.conditionType=='4'){
					rules += 'endsWith('+value+', "'+condition.conditionValue+'")';
				}
				if(condition.conditionType=='5'){
					var _value = data[condition.conditionField];
					// date
					if(_value instanceof Date){
						rules += '('+value+'.getTime()-parseDate("'+condition.conditionValue+'", "'+column.format+'").getTime())>0';
					}
					// number
					if(!(_value instanceof Date)&&!isNaN(_value)){
						rules += '(parseFloat('+value+')-parseFloat("'+condition.conditionValue+'"))>0';
					}
					// default
					if(!(_value instanceof Date)&&isNaN(_value)){
						rules += ''+value+'.localeCompare("'+condition.conditionValue+'")>0';
					}
				}
				if(condition.conditionType=='6'){
					var _value = data[condition.conditionField];
					// date
					if(_value instanceof Date){
						rules += '('+value+'.getTime()-parseDate("'+condition.conditionValue+'", "'+column.format+'").getTime())>=0';
					}
					// number
					if(!(_value instanceof Date)&&!isNaN(_value)){
						rules += '(parseFloat('+value+')-parseFloat("'+condition.conditionValue+'"))>=0';
					}
					// default
					if(!(_value instanceof Date)&&isNaN(_value)){
						rules += ''+value+'.localeCompare("'+condition.conditionValue+'")>=0';
					}
				}
				if(condition.conditionType=='7'){
					var _value = data[condition.conditionField];
					// date
					if(_value instanceof Date){
						rules += '('+value+'.getTime()-parseDate("'+condition.conditionValue+'", "'+column.format+'").getTime())<0';
					}
					// number
					if(!(_value instanceof Date)&&!isNaN(_value)){
						rules += '(parseFloat('+value+')-parseFloat("'+condition.conditionValue+'"))<0';
					}
					// default
					if(!(_value instanceof Date)&&isNaN(_value)){
						rules += ''+value+'.localeCompare("'+condition.conditionValue+'")<0';
					}
				}
				if(condition.conditionType=='8'){
					var _value = data[condition.conditionField];
					// date
					if(_value instanceof Date){
						rules += '('+value+'.getTime()-parseDate("'+condition.conditionValue+'", "'+column.format+'").getTime())<=0';
					}
					// number
					if(!(_value instanceof Date)&&!isNaN(_value)){
						rules += '(parseFloat('+value+')-parseFloat("'+condition.conditionValue+'"))<=0';
					}
					// default
					if(!(_value instanceof Date)&&isNaN(_value)){
						rules += ''+value+'.localeCompare("'+condition.conditionValue+'")<=0';
					}
				}
				if(condition.conditionType=='9'){
					rules += '!'+value+'';
				}
				if(condition.conditionType=='10'){
					rules += value;
				}
				// right parentheses
				rules += condition.rightParentheses;
				// logic
				if(condition.conditionLogic=='0') rules+='&&';
				if(condition.conditionLogic=='1') rules+='||';
			}
			// eval rules
			try{
				if(rules)
					show = eval(rules);
			}catch(e){
				state.option.message({message:state.language.errors.data_load_error, type:'error'});
				console.error(e);
				break;
			}
		}
		// if not show continue
		if(!show){
			continue;
		}
		// set index
		data._index_ = i;
		// data push
		rdatas.push(data);
	}
	// return
	return rdatas;
}

/**
 * sort datas
 * @param datas
 * @return sort datas
 */
const sortDatas = (datas) => {
	// defined result datas
	let rdatas = [];
	// has sorts
	if(state.query.params.advance&&state.query.params.advance.sorts&&state.query.params.advance.sorts.length>0){
		// get sort
		let sorts = state.query.params.advance.sorts;
		// sort
		rdatas = datas.sort(function(record1, record2){
			// for each sorts
			for(let i=0; i<sorts.length; i++){
				// get sort
				const sort = sorts[i];
				// column
				const column = state.column[sort.sortField];
				// get record
				const value1 = column&&column.info?record1.info[sort.sortField]:record1[sort.sortField];
				const value2 = column&&column.info?record2.info[sort.sortField]:record2[sort.sortField];
				// equals
				if(value1==value2){
					continue;
				}
				// number
				if(!isNaN(value1)&&!isNaN(value2)){
					if(sort.sortLogic=='1') return value1-value2;
					if(sort.sortLogic=='2') return value2-value1;
				}
				// date
				if(value1 instanceof Date&&value2 instanceof Date){
					if(sort.sortLogic=='1') return value1.getTime()-value2.getTime();
					if(sort.sortLogic=='2') return value2.getTime()-value1.getTime();
				}
				// default
				if(value1!=null&&sort.sortLogic=='1') return value1.localeCompare(value2);
				if(value2!=null&&sort.sortLogic=='2') return value2.localeCompare(value1);
			}
			return 0;
		});
	}else{
		rdatas = datas;
	}
	// return
	return rdatas;
}

/**
 * data formatter
 * @param row
 * @param column
 * @param value
 * @param index
 * @return value
 */
const dataFormatter = (row, column, value, index) => {
	// get column
	const _column = state.column[column.property||column.id];
	// clean
	value = value===undefined||value===null?'':value;
	// info
	if(_column.info) value=row.info[_column.prop?_column.prop:_column.id];
	// dict
	if(_column.dict) value=_column.dict[value];
	// encode
	if(_column.encode) value=tool.htmlEncode(value);
	// decode
	if(_column.decode) value=tool.htmlDecode(value);
	// format
	if(_column.format){
		// number
		if(_column.dataType=='number') value=tool.formatNumber(value, _column.format);
		// date
		if(_column.dataType=='date') value=tool.formatDate(value, _column.format);
	}
	// clean
	value = value===undefined||value===null?'':value;
	// formatter
	if(_column.formatter){
		try{
			value = _column.formatter(row, _column, value, index);
		}catch(error){
			console.error(error);
		}
	}
	// return
	return value;
}

/**
 * append column
 * @param column
 */
const appendColumn = (column) => {
	// push columns
	state.columns.push(column);
	// set column
	state.column[column.id] = column;
}

/**
 * size change
 * @param size
 */
const sizeChange = (size) => {
	// change page size
	state.query.page.size = size;
	// load
	load();
}

/**
 * current change
 * @param current
 */
const currentChange = (current) => {
	// change current page
	state.query.page.current = current;
	// load
	load();
}

/**
 * open fast query
 */
const openFastQuery = () => {
	state.show.fast = true;
}

/**
 * open advance query
 */
const openAdvanceQuery = () => {
	state.show.advance = true;
}

/**
 * open export
 */
const openExport = () => {
	state.show['export'] = true;
}

/**
 * open print
 */
const openPrint = () => {
	state.show.print = true;
}

/**
 * fast query
 * @param params
 */
const fastQuery = (params) => {
	// set params
	state.query.params.fast = params;
	// close fast query
	state.show.fast = false;
	// load
	load();
}

/**
 * advance query
 * @param advance
 */
const advanceQuery = (advance) => {
	// set condition list
	state.query.params.advance.conditions = advance.conditionList;
	// set sort list
	state.query.params.advance.sorts = advance.sortList;
	// close advance query
	state.show.advance = false;
	// load
	load();
}

/**
 * print
 * @param printColumns
 */
const print = (printColumns) => {
	// defined properties
	let properties = [];
	// set properties
	printColumns.forEach((column, index)=>{
		properties.push({field:column.id, displayName:column.label, columnSize:column.width});
	});
	// get base datas
	let baseDatas = [];
	if(props.tree){
		const mergeDatas = function(datas, childrenField){
			let _datas = [];
			datas.forEach(data=>{
				_datas.push(data);
				if(data[childrenField]&&data[childrenField].length>0){
					_datas = _datas.concat(mergeDatas(data[childrenField], childrenField));
				}
			});
			return _datas;
		}
		baseDatas = mergeDatas(state.datas.exhibit, props.treeProps.children);
	}else{
		baseDatas = state.datas.exhibit.concat([]);
	}
	// defained datas
	let datas = [];
	// construct datas
	baseDatas.forEach((data, index)=>{
		let _data = {};
		printColumns.forEach(column=>{
			let value = column&&column.info?data.info[column.id]:data[column.id];
			_data[column.id] = props.dataFormatter(data, column, value, index);
		});
		datas.push(_data);
	});
	// construct header
	let header = '';
	header += '<div style="display:flex;flex-direction:column;text-align:center;">';
	header += '	<h3 style="font-size:18px;line-height:24px;">'+props.title+'</h3>';
	header += '	<p style="font-size:14px;line-height:24px;color:#999;">'+tool.formatDate(new Date(), 'yyyy/M/d hh:mm')+'</p>';
	header += '</div>';
	// print
	printJS({
	printable: datas,
	header: header,
	properties: properties,
	type: 'json',
	gridHeaderStyle: 'font-size:12px;border:1px solid #000;text-align:center;color:#333;',
	gridStyle: 'border:1px solid #000;text-align:center;font-size:12px;color:#666;'
});
}

/**
 * export
 * @param exportColumns
 * @param exportType
 * @param exportAllData
 */
const _export = (exportColumns, exportType, exportAllData) => {
	// loading
	state.loading = true;
	// if ajax data
	if(!props.data&&!props.once&&!props.tree){
		// construct data
		let data = {};
		data.current = state.query.page.current;
		data.size = state.query.page.size;
		data.searchQueryParameters = state.query.params.search;
		data.fastQueryParameters = state.query.params.fast;
		data.advanceQueryConditions = state.query.params.advance.conditions;
		data.advanceQuerySorts = state.query.params.advance.sorts;
		data['export'] = true;
		data.exportType = exportType;
		data.exportFileName = props.title;
		data.exportColumns = exportColumns;
		data.exportAllData = exportAllData;
		// export
		state.option.request({url:props.url, method:'post', headers:{'x-original-resolve':'1'}, data:data, responseType:'blob'}).then((resolve)=>{
			// loading
			state.loading = false;
			// desposition
			let desposition = resolve.headers['content-desposition'];
			// error
			if(!resolve){
				// message
				state.option.message({message:state.language.errors.data_export_error, type:'error'});
				// return
				return;
			}
			// resolve
			if (resolve && resolve.status === 200 && resolve.data) {
                const { data, headers } = resolve;
                let fileName;
                if (headers['content-disposition']) {
                    fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1');
                } else {
                    fileName = data.fileName;
                }
                // set blob
                const blob = new Blob([data], { type: headers['content-type'] });
                const dom = document.createElement('a');
                const downUrl = window.URL.createObjectURL(blob);
                dom.href = downUrl;
                dom.download = decodeURIComponent(fileName);
                dom.style.display = 'none';
                document.body.appendChild(dom);
                dom.click();
                dom.parentNode.removeChild(dom);
                window.URL.revokeObjectURL(downUrl);
            } else {
				// message
				state.option.message({message:state.language.errors.data_export_error, type:'error'});
				// log
				console.error(resolve.message);
				// return
				return;
            }
		}).catch((err)=>{
			console.log(123123);
			// loading
			state.loading = false;
			// message
			state.option.message({message:state.language.errors.data_export_error, type:'error'});
			// log
			console.error(err);
		});
	}else{
		// construct data
		let data = {};
		data.current = state.query.page.current;
		data.size = state.query.page.size;
		data['export'] = true;
		data.exportType = exportType;
		data.exportFileName = props.title;
		data.exportColumns = exportColumns;
		// construct datas
		let datas = [];
		let baseDatas = exportAllData?state.datas.filter:state.datas.pager;
		if(props.tree){
			const mergeDatas = function(datas, childrenField){
				let _datas = [];
				datas.forEach(data=>{
					_datas.push(data);
					if(data[childrenField]&&data[childrenField].length>0){
						_datas = _datas.concat(mergeDatas(data[childrenField], childrenField));
					}
				});
				return _datas;
			}
			baseDatas = mergeDatas(baseDatas, props.treeProps.children);
		}
		baseDatas.forEach((data, index)=>{
			let _data = {};
			exportColumns.forEach(column=>{
				let value = column&&column.info?data.info[column.id]:data[column.id];
				_data[column.id] = props.dataFormatter(data, column, value, index);
			});
			datas.push(_data);
		});
		data.exportDatas = baseDatas;
		// export
		state.option.request({url:props.server+'/export', method:'post', headers:{'x-resolve':'1'}, data:data, responseType:'blob'}).then((resolve)=>{
			// loading
			state.loading = false;
			// desposition
			let desposition = resolve.headers['content-desposition'];
			// error
			if(!resolve){
				// message
				state.option.message({message:state.language.errors.data_export_error, type:'error'});
				// return
				return;
			}
			// resolve
			if (resolve && resolve.status === 200 && resolve.data) {
                const { data, headers } = resolve;
                let fileName;
                if (headers['content-disposition']) {
                    fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1');
                } else {
                    fileName = data.fileName;
                }
                // set blob
                const blob = new Blob([data], { type: headers['content-type'] });
                const dom = document.createElement('a');
                const downUrl = window.URL.createObjectURL(blob);
                dom.href = downUrl;
                dom.download = decodeURIComponent(fileName);
                dom.style.display = 'none';
                document.body.appendChild(dom);
                dom.click();
                dom.parentNode.removeChild(dom);
                window.URL.revokeObjectURL(downUrl);
            } else {
				// message
				state.option.message({message:state.language.errors.data_export_error, type:'error'});
				// log
				console.error(resolve.message);
				// return
				return;
            }
		}).catch((err)=>{
			// loading
			state.loading = false;
			// message
			state.option.message({message:state.language.errors.data_export_error, type:'error'});
			// log
			console.error(err);
		});
	}
}

/**
 * handle tree load
 * @param row
 * @param node
 * @param resolve
 */
const handleTreeLoad = (row, node, resolve) => {
	// custom
	if(props.treeLoad){
		props.treeLoad(row, node, resolve);
		return;
	}
	// set key
	let key = (typeof props.rowKey==='function'?props.rowKey(row):row[props.rowKey]);
	// load data
	state.option.request({url:props.url, method:'post', headers:{'x-resolve':'1'}, data:{'$sw-tree-load-key':key}}).then(handler=>{
		// handler
		if(!handler.data.result){
			// message
			state.option.message({message:handler.data.message, type:'error'});
			// resolve
			resolve([]);
			return;
		}
		// set data
		let datas = handler.data.data.datas;
		// clean datas
		datas = cleanDatas(datas);
		// filter datas
		datas = filterDatas(datas);
		// sort datas
		datas = sortDatas(datas);
		// datas render
		if(props.datasRender)
			datas = props.datasRender(datas);
		// resolve
		resolve(datas);
	}).catch((err)=>{
		// message
		state.option.message({message:'error', type:'error'});
		// resolve
		resolve([]);
	});
}

/**
 * handle span method
 * @param row
 * @param node
 * @param resolve
 */
const handleSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
	// custom
	if(props.spanMethod){
		props.spanMethod({ row, column, rowIndex, columnIndex });
		return;
	}
	// resolve merge
	if(column.property&&state.column[column.property]&&state.column[column.property].merge!==false){
		// get up equal
		let uequal = false;
		if(rowIndex==0){
			uequal = false;
		}else{
			let cdata = state.datas.pager[rowIndex];
			let udata = state.datas.pager[rowIndex-1];
			if(state.column[column.property].merge===true){
				uequal = cdata[column.property]==udata[column.property];
			}else{
				uequal = cdata[column.property]==udata[column.property];
				if(uequal){
					for(let i=0; i<state.column[column.property].merge.length; i++){
						let condition = state.column[column.property].merge[i];
						uequal = cdata[condition]==udata[condition];
						if(!uequal){
							break;
						}
					}
				}
			}
		}
		// if up equal then 0 0
		if(uequal){
			return {rowspan:0, colspan:0};
		}
		// defined rowspan
		let rowspan = 1;
		// get cdata
		let cdata = state.datas.pager[rowIndex];
		for(let i=rowIndex+1; i<state.datas.pager.length; i++){
			let ddata = state.datas.pager[i];
			let dequal = false;
			if(state.column[column.property].merge===true){
				dequal = cdata[column.property]==ddata[column.property];
			}else{
				dequal = cdata[column.property]==ddata[column.property];
				if(dequal){
					for(let j=0; j<state.column[column.property].merge.length; j++){
						let condition = state.column[column.property].merge[j];
						dequal = cdata[condition]==ddata[condition];
						if(!dequal){
							break;
						}
					}
				}
			}
			if(dequal){
				rowspan++;
			}else{
				break;
			}
		}
		// return
		return {rowspan:rowspan, colspan:1};
	}
}

/**
 * get max length
 * @param datas
 * @return max length
 */
const getMaxLength = (datas) => {
	return datas.reduce((length, current)=>{
		if (current) {
			let len = this.getTextWidth(current);
			if (length<len) {
				length = len;
			}
		}
		return length;
	}, 0);
}

/**
 * get text width
 * @param content
 */
const getTextWidth = (content) => {
	let width = 0;
	let html = document.createElement('span');
	html.innerText = content;
	html.className = 'getTextWidth';
	document.querySelector('body').appendChild(html);
	width = document.querySelector('.getTextWidth').offsetWidth;
	document.querySelector('.getTextWidth').remove();
	return width;
}

// el grid event
const select = (selection, row) => { if(instance.attrs.onSelect) instance.attrs.onSelect(selection, row); }
const selectAll = (selection) => { if(instance.attrs.onSelectAll) instance.attrs.onSelectAll(selection); }
const selectionChange = (selection) => { if(instance.attrs.onSelectionChange) instance.attrs.onSelectionChange(selection); }
const cellMouseEnter = (row, column, cell, event) => { if(instance.attrs.onCellMouseEnter) instance.attrs.onCellMouseEnter(row, column, cell, event); }
const cellMouseLeave = (row, column, cell, event) => { if(instance.attrs.onCellMouseLeave) instance.attrs.onCellMouseLeave(row, column, cell, event); }
const cellClick = (row, column, cell, event) => { if(instance.attrs.onCellClick) instance.attrs.onCellClick(row, column, cell, event); }
const cellDblclick = (row, column, cell, event) => { if(instance.attrs.onCellDblclick) instance.attrs.onCellDblclick(row, column, cell, event); }
const rowClick = (row, column, event) => {
	if(props.rowClickSelection){
		const selection = grid.value.getSelectionRows();
		grid.value.toggleRowSelection(row, !(selection&&selection.length>0&&selection.find(_row=>_row==row)));
	}
	if(instance.attrs.onRowClick) 
		instance.attrs.onRowClick(row, column, event);
}
const rowContextmenu = (row, column, event) => { if(instance.attrs.onRowContextmenu) instance.attrs.onRowContextmenu(row, column, event); }
const rowDblclick = (row, column, event) => { if(instance.attrs.onRowDblclick) instance.attrs.onRowDblclick(row, column, event); }
const headerClick = (column, event) => { if(instance.attrs.onHeaderClick) instance.attrs.onHeaderClick(column, event); }
const headerContextmenu = (column, event) => { if(instance.attrs.onHeaderContextmenu) instance.attrs.onHeaderContextmenu(column, event); }
const sortChange = ({ column, prop, order }) => { if(instance.attrs.onSortChange) instance.attrs.onSortChange({ column, prop, order }); }
const filterChange = (filters) => { if(instance.attrs.onFilterChange) instance.attrs.onFilterChange(filters); }
const currentRowChange = (currentRow, oldCurrentRow) => { if(instance.attrs.onCurrentRowChange) instance.attrs.onCurrentRowChange(currentRow, oldCurrentRow); }
const headerDragend = (newWidth, oldWidth, column, event) => { if(instance.attrs.onHeaderDragend) instance.attrs.onHeaderDragend(newWidth, oldWidth, column, event); }
const expandChange = (row, expandedRows) => { if(instance.attrs.onExpandChange) instance.attrs.onExpandChange(row, expandedRows); }
// el grid methods
const clearSelection = () => { grid.value.clearSelection(); }
const toggleRowSelection = (row, selected) => { grid.value.toggleRowSelection(row, selected); }
const toggleAllSelection = () => { grid.value.toggleAllSelection(); }
const toggleRowExpansion = (row, expanded) => { grid.value.toggleRowExpansion(row, expanded); }
const setCurrentRow = (row) => { grid.value.setCurrentRow(row); }
const clearSort = () => { grid.value.clearSort(); }
const clearFilter = (columnKey) => { grid.value.clearFilter(columnKey); }
const doLayout = () => { grid.value.doLayout(); }
const sort = (prop, order) => { grid.value.sort(prop, order); }

// watch
watch(()=>state.datas.exhibit, (newValue, oldValue)=>{
	// for each columns
	for(let i=0; i<state.columns.length; i++){
		// get column
		const column = state.columns[i];
		// if not fit
		if(!column.fit){
			continue;
		}
		// get elements
		const elements = datas.map(data=>props.dataFormatter(data, column, data[column.id], i));
		// push header ( sortable )
        elements.push(column.label+(column.sortable?'st':''));
		// get width
        let width = state.getMaxLength(elements) + 20;
		// less then min
        if(width<column.min) width = column.min;
		// greate then max
        if(width>column.max) width = column.max;
		// set width
		column.changeWidth(width);
	}
}, {deep: true})
	
// init
init();

// provide
provide('dataFormatter', dataFormatter)
provide('appendColumn', appendColumn)
provide('fastQuery', fastQuery)
provide('advanceQuery', advanceQuery)
provide('print', print)
provide('_export', _export)

// expose
defineExpose({
	datas:state.datas, query:state.query,
	load, clearSelection, toggleRowSelection, toggleAllSelection, toggleRowExpansion, setCurrentRow, clearSort, clearFilter, doLayout, sort
})
</script>

<style>
/** grid tool bar */
.grid-toolbar-container{text-align:right;padding:4px 8px 4px 0;}
.grid-toolbar-operations{float:left;}
.grid-toolbar-operations button{float:left;margin-right:2px;}
.el-table--border::before{color:red;;}
</style>