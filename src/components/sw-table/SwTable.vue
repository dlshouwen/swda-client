<template>
	<!-- sw table container -->
	<div class="sw-table-container">
		<!-- table -->
		<div class="table-container" ref="tableContainerRef">
			<!-- el table -->
			<el-table ref="tableRef" v-bind="$attrs" 
				:height="state.height" :stripe="props.stripe" :border="props.border" 
				:highlightCurrentRow="props.highlightCurrentRow" :spanMethod="handleSpanMethod" :load="handleTreeLoad" 
				:data="state.datas.exhibit">
				<slot></slot>
			</el-table>
		</div>
		<!-- toolbar -->
		<div class="toolbar-container" ref="toolbarRef">
			<!-- tool -->
			<div class="tool" v-if="state.option.tools">
				<el-button v-if="state.option.tools.includes('refresh')" type="default" :title="$t('table.toolbar.refresh.title')" @click="load">
					<sw-icon v-if="state.option.tool.icon" :icon="$t('table.toolbar.refresh.icon')"></sw-icon>
					<span v-if="state.option.tool.label">{{$t('table.toolbar.refresh.label')}}</span>
				</el-button>
				<el-button v-if="state.option.tools.includes('fast')" type="default" :title="$t('table.toolbar.fast.title')" @click="openFastQuery"> 
					<sw-icon v-if="state.option.tool.icon" :icon="$t('table.toolbar.fast.icon')"></sw-icon>
					<span v-if="state.option.tool.label">{{$t('table.toolbar.fast.label')}}</span>
				</el-button>
				<el-button v-if="state.option.tools.includes('advance')" type="default" :title="$t('table.toolbar.advance.title')" @click="openAdvanceQuery"> 
					<sw-icon v-if="state.option.tool.icon" :icon="$t('table.toolbar.advance.icon')"></sw-icon>
					<span v-if="state.option.tool.label">{{$t('table.toolbar.advance.label')}}</span>
				</el-button>
				<el-button v-if="state.option.tools.includes('print')" type="default" :title="$t('table.toolbar.print.title')" @click="openPrint"> 
					<sw-icon v-if="state.option.tool.icon" :icon="$t('table.toolbar.print.icon')"></sw-icon>
					<span v-if="state.option.tool.label">{{$t('table.toolbar.print.label')}}</span>
				</el-button>
				<el-button v-if="state.option.tools.includes('export')" type="default" :title="$t('table.toolbar.export.title')" @click="openExport"> 
					<sw-icon v-if="state.option.tool.icon" :icon="$t('table.toolbar.export.icon')"></sw-icon>
					<span v-if="state.option.tool.label">{{$t('table.toolbar.export.label')}}</span>
				</el-button>
			</div>
			<!-- pagination -->
			<div class="pagination">
				<!-- el-pagination -->
				<el-pagination v-model:current-page="state.query.page.current" v-model:page-size="state.query.page.size" :total="state.total" 
					:page-sizes="state.option.sizes" :layout="state.option.layout" 
					@size-change="load" @current-change="load" />
			</div>
		</div>
	</div>
	<!-- fast query dialog -->
	<el-dialog width="520px" v-model="state.visible.fast">
		<template #header><sw-icon :icon="$t('table.fast.title.icon')"></sw-icon> {{t('table.fast.title.text')}}</template>
		<FastQuery :columns="state.columns" :params="state.query.params.fast" @callback="fastQuery"></FastQuery>
	</el-dialog>
	<!-- advance query dialog -->
	<el-dialog width="1280px" v-model="state.visible.advance">
		<template #header><sw-icon :icon="$t('table.advance.title.icon')"></sw-icon> {{t('table.advance.title.text')}}</template>
		<AdvanceQuery :columns="state.columns" :column="state.column" :id="state.id" :advance="state.query.params.advance" @callback="advanceQuery"></AdvanceQuery>
	</el-dialog>
	<!-- advance print dialog -->
	<el-dialog width="520px" v-model="state.visible.print">
		<template #header><sw-icon :icon="$t('table.print.title.icon')"></sw-icon> {{t('table.print.title.text')}}</template>
		<Print :columns="state.columns" @callback="print"></Print>
	</el-dialog>
	<!-- advance export dialog -->
	<el-dialog width="520px" v-model="state.visible.export">
		<template #header><sw-icon :icon="$t('table.export.title.icon')"></sw-icon> {{t('table.export.title.text')}}</template>
		<Export :columns="state.columns" @callback="_export"></Export>
	</el-dialog>
</template>

<style lang="scss" scope>
.sw-table-container{
	
	flex:1;display:flex;flex-direction:column;
	
	.table-container{ 
		
		flex:1;
		
	}
	
	.toolbar-container{ 
		
		display:flex;padding:8px;width:100%;
		
		.tool{display:flex;align-items:left;flex:1;}
		
		.pagination{display:flex;align-items:right;}
		
	}
	
}
</style>

<script setup lang="ts" name="SwTable">
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue elements
import { ref, reactive, useAttrs, provide, computed, onMounted, getCurrentInstance } from 'vue'

// import request
import request from '@/utils/request'

// import print js
import printJS from 'print-js';

// import element plus elements
import { ElMessage, ElNotification } from 'element-plus'

// import tools
import { parseDate, formatDate, formatSeconds, formatFileSize, formatNumber, htmlEncode, htmlDecode } from '@/utils/tools'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// const attrs
const attrs = useAttrs()

// import vue i18n
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// import components
import FastQuery from './extend/FastQuery.vue'
import AdvanceQuery from './extend/AdvanceQuery.vue'
import Print from './extend/Print.vue'
import Export from './extend/Export.vue'

// define props
const props = defineProps({
	// id
	id: { type:String, required:false },
	// title
	title: { type:String, required:false, default: ()=>'数据' },
	// url
	url: { type:String, required:false, default: ()=>'' },
	// once
	once: { type:Boolean, required:false, default: ()=>false },
	// params
	params: { type:Object, required:false },
	// search
	search: { type:Object, required:false, default: ()=>{ return {} } },
	// sizes
	sizes: { type:Array, required:false, default: ()=>[50, 100, 500, 1000] },
	// layout
	layout: { type:String, required:false, default: ()=>'total, sizes, prev, pager, next, jumper' },
	// tools
	tools: { type:[Array, Boolean], required: false, default: ()=>['refresh', 'fast', 'advance', 'print', 'export']},
	// tool icon
	toolIcon: { type:Boolean, required: false, default: ()=>true },
	// tool label
	toolLabel: { type:Boolean, required: false, default: ()=>true },
	// data
	data: { type:Array, required:false },
	// height
	height: { type:[String, Number], required:false },
	// stripe: false -> true
	stripe: { type:Boolean, required:false, default: ()=>true },
	// border: false -> true
	border: { type:Boolean, required:false, default: ()=>true },
	// highlight-current-row: false -> true
	highlightCurrentRow: { type:Boolean, required:false, default: ()=>true },
	// span-method
	spanMethod: { type:Function, required:false },
	// tree
	tree: { type:Boolean, required:false, default: ()=>false },
	// tree top value
	treeTopValue: { required:false, default: ()=>null },
	// tree load
	treeLoad: { type:Function, required:false },
	// render datas
	renderDatas: { type:Function, required:false },
})

// instance
const instance = getCurrentInstance()

// const state
const state = reactive({
	// id
	id: props.id?props.id:(window.location.href+'/vnode:'+instance.uid),
	// option
	option: {
		// sizes
		sizes: props.sizes,
		// layout
		layout: props.layout,
		// tools
		tools: props.tools,
		// tool
		tool: { icon:props.toolIcon, label:props.toolLabel },
	},
	// height
	height: null,
	// columns
	columns: [],
	// column
	column: {},
	// query
	query: {
		// page
		page: { current: 1, size: 50 },
		// params
		params: { fast: {}, advance: { conditions:[], sorts:[] } }
	},
	// datas
	datas: { origin:[], clean:[], filter:[], render:[], pager:[], exhibit:[] },
	// total
	total: 0,
	// init
	init: false,
	// loading
	loading: false,
	// visible
	visible: { fast: false, advance: false, print: false, export: false },
})

/**
 * append column
 * @param column
 */
const appendColumn = (column)=>{
	// push column
	state.columns.push(column)
	// set column
	state.column[column.prop] = column
}

// provide
provide('appendColumn', appendColumn)

/**
 * load
 */
const load = async () => {
	// set loading
	state.loading = true
	// has data
	if(props.data) {
		// not init
		if(!state.init) {
			// set origin
			state.datas.origin = props.data
			// set init
			state.init = true
		}
	}
	// has url
	if(props.url) {
		// once & not init
		if((props.once || props.tree) && !state.init) {
			// try catch
			try{
				// defined data
				let handle = null
				// tree
				if(props.tree)
					handle = await request.post(props.url, { key:props.treeTopValue })
				else
					handle = await request.post(props.url)
				// set origin
				state.datas.origin = handle.data
				// set init
				state.init = true
			}catch(e){
				// error
				ElNotification({ title: '警告', message: `数据获取出现错误，请稍后重试。`, type: 'warning' })
			}
		}
		// not once
		if(!props.once && !props.tree) {
			// try catch
			try{
				// defined query
				let query = {}
				// set page
				query.page = { current: state.query.page.current,  size: state.query.page.size }
				// set params
				query.parameters = props.params;
				// set search
				query.searchQueryParameters = props.search;
				// set fast
				query.fastQueryParameters = state.query.params.fast;
				// set advance
				query.advanceQueryConditions = state.query.params.advance.conditions;
				query.advanceQuerySorts = state.query.params.advance.sorts;
				// get data
				let { data } = await request.post(props.url, query)
				// set origin
				state.datas.origin = data.datas
				// set total
				state.total = data.total
			}catch(e){
				// error
				ElNotification({ title: '警告', message: `数据获取出现错误，请稍后重试。`, type: 'warning' })
			}
		}
	}
	// reset origin
	state.datas.origin = state.datas.origin||[]
	// handle datas
	handleDatas()
}

/**
 * handle datas
 * @param datas
 */
const handleDatas = () => {
	// filter datas
	if(props.data || props.once) {
		// filter datas
		state.datas.filter = filterDatas(state.datas.origin.concat([]))
	}else{
		// set origin datas to filter datas
		state.datas.filter = state.datas.origin.concat([])
	}
	// sort datas
	if(props.data || props.once) {
		// sort datas
		state.datas.sort = sortDatas(state.datas.filter.concat([]))
	}else{
		// set filter datas to sort datas
		state.datas.sort = state.datas.filter.concat([])
	}
	// render
	if(props.renderDatas){
		// render datas
		state.datas.render = props.renderDatas(state.datas.sort.concat([]))
	}else{
		// set sort datas to render datas
		state.datas.render = state.datas.sort.concat([])
	}
	// pager datas
	if(props.data || props.once){
		// set total
		state.total = state.datas.render.length;
		// pager datas
		state.datas.pager = state.datas.render.concat([]).splice((state.query.page.current-1)*state.query.page.size, state.query.page.size);
	}else{
		// set pager datas
		state.datas.pager = state.datas.render;
	}
	// exhibit datas
	 state.datas.exhibit = state.datas.pager;
}

/**
 * filter datas
 * @param datas
 * @return filter datas
 */
const filterDatas = (datas: any[]) => {
	// defined params
	let params = { ...props.search, ...state.query.params.fast }
	// defined advance
	let advance = ''
	// advance query condition
	if(state.query.params.advance&&state.query.params.advance.conditions&&state.query.params.advance.conditions.length>0){
		// get conditions
		let conditions = state.query.params.advance.conditions;
		// for each condition
		for(let i=0; i<conditions.length; i++){
			// get condition
			let condition = conditions[i];
			// column
			const column = state.column[condition.conditionField];
			// value
			const value = 'data["'+condition.conditionField+'"]';
			// left parentheses
			advance += condition.leftParentheses;
			// rule
			if(condition.conditionType=='0'){
				advance += value+'=="'+condition.conditionValue+'"';
			}
			if(condition.conditionType=='1'){
				advance += value+'!="'+condition.conditionValue+'"';
			}
			if(condition.conditionType=='2'){
				advance += value+'.indexOf("'+condition.conditionValue+'")!=-1';
			}
			if(condition.conditionType=='3'){
				advance += 'startsWith('+value+', "'+condition.conditionValue+'")';
			}
			if(condition.conditionType=='4'){
				advance += 'endsWith('+value+', "'+condition.conditionValue+'")';
			}
			if(condition.conditionType=='5'){
				advance += 'compareData('+value+', "'+condition.conditionValue+'", "gt")';
			}
			if(condition.conditionType=='6'){
				advance += 'compareData('+value+', "'+condition.conditionValue+'", "ge")';
			}
			if(condition.conditionType=='7'){
				advance += 'compareData('+value+', "'+condition.conditionValue+'", "lt")';
			}
			if(condition.conditionType=='8'){
				advance += 'compareData('+value+', "'+condition.conditionValue+'", "le")';
			}
			if(condition.conditionType=='9'){
				advance += value+'===null';
			}
			if(condition.conditionType=='10'){
				advance += value+'!==null';
			}
			// right parentheses
			advance += condition.rightParentheses;
			// logic
			if(condition.conditionLogic=='0') advance+='&&';
			if(condition.conditionLogic=='1') advance+='||';
		}
	}
	// filter
	datas = datas.filter(data => {
		// get keys
		const keys = Object.keys(params);
		// for each key
		for (let i = 0; i < keys.length; i++) {
			// get key, value
			const key = keys[i]
			const value = params[key]
			// empty continue
			if(!key || !value){
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
			const content = data[id];
			// equals
			if(prefix=='eq' && content!=value) return false
			// not equals
			if(prefix=='ne' && content==value) return false
			// like
			if(prefix=='lk' && ( content==undefined || content.indexOf(value)==-1 ) ) return false
			// left like
			if(prefix=='ll' && !startsWith(content, value) ) return false
			// right like
			if(prefix=='rl' && !endsWith(content, value) ) return false
			// is null
			if(prefix=='in' && value!==null ) return false
			// is not null
			if(prefix=='inn' && value===null ) return false
			// great than
			if(prefix=='gt'){
				// date
				if(content instanceof Date){
					if((content.getTime()-parseDate(value, state.column[key.replace('gt_', '')].format).getTime())<=0){
						return false
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))<=0){
						return false
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(content)){
					if(content.localeCompare(value)<=0){
						return false
					}
				}
			}
			// great than equals
			if(prefix=='ge'){
				// date
				if(content instanceof Date){
					if((content.getTime()-parseDate(value, state.column[key.replace('ge_', '')].format).getTime())<0){
						return false
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))<0){
						return false
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(value)){
					if(content.localeCompare(value)<0){
						return false
					}
				}
			}
			// less than
			if(prefix=='lt'){
				// date
				if(content instanceof Date){
					if((content.getTime()-parseDate(value, state.column[key.replace('lt_', '')].format).getTime())>=0){
						return false
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))>=0){
						return false
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(content)){
					if(content.localeCompare(value)>=0){
						return false
					}
				}
			}
			// less than equals
			if(prefix=='le'){
				// date
				if(content instanceof Date){
					if((content.getTime()-parseDate(value, state.column[key.replace('le_', '')]).getTime())>0){
						return false
					}
				}
				// number
				if(!(content instanceof Date)&&!isNaN(content)){
					if((parseFloat(content) - parseFloat(value))>0){
						return false
					}
				}
				// default
				if(!(content instanceof Date)&&isNaN(content)){
					if(content.localeCompare(value)>0){
						return false
					}
				}
			}
		}
		// advance
		try{
			if(advance)
				return eval(advance);
		}catch(e){
			// error
			ElNotification({ title: '警告', message: `数据获取出现错误，请稍后重试。`, type: 'warning' })
		}
		// return
		return true
	})
	// return
	return datas;
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
 * refresh
 * @param reload
 */
const refresh = (reload?:boolean=false) => {
	// if reload
	if(reload){
		// set not init
		state.init = false
	}
	// load
	load()
}

/**
 * open fast query
 */
const openFastQuery = () => {
	// set fast visible
	state.visible.fast = true
}

/**
 * fast query
 */
const fastQuery = (params: object) => {
	// set fast visible
	state.visible.fast = false
	// set fast params
	state.query.params.fast = params
	// load
	load()
}

/**
 * open advance query
 */
const openAdvanceQuery = () => {
	// set advance visible
	state.visible.advance = true;
}

/**
 * advance query
 */
const advanceQuery = (advance) => {
	// set advance visible
	state.visible.advance = false
	// set advance conditions
	state.query.params.advance.conditions = advance.conditionList
	// set advance sorts
	state.query.params.advance.sorts = advance.sortList
	// load
	load()
}

/**
 * open export
 */
const openExport = () => {
	// set export visible
	state.visible.export = true;
}

/**
 * export
 * @param exportColumns
 * @param exportType
 * @param exportAllData
 */
const _export = (exportColumns, exportType, exportAllData) => {
	 // set export visible
	 state.visible.export = false;
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
		request.post(props.url, data, { responseType:'blob' }).then((resolve)=>{
			// loading
			state.loading = false;
			// desposition
			let desposition = resolve.headers['content-desposition'];
			// error
			if(!resolve){
				// message
				ElMssage({message:t('table.errors.data_export_error'), type:'error'});
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
				ElMssage({message:t('table.errors.data_export_error'), type:'error'});
				// log
				console.error(resolve.message);
				// return
				return;
            }
		}).catch((err)=>{
			// loading
			state.loading = false;
			// message
			ElMssage({message:t('table.errors.data_export_error'), type:'error'});
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
		request('/export', data, {responseType:'blob'}).then((resolve)=>{
			// loading
			state.loading = false;
			// desposition
			let desposition = resolve.headers['content-desposition'];
			// error
			if(!resolve){
				// message
				ElMssage({message:t('table.errors.data_export_error'), type:'error'});
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
				ElMssage({message:t('table.errors.data_export_error'), type:'error'});
				// log
				console.error(resolve.message);
				// return
				return;
            }
		}).catch((err)=>{
			// loading
			state.loading = false;
			// message
			ElMssage({message:t('table.errors.data_export_error'), type:'error'});
			// log
			console.error(err);
		});
	}
}

/**
 * open print
 */
const openPrint = () => {
	// set print visible
	state.visible.print = true;
}

/**
 * print
 */
const print = (columns) => {
	// set print visible
	state.visible.print = false
	// defined properties
	let properties = []
	// set properties
	columns.forEach((column, index)=>{
		properties.push({field:column.prop, displayName:column.label, columnSize:column.width})
	})
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
		baseDatas = mergeDatas(state.datas.exhibit, attrs.treeProps.children);
	}else{
		baseDatas = state.datas.exhibit.concat([]);
	}
	// defained datas
	let datas = [];
	// construct datas
	baseDatas.forEach((data, index)=>{
		let _data = {};
		columns.forEach(column=>{
			let value = column&&column.info?data.info[column.prop]:data[column.prop];
			_data[column.prop] = dataFormatter(data, column, value, index);
		});
		datas.push(_data);
	});
	// construct header
	let header = '';
	header += '<div style="display:flex;flex-direction:column;text-align:center;">';
	header += '	<h3 style="font-size:18px;line-height:24px;">'+props.title+'</h3>';
	header += '	<p style="font-size:14px;line-height:24px;color:#999;">'+formatDate(new Date(), 'yyyy/M/d hh:mm')+'</p>';
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
 * handle span method
 * @param row
 * @param node
 * @param resolve
 */
const handleSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
	// custom
	if(attrs.spanMethod){
		attrs.spanMethod({ row, column, rowIndex, columnIndex })
		return
	}
	// resolve merge
	if(column.property&&state.column[column.property]&&state.column[column.property].merge!==false){
		// get merge
		let merge = state.column[column.property].merge
		// get up equal
		let uequal = false
		if(rowIndex==0){
			uequal = false
		}else{
			let cdata = state.datas.pager[rowIndex]
			let udata = state.datas.pager[rowIndex-1]
			if(merge===true){
				uequal = cdata[column.property]==udata[column.property]
			}else{
				uequal = cdata[column.property]==udata[column.property]
				if(uequal){
					if(typeof merge === 'array'){
						for(let i=0; i<merge.length; i++){
							let condition = merge[i]
							uequal = cdata[condition]==udata[condition]
							if(!uequal){
								break
							}
						}
					}
					if(typeof merge === 'string'){
						uequal = cdata[merge]==udata[merge]
					}
				}
			}
		}
		// if up equal then 0 0
		if(uequal){
			return {rowspan:0, colspan:0}
		}
		// defined rowspan
		let rowspan = 1
		// get cdata
		let cdata = state.datas.pager[rowIndex]
		for(let i=rowIndex+1; i<state.datas.pager.length; i++){
			let ddata = state.datas.pager[i]
			let dequal = false
			if(merge===true){
				dequal = cdata[column.property]==ddata[column.property]
			}else{
				dequal = cdata[column.property]==ddata[column.property]
				if(dequal){
					if(typeof merge === 'array'){
						for(let i=0; i<merge.length; i++){
							let condition = merge[i]
							uequal = cdata[condition]==udata[condition]
							if(!uequal){
								break
							}
						}
					}
					if(typeof merge === 'string'){
						uequal = cdata[merge]==udata[merge]
					}
				}
			}
			if(dequal){
				rowspan++
			}else{
				break;
			}
		}
		// return
		return {rowspan:rowspan, colspan:1}
	}
}

/**
 * handle tree load
 * @param row
 * @param node
 * @param resolve
 */
const handleTreeLoad = async (row, node, resolve) => {
	// custom
	if(props.treeLoad){
		props.treeLoad(row, node, resolve);
		return;
	}
	// set key
	let key = (typeof attrs['row-key']==='function'?attrs['row-key'](row):row[attrs['row-key']]);
	// load data
	let { data } = await request.post(props.url, {key:key})
	// set data
	let datas = data;
	// clean datas
	// datas = cleanDatas(datas);
	// filter datas
	datas = filterDatas(datas);
	// sort datas
	datas = sortDatas(datas);
	// datas render
	if(props.renderDatas)
		datas = props.renderDatas(datas);
	// resolve
	resolve(datas);
}

/**
 * update tree node
 * @param key
 */
const updateTreeNode = async (key:any) => {
	// load data
	let { data } = await request.post(props.url, key)
	// set data
	let datas = data;
	// filter datas
	datas = filterDatas(datas);
	// sort datas
	datas = sortDatas(datas);
	// datas render
	if(props.renderDatas)
		datas = props.renderDatas(datas);
	// resolve
	tableRef.value.updateKeyChildren(key, datas)
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
	const _column = state.column[column.property||column.prop];
	// clean
	value = value===undefined||value===null?'':value;
	// dict
	if(_column.dict) {
		if(typeof _column.dict === 'object') value=_column.dict[value];
		if(typeof _column.dict === 'array') value=_column.dict[value];
		if(typeof _column.dict === 'string') value = appStore.dict[_column.dict][value].label;
	}
	// encode
	if(_column.encode) value=htmlEncode(value);
	// decode
	if(_column.decode) value=htmlDecode(value);
	// format
	if(_column.format){
		// number
		if(_column.dataType=='number') value=formatNumber(value, _column.format);
		// date
		if(_column.dataType=='date') value=formatDate(value, _column.format);
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

// load
load()

// const table container ref
const tableContainerRef = ref()

// mounted
onMounted(() => {
	// has height
	if(props.height){
		// set height
		state.height = props.height
	}else{
		// resize height
		state.height = tableContainerRef.value.clientHeight+ 'px'
		// resize
	    window.onresize = () => {
			// resize height
	        state.height = tableContainerRef.value.clientHeight + 'px'
	    }
	}
})

// const emit
const emit = defineEmits([
	'select', 'selectAll', 'selectionChange', 
	'cellMouseEnter', 'cellMouseLeave', 'cellClick', 'cellDblclick', 'cellContextmenu', 
	'rowClick', 'rowContextmenu', 'rowDblclick', 
	'headerClick', 'headerContextmenu', 
	'sortChange', 'filterChange', 'currentChange', 
	'headerDragend', 'expandChange', 'scroll'
])

// const table container
const tableRef = ref()

// el table methods
const clearSelection = () => { tableRef.value.clearSelection() }
const getSelectionRows = () => { return tableRef.value.getSelectionRows() }
const toggleRowSelection = (row: any, selected?: boolean, ignoreSelectable = true) => { tableRef.value.toggleRowSelection(row, selected, ignoreSelectable) }
const toggleAllSelection = () => { tableRef.value.toggleAllSelection() }
const toggleRowExpansion = (row: any, expanded?: boolean) => { tableRef.value.toggleRowExpansion(row, expanded) }
const setCurrentRow = (row: any) => { tableRef.value.setCurrentRow(row) }
const clearSort = () => { tableRef.value.clearSort() }
const clearFilter = (columnKeys?: string[]) => { tableRef.value.clearFilter(columnKey) }
const doLayout = () => { tableRef.value.doLayout() }
const sort = (prop: string, order: string) => { tableRef.value.sort(prop, order) }
const scrollTo = (options: number | object, yCoord?: number) => { tableRef.value.scrollTo(options, yCoord) }
const setScrollTop = (top?: number) => { tableRef.value.setScrollTop(top) }
const setScrollLeft = (left?: number) => { tableRef.value.setScrollLeft(left) }
const columns = () => { return tableRef.value.columns() }
const updateKeyChildren = (key: string, data: T[]) => { tableRef.value.updateKeyChildren(key, data) }

// expose
defineExpose({
	// sw
	data: state, 
	load, 
	refresh,
	// el
	clearSelection, 
	getSelectionRows, 
	toggleRowSelection, 
	toggleAllSelection, 
	toggleRowExpansion, 
	setCurrentRow, 
	clearSort, 
	clearFilter, 
	doLayout, 
	sort, 
	scrollTo, 
	setScrollTop, 
	setScrollLeft, 
	columns, 
	updateKeyChildren, 
	updateTreeNode,
})
</script>