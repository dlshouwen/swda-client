<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel">
			<!-- panel header -->
			<div class="panel-header" ref="headerContainer">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="data-line">操作日志查询</el-link>
				</div>
				<!-- panel buttons -->
				<div class="panel-btns">
					<sw-link class="link-layout" type="default" :underline="false" icon="search" @click.stop="load();" divider>查询 (Q)</sw-link>
					<sw-link class="link-layout" type="warning" :underline="false" icon="refresh-left" @click.stop="reset();" divider>重置 (R)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="document" @click.stop="viewOperationLog();" divider>查看 (V)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="clearOperationLog();" permission="bms:log:operation_log:clear">清空 (C)</sw-link>
				</div>
			</div>
			<!-- search -->
			<div class="panel-body" style="border-bottom:1px solid #dadada;" ref="searchContainer">
				<div class="search">
					<label>图表样式：</label>
					<span style="flex-basis:80px;">
						<el-select v-model="search.chart_type" placeholder="">
							<el-option key="bar" label="条图" value="bar"></el-option>
							<el-option key="column" label="柱状图" value="column"></el-option>
							<el-option key="line" label="线图" value="line"></el-option>
							<el-option key="pie" label="饼状图" value="pie"></el-option>
						</el-select>
					</span>
					<label>统计类型：</label>
					<span style="flex-basis:100px;">
						<el-select v-model="search.data_type" placeholder="">
							<el-option key="user" label="按用户" value="user"></el-option>
							<el-option key="organ" label="按机构" value="organ"></el-option>
							<el-option key="operation_type" label="按操作类别" value="operation_type"></el-option>
							<el-option key="operation_result" label="按操作结果" value="operation_result"></el-option>
							<el-option key="ip" label="按IP地址" value="ip"></el-option>
							<el-option key="cost" label="按耗时" value="cost"></el-option>
							<el-option key="date" label="按日" value="date"></el-option>
							<el-option key="month" label="按月" value="month"></el-option>
							<el-option key="year" label="按年" value="year"></el-option>
						</el-select>
					</span>
					<label>操作用户：</label>
					<span><el-input v-model="search.lk_user_name" placeholder="请输入操作用户"></el-input></span>
					<label>操作机构：</label>
					<span><el-input v-model="search.lk_organ_name" placeholder="请输入操作机构"></el-input></span>
					<label style="flex-basis:40px;">耗时：</label>
					<span style="flex-basis:120px;">
						<el-input style="width:48px;" v-model="search.ge_cost"></el-input>
						~
						<el-input style="width:48px;" v-model="search.le_cost"></el-input>
					</span>
					<label>操作时间：</label>
					<span style="flex:1;">
						<el-date-picker v-model="operationTimeRange" type="datetimerange" range-separator="至" start-placeholder="操作开始时间" end-placeholder="操作结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
					</span>
				</div>
			</div>
			<!-- datas -->
			<div class="panel-body">
				<el-row>
					<el-col :span="15">
						<!-- grid -->
						<div id="grid_container" class="grid-container" style="border-right:1px solid #dadada;">
							<sw-grid ref="operationLogGrid" id="operation_log_list" title="操作日志列表" url="/bms/log/operation_log/list" row-key="logId" :search="search" :height="height"
								:toolbar-label="false" layout="prev, pager, next, total"
								@row-dblclick="row=>{viewOperationLog(row.logId)}" @selection-change="selection=>{selectOperationLogs=selection}">
								<sw-column type="selection" key="logId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
								<sw-column label="操作" width="40" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
									<template #default="scope">
										<sw-link type="primary" :underline="false" icon="document" @click.stop="viewOperationLog(scope.row.logId)"></sw-link>
									</template>
								</sw-column>
								<sw-column id="logId" label="日志编号" width="140" data-type="number" fast="range"></sw-column>
								<sw-column id="userId" label="用户编号" width="90" data-type="number" fast="range"></sw-column>
								<sw-column id="userName" label="用户名称" width="100" fast="lk"></sw-column>
								<sw-column id="organId" label="机构编号" width="90" data-type="number" fast="range"></sw-column>
								<sw-column id="organName" label="机构名称" width="140" fast="lk"></sw-column>
								<sw-column id="callSource" label="调用来源" width="240" align="left" fast="lk"></sw-column>
								<sw-column id="operationUrl" label="操作地址" width="240" align="left" fast="lk"></sw-column>
								<sw-column id="params" label="参数" width="180" align="left" fast="lk"></sw-column>
								<sw-column id="operationType" label="操作类别" width="90" :dict="dataStore.dict.operation_type" fast="eq" fast-type="radio">
									<template #default="scope">
										<template v-if="scope.row.operationType=='0'"><el-link type="info" :underline="false"><b>{{dataStore.dict.operation_type[scope.row.operationType]}}</b></el-link></template>
										<template v-if="scope.row.operationType=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.operation_type[scope.row.operationType]}}</b></el-link></template>
										<template v-if="scope.row.operationType=='2'"><el-link type="primary" :underline="false"><b>{{dataStore.dict.operation_type[scope.row.operationType]}}</b></el-link></template>
										<template v-if="scope.row.operationType=='3'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.operation_type[scope.row.operationType]}}</b></el-link></template>
										<template v-if="scope.row.operationType=='4'"><el-link type="delete" :underline="false"><b>{{dataStore.dict.operation_type[scope.row.operationType]}}</b></el-link></template>
										<template v-if="scope.row.operationType=='5'"><el-link type="primary" :underline="false"><b>{{dataStore.dict.operation_type[scope.row.operationType]}}</b></el-link></template>
										<template v-if="scope.row.operationType=='6'"><el-link type="primary" :underline="false"><b>{{dataStore.dict.operation_type[scope.row.operationType]}}</b></el-link></template>
									</template>
								</sw-column>
								<sw-column id="operationResult" label="操作结果" width="90" :dict="dataStore.dict.operation_result" fast="eq" fast-type="radio">
									<template #default="scope">
										<template v-if="scope.row.operationResult=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.operation_result[scope.row.operationResult]}}</b></el-link></template>
										<template v-if="scope.row.operationResult=='2'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.operation_result[scope.row.operationResult]}}</b></el-link></template>
										<template v-if="scope.row.operationResult=='3'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.operation_result[scope.row.operationResult]}}</b></el-link></template>
										<template v-if="scope.row.operationResult=='4'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.operation_result[scope.row.operationResult]}}</b></el-link></template>
										<template v-if="scope.row.operationResult=='5'"><el-link type="warning" :underline="false"><b>{{dataStore.dict.operation_result[scope.row.operationResult]}}</b></el-link></template>
									</template>
								</sw-column>
								<sw-column id="ip" label="操作IP" width="120" fast="lk"></sw-column>
								<sw-column id="operationDetail" label="操作说明" width="200" fast="lk"></sw-column>
								<sw-column id="responseStart" label="响应开始时间" width="140" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm:ss" fast="range"></sw-column>
								<sw-column id="responseEnd" label="响应结束时间" width="140" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm:ss" fast="range"></sw-column>
								<sw-column id="cost" label="排序" width="60" data-type="number" fast="range"></sw-column>
							</sw-grid>						
						</div>
					</el-col>
					<el-col :span="9">
						<!-- chart -->
						<div ref="operationLogChart" id="chart_container" :style="{height:(height+18)+'px'}"></div>
					</el-col>
				</el-row>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="查看" center width="1000px" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.view">
			<ViewOperationLog :logId="currentLogId"></ViewOperationLog>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

//import echarts
import * as echarts from 'echarts';

// import requests: get operation log chart data, get operation log data, clear operation log
import { $getOperationLogChartData, $getOperationLogData, $clearOperationLog } from '@/assets/config/api';

// import components: view operation log
import ViewOperationLog from '@/views/bms/log/operationLog/ViewOperationLog';

// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

// import key
import key from 'keymaster';

// import tool
import * as tool from '@/assets/utils/tool';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

//const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { chart_type: 'column', data_type: 'cost', lk_user_name: '', lk_organ_name: '', ge_cost: '', le_cost: '', ge_response_start:'', le_response_start:'' },
	// show
	show: { view: false },
	// current log id
	currentLogId: '',
	// select operation logs
	selectOperationLogs: [],
	// operation time range
	operationTimeRange: '',
});

// const chart
let chart = null;

// to refs
const { height, search, show, currentLogId, selectOperationLogs, operationTimeRange } = toRefs(state);

// ref
const headerContainer = ref();
const searchContainer = ref();
const operationLogGrid = ref();

/**
 * reset
 */
const reset = () => {
	// reset search
	state.search = { chart_type: 'column', data_type: 'cost', lk_user_name: '', lk_organ_name: '', ge_cost: '', le_cost: '', ge_response_start:'', le_response_start:'' };
	// reset operation time range
	state.operationTimeRange = [tool.formatDate(new Date(), 'yyyy')+'-01-01 00:00:00', tool.formatDate(new Date(), 'yyyy-MM-dd')+' 23:59:59'];
	// set response start
	state.search.ge_response_start = state.operationTimeRange[0];
	state.search.le_response_start = state.operationTimeRange[1];
}

/**
 * resize
 */
const resize = () => {
	state.height = document.documentElement.clientHeight-headerContainer.value.offsetHeight-searchContainer.value.offsetHeight-104;
}

/**
 * load
 */
const load = () => {
	// get operation log list
	getOperationLogList();
	// get operation log chart data
	getOperationLogChartData();
}

/**
 * get operation log list
 */
const getOperationLogList = () => {
	operationLogGrid.value.load();
}

/**
 * get operation log chart data
 */
const getOperationLogChartData = () => {
	// construct data
	let data = {};
	data.current = 0;
	data.size = 0;
	data.parameters = state.search;
	data.manualQueryParameters = state.search;
	data.fastQueryParameters = operationLogGrid.value.query.params.fast;
	data.advanceQueryConditions = operationLogGrid.value.query.params.advance.conditions;
	// get operation log chart data
	$getOperationLogChartData(data).then(handler=>{
		// defined
		const text = '操作日志统计报表';
		const subtext = ('统计时间：'+tool.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss S'));
		const field = {title:'操作次数', name:'category_field_name', value:'operation_count'};
		// set data
		const chartData = handler.data.data.operationLogChartData;
		// init chart
		if(!chart)
			chart = echarts.init(document.getElementById('chart_container'));
		// get categories
		let categories = [];
		for(let i=0; i<chartData.length; i++){
			categories.push(chartData[i][field.name]);
		}
		// get series
		let series = [];
		let serie = {
			itemStyle: { color: params=>{
				let colors = ['#B5C334','#FCCE10','#E87C25','#27727B','#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'];
				return colors[params.dataIndex%colors.length];
			}},
			data: []
		};
		if(state.search.chart_type=='pie'){
			serie.name = field.title;
			serie.type = 'pie';
			serie.radius = '55%';
			serie.center = ['50%', '60%'];
			for(let i=0; i<chartData.length; i++){
				serie.data.push({name:chartData[i][field.name], value:chartData[i][field.value]});
			}
		}else{
			serie.name = field.value;
			serie.type = (state.search.chart_type=='line'?'line':'bar');
			for(let i=0; i<chartData.length; i++){
				serie.data.push(chartData[i][field.value]);
			}
		}
		series.push(serie);
		// init option
		let option = {
			title : { text:text, subtext:subtext, x:'center' },
			tooltip : { trigger: 'axis' },
			legend: false,
			toolbox: {
				show : true,
				feature : {
					mark : {show: true},
					dataView : {show: false, readOnly: false},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			calculable : true,
			xAxis : [{type : 'category', data : categories }],
			yAxis : [{type : 'value', splitArea : {show : true} }],
			series : series
		};
		// bar option
		if(state.search.chart_type=='bar'){
			var temp = option.xAxis;
			option.xAxis = option.yAxis;
			option.yAxis = temp;
		}
		// data zoom
		if(state.search.chart_type!='pie'){
			var count = categories.length;
			var percent = count==0?100:(20/count<=0?100:(20/count*100));
			var dataZoom = [{show: true, type: 'inside', start: 0, end: percent, orient:'horizontal'}, {show: true, start: 0, end: percent, orient:'horizontal'}];
			if(state.search.chart_type=='bar'){
				dataZoom[0].orient = 'vertical';
				dataZoom[1].orient = 'vertical';
			}
			option.dataZoom = dataZoom;
		}
		// pie option
		if(state.search.chart_type=='pie'){
			option.tooltip = { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" };
			option.legend = { orient : 'vertical', x : 'left', data:categories};
			option.xAxis = null;
			option.yAxis = null;
		}
		// set option
		chart.setOption(option);
		// set loading false
		state.loading = false;
	});
}

/**
 * view operation log
 * @param logId
 */
const viewOperationLog = (logId) => {
	// param invalid
	if(logId===undefined||logId===null){
		// no select
		if(state.selectOperationLogs.length<=0){
			ElMessage.warning('未选择需要查看的数据。');
			return;
		}
		// set log id
		logId = state.selectOperationLogs[0].logId;
	}
	// set current log id
	state.currentLogId = logId;
	// show view operation log
	state.show.view = true;
}

/**
 * clear operation log
 */
const clearOperationLog = () => {
	// confirm
	ElMessageBox.confirm('确定清空操作日志吗？', '警告').then(()=>{
		// construct data
		let data = {};
		data.current = 0;
		data.size = 0;
		data.parameters = state.search;
		data.manualQueryParameters = state.search;
		data.fastQueryParameters = operationLogGrid.value.query.params.fast;
		data.advanceQueryConditions = operationLogGrid.value.query.params.advance.conditions;
		// clear operation log
		$clearOperationLog(data).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success(handler.data.message);
				// load
				load();
			}
		});
	}).catch(()=>{});
}

// watch
watch(()=>state.search, ()=>{ load() }, {deep: true}) 
watch(()=>state.operationTimeRange, (data)=>{
	state.search.ge_response_start = data?data[0]:'';
	state.search.le_response_start = data?data[1]:'';
}, {deep: true}) 

// reset
nextTick(()=>{
	reset();
})

// set height
window.onresize = resize;
nextTick(resize);

// hotkey
key('alt+q', ()=>{ load();return false; });
key('alt+r', ()=>{ reset();return false; });
key('alt+v', ()=>{ viewOperationLog();return false; });
key('alt+c', ()=>{ clearOperationLog();return false; });
</script>

<style scoped>
/** chart container */
#chart_container{padding:8px;}
</style>