<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel">
			<!-- panel header -->
			<div class="panel-header" ref="headerContainer">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="data-line">数据日志查询</el-link>
				</div>
				<!-- panel buttons -->
				<div class="panel-btns">
					<sw-link class="link-layout" type="default" :underline="false" icon="search" @click.stop="load();" divider>查询 (Q)</sw-link>
					<sw-link class="link-layout" type="warning" :underline="false" icon="refresh-left" @click.stop="reset();" divider>重置 (R)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="document" @click.stop="viewDataLog();" divider>查看 (V)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="clearDataLog();" permission="bms:log:data_log:clear">清空 (C)</sw-link>
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
							<el-option key="ip" label="按IP地址" value="ip"></el-option>
							<el-option key="operation_type" label="按操作类型" value="operation_type"></el-option>
							<el-option key="call_result" label="按执行结果" value="call_result"></el-option>
							<el-option key="cost" label="按耗时" value="cost"></el-option>
							<el-option key="date" label="按日" value="date"></el-option>
							<el-option key="month" label="按月" value="month"></el-option>
							<el-option key="year" label="按年" value="year"></el-option>
						</el-select>
					</span>
					<label>数据用户：</label>
					<span><el-input v-model="search.lk_user_name" placeholder="请输入数据用户"></el-input></span>
					<label>数据机构：</label>
					<span><el-input v-model="search.lk_organ_name" placeholder="请输入数据机构"></el-input></span>
					<label>执行结果：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_call_result" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.call_result" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label style="flex-basis:40px;">耗时：</label>
					<span style="flex-basis:120px;">
						<el-input style="width:48px;" v-model="search.ge_cost"></el-input>
						~
						<el-input style="width:48px;" v-model="search.le_cost"></el-input>
					</span>
					<label>数据时间：</label>
					<span style="flex:1;">
						<el-date-picker v-model="dataTimeRange" type="datetimerange" range-separator="至" start-placeholder="数据开始时间" end-placeholder="数据结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
					</span>
				</div>
			</div>
			<!-- datas -->
			<div class="panel-body">
				<el-row>
					<el-col :span="15">
						<!-- grid -->
						<div id="grid_container" class="grid-container" style="border-right:1px solid #dadada;">
							<sw-grid ref="dataLogGrid" id="data_log_list" title="数据日志列表" url="/bms/log/data_log/list" row-key="logId" :search="search" :height="height"
								:toolbar-label="false" layout="prev, pager, next, total"
								@row-dblclick="row=>{viewDataLog(row.logId)}" @selection-change="selection=>{selectDataLogs=selection}">
								<sw-column type="selection" key="logId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
								<sw-column label="操作" width="40" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
									<template #default="scope">
										<sw-link type="primary" :underline="false" icon="document" @click.stop="viewDataLog(scope.row.logId)"></sw-link>
									</template>
								</sw-column>
								<sw-column id="logId" label="日志编号" width="140" data-type="number" fast="range"></sw-column>
								<sw-column id="userId" label="用户编号" width="90" data-type="number" fast="range"></sw-column>
								<sw-column id="userName" label="用户名称" width="100" fast="lk"></sw-column>
								<sw-column id="organId" label="机构编号" width="90" data-type="number" fast="range"></sw-column>
								<sw-column id="organName" label="机构名称" width="140" fast="lk"></sw-column>
								<sw-column id="callSource" label="调用来源" width="480" align="left" fast="lk"></sw-column>
								<sw-column id="lineNo" label="行号" width="60" data-type="number" fast="range"></sw-column>
								<sw-column id="operationType" label="操作类型" width="90" :dict="dataStore.dict.operation_type" fast="eq" fast-type="radio">
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
								<sw-column id="ip" label="IP地址" width="120" fast="lk"></sw-column>
								<sw-column id="callResult" label="调用结果" width="90" :dict="dataStore.dict.call_result" fast="eq" fast-type="radio">
									<template #default="scope">
										<template v-if="scope.row.callResult=='1'"><el-link type="success" :underline="false"><b>{{dataStore.dict.call_result[scope.row.callResult]}}</b></el-link></template>
										<template v-if="scope.row.callResult=='0'"><el-link type="danger" :underline="false"><b>{{dataStore.dict.call_result[scope.row.callResult]}}</b></el-link></template>
									</template>
								</sw-column>
								<sw-column id="executeType" label="执行类别" width="140" fast="lk"></sw-column>
								<sw-column id="resultType" label="结果类别" width="140" fast="lk"></sw-column>
								<sw-column id="startTime" label="执行开始时间" width="140" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm:ss" fast="range"></sw-column>
								<sw-column id="endTime" label="执行结束时间" width="140" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm:ss" fast="range"></sw-column>
								<sw-column id="cost" label="排序" width="60" data-type="number" fast="range"></sw-column>
							</sw-grid>
						</div>
					</el-col>
					<el-col :span="9">
						<!-- chart -->
						<div ref="dataLogChart" id="chart_container" :style="{height:(height+18)+'px'}"></div>
					</el-col>
				</el-row>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="查看" center width="1000px" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.view">
			<ViewDataLog :logId="currentLogId"></ViewDataLog>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import echarts
import * as echarts from 'echarts';

// import requests: get data log chart data, get data log data, clear data log
import { $getDataLogChartData, $getDataLogData, $clearDataLog } from '@/assets/config/api';

// import components: view data log
import ViewDataLog from '@/views/bms/log/dataLog/ViewDataLog';

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

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { chart_type: 'pie', data_type: 'cost', lk_user_name: '', lk_organ_name: '', eq_call_result: '', ge_cost: '', le_cost:'', ge_start_time:'', le_start_time:'' },
	// show
	show: { view: false },
	// current log id
	currentLogId: '',
	// select data logs
	selectDataLogs: [],
	// data time range
	dataTimeRange: '',
});

// const chart
let chart = null;

// to refs
const { height, search, show, currentLogId, selectDataLogs, dataTimeRange } = toRefs(state);

//ref
const headerContainer = ref();
const searchContainer = ref();
const dataLogGrid = ref();

/**
 * reset
 */
const reset = () => {
	// reset search
	state.search = { chart_type: 'pie', data_type: 'cost', lk_user_name: '', lk_organ_name: '', eq_call_result: '', ge_cost: '', le_cost:'', ge_start_time:'', le_start_time:'' };
	// reset data time range
	state.dataTimeRange = [tool.formatDate(new Date(), 'yyyy')+'-01-01 00:00:00', tool.formatDate(new Date(), 'yyyy-MM-dd')+' 23:59:59'];
	// set start time
	state.search.ge_start_time = state.dataTimeRange[0];
	state.search.le_start_time = state.dataTimeRange[1];
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
	// get data log list
	getDataLogList();
	// get data log chart data
	getDataLogChartData();
}

/**
 * get data log list
 */
const getDataLogList = () => {
	dataLogGrid.value.load();
}

/**
 * get data log chart data
 */
const getDataLogChartData = () => {
	// construct data
	let data = {};
	data.current = 0;
	data.size = 0;
	data.parameters = state.search;
	data.manualQueryParameters = state.search;
	data.fastQueryParameters = dataLogGrid.value.query.params.fast;
	data.advanceQueryConditions = dataLogGrid.value.query.params.advance.conditions;
	// get data log chart data
	$getDataLogChartData(data).then(handler=>{
		// defined
		const text = '数据日志统计报表';
		const subtext = ('统计时间：'+tool.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss S'));
		const field = {title:'数据次数', name:'category_field_name', value:'data_count'};
		// set chart data
		const chartData = handler.data.data.dataLogChartData;
		// init chart
		if(!state.chart)
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
	});
}

/**
 * view data log
 * @param logId
 */
const viewDataLog = (logId) => {
	// param invalid
	if(logId===undefined||logId===null){
		// no select
		if(state.selectDataLogs.length<=0){
			ElMessage.warning('未选择需要查看的数据。');
			return;
		}
		// set log id
		logId = state.selectDataLogs[0].logId;
	}
	// set current log id
	state.currentLogId = logId;
	// show view data log
	state.show.view = true;
}

/**
 * clear data log
 */
const clearDataLog = () => {
	// confirm
	ElMessageBox.confirm('确定清空数据日志吗？', '警告').then(()=>{
		// construct data
		let data = {};
		data.current = 0;
		data.size = 0;
		data.parameters = state.search;
		data.manualQueryParameters = state.search;
		data.fastQueryParameters = dataLogGrid.value.query.params.fast;
		data.advanceQueryConditions = dataLogGrid.value.query.params.advance.conditions;
		// clear data log
		$clearDataLog(data).then(handler=>{
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
watch(()=>state.dataTimeRange, (data)=>{
	state.search.ge_start_time = data?data[0]:'';
	state.search.le_start_time = data?data[1]:'';
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
key('alt+v', ()=>{ viewDataLog();return false; });
key('alt+c', ()=>{ clearDataLog();return false; });
</script>

<style scoped>
/** chart container */
#chart_container{padding:8px;}
</style>