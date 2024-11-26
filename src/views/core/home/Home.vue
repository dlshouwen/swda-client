<template>
	<!-- container -->
	<div class="container">
		<el-row style="flex-basis:100px;">
			<el-col :span="6">
				<!-- memery info -->
				<div class="info info-primary">
					<h1>系统信息</h1>
					<div>
						<dl><dt>内存总数</dt><dd>{{$tool.formatNumber(memeryInfo.total, '#,##0')}} MB</dd></dl>
						<dl><dt>使用量</dt><dd>{{$tool.formatNumber(memeryInfo.free, '#,##0')}} MB</dd></dl>
						<dl><dt>最大开辟</dt><dd>{{$tool.formatNumber(memeryInfo.max, '#,##0')}} MB</dd></dl>
					</div>
					<i class="el-icon-coin"></i>
				</div>
			</el-col>
			<el-col :span="6">
				<!-- login log count info -->
				<div class="info info-success">
					<h1>登录信息 [本年]</h1>
					<div>
						<dl><dt>单日最高</dt><dd>{{$tool.formatNumber(loginLogCountInfo.max_count, '#,##0')}}</dd></dl>
						<dl><dt>单日最低</dt><dd>{{$tool.formatNumber(loginLogCountInfo.min_count, '#,##0')}}</dd></dl>
						<dl><dt>单日平均</dt><dd>{{$tool.formatNumber(loginLogCountInfo.avg_count, '#,##0')}}</dd></dl>
					</div>
					<i class="el-icon-user"></i>
				</div>
			</el-col>
			<el-col :span="6">
				<!-- operation log count info -->
				<div class="info info-warning">
					<h1>操作耗时 [本年]</h1>
					<div>
						<dl><dt>最大耗时</dt><dd>{{$tool.formatNumber(operationLogCountInfo.max_cost, '#,##0')}}</dd></dl>
						<dl><dt>最小耗时</dt><dd>{{$tool.formatNumber(operationLogCountInfo.min_cost, '#,##0')}}</dd></dl>
						<dl><dt>平均耗时</dt><dd>{{$tool.formatNumber(operationLogCountInfo.avg_cost, '#,##0')}}</dd></dl>
					</div>
					<i class="el-icon-s-flag"></i>
				</div>
			</el-col>
			<el-col :span="6">
				<!-- data log count info -->
				<div class="info info-danger">
					<h1>数据执行耗时 [本年]</h1>
					<div>
						<dl><dt>最大耗时</dt><dd>{{$tool.formatNumber(dataLogCountInfo.max_cost, '#,##0')}}</dd></dl>
						<dl><dt>最小耗时</dt><dd>{{$tool.formatNumber(dataLogCountInfo.min_cost, '#,##0')}}</dd></dl>
						<dl><dt>平均耗时</dt><dd>{{$tool.formatNumber(dataLogCountInfo.avg_cost, '#,##0')}}</dd></dl>
					</div>
					<i class="el-icon-document"></i>
				</div>
			</el-col>
		</el-row>
		<el-row style="flex:1;">
			<el-col :span="17">
				<!-- login log count chart container -->
				<div ref="loginLogCountChartContainer" id="login_log_count_chart_container" class="home-panel" :style="{height:height+'px'}"></div>
			</el-col>
			<el-col :span="7">
				<!-- self login log 30 container -->
				<div id="self_login_log_30_container" class="home-panel" :style="{height:height+'px'}">
					<p v-for="loginLog in selfLoginLog30List">
						[<el-link :underline="false" type="danger">{{loginLog.ip}}</el-link>] 
						<el-link :underline="false" type="primary">{{loginLog.login_time}}</el-link>
						~ 
						<template v-if="loginLog.is_logout=='1'">
							<el-link :underline="false" type="primary">{{loginLog.logout_time}}</el-link>
						</template>
					</p>
				</div>
			</el-col>
		</el-row>
		<el-row style="flex:1;">
			<!-- operation log count chart container -->
			<el-col :span="12"><div id="operation_log_count_chart_container" class="home-panel" :style="{height:height+'px'}"></div></el-col>
			<!-- data log count chart container -->
			<el-col :span="12"><div id="data_log_count_chart_container" class="home-panel" :style="{height:height+'px'}"></div></el-col>
		</el-row>
	</div>
</template>

<script setup>
// import vue: reactive & to refs & next tick
import { reactive, toRefs, nextTick } from 'vue'

// import requests: get home data
import { $getHomeData } from '@/assets/config/api';

// import tool
import * as tool from '@/assets/utils/tool';

// import echarts
import * as echarts from 'echarts';

// const state
const state = reactive({
	// memery info
	memeryInfo: {},
	// login log count info
	loginLogCountInfo: {},
	// operation log count info
	operationLogCountInfo: {},
	// data log count info
	dataLogCountInfo: {},
	// self login log 30 list
	selfLoginLog30List: [],
	// login log count list
	loginLogCountList: [],
	// operation log count list
	operationLogCountList: [],
	// data log count list
	dataLogCountList: [],
	// height
	height: 100
});

// to refs
const { memeryInfo, loginLogCountInfo, operationLogCountInfo, dataLogCountInfo, selfLoginLog30List, loginLogCountList, operationLogCountList, height } = toRefs(state);

// const chart
const chart = { login: null, operation: null, data: null };

/**
 * chart item style
 * <p>set chart line or bar color list</p>
 * @param params
 */
const chartItemStyle = (params) => {
	// defined colors
	var colors = ['#B5C334','#FCCE10','#E87C25','#27727B','#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'];
	// return color
	return colors[params.dataIndex%colors.length];
}
 
/**
 * get home data
 */
const getHomeData = () => {
	// get home data
	$getHomeData().then(handler=>{
		// set data
		state.memeryInfo = handler.data.data.memeryInfo;
		state.loginLogCountInfo = handler.data.data.loginLogCountInfo;
		state.operationLogCountInfo = handler.data.data.operationLogCountInfo;
		state.dataLogCountInfo = handler.data.data.dataLogCountInfo;
		state.selfLoginLog30List = handler.data.data.selfLoginLog30List;
		state.loginLogCountList = handler.data.data.loginLogCountList;
		state.operationLogCountList = handler.data.data.operationLogCountList;
		state.dataLogCountList = handler.data.data.dataLogCountList;
		// login log count chart
		{
			// get datas count
			const count = state.loginLogCountList.length;
			// config option
			const option = {
				title : { text: '近一年登录人次月统计表', subtext: '统计时间：'+tool.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'), x:'center' },
				tooltip : {trigger: 'axis',axisPointer : {type : 'shadow'}},
				grid: {left:'1%',right:'1%',containLabel: true},
				xAxis : [{type : 'category',data : [],axisTick: {alignWithLabel: true}}],
				yAxis : [{type : 'value'}],
				dataZoom:[
					{show: true, type: 'inside', start: 0, end:(count==0?100:(20/count<=0?100:(20/count*100))), orient:'horizontal'},
					{show: true, start: 0, end:(count==0?100:(20/count<=0?100:(20/count*100))), orient:'horizontal'}
				],
				series : [{name:'用户登录次数',type:'bar',barWidth: '60%',data:[],itemStyle:{color : chartItemStyle }}]
			}
			// set datas
			for(let i=0; i<state.loginLogCountList.length; i++){
				option.xAxis[0].data.push(state.loginLogCountList[i]._month);
				option.series[0].data.push(state.loginLogCountList[i]._count);
			}
			// init chart
			if(!chart.login)
				chart.login = echarts.init(document.getElementById('login_log_count_chart_container'));
			// set option
			chart.login.setOption(option);
		}
		// operation log count chart
		{
			// get datas count
			const count = state.operationLogCountList.length;
			// config option
			const option = {
				title : { text: '近一年功能使用统计表', subtext: '统计时间：'+tool.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'), x:'center' },
				tooltip : {trigger: 'axis',axisPointer : {type : 'shadow'}},
				grid: {left:'1%',right:'1%',containLabel: true},
				xAxis : [{type : 'category',data : [],axisTick: {alignWithLabel: true}}],
				yAxis : [{type : 'value'}],
				dataZoom:[
					{show: true, type: 'inside', start: 0, end:(count==0?100:(20/count<=0?100:(20/count*100))), orient:'horizontal'},
					{show: true, start: 0, end:(count==0?100:(20/count<=0?100:(20/count*100))), orient:'horizontal'}
				],
				series : [{name:'功能响应次数',type:'line',barWidth: '60%',data:[],itemStyle:{color : chartItemStyle }}]
			}
			// set datas
			for(let i=0; i<state.operationLogCountList.length; i++){
				option.xAxis[0].data.push(state.operationLogCountList[i].operation_url);
				option.series[0].data.push(state.operationLogCountList[i]._count);
			}
			// init chart
			if(!chart.operation)
				chart.operation = echarts.init(document.getElementById('operation_log_count_chart_container'));
			// set option
			chart.operation.setOption(option);
		}
		// data log count chart
		{
			// get datas count
			const count = state.dataLogCountList.length;
			// config option
			const option = {
				title : { text: '近一年月度数据响应耗时情况', subtext: '统计时间：'+tool.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'), x:'center' },
				tooltip : {trigger: 'axis',axisPointer : {type : 'shadow'}},
				grid: {left:'1%',right:'1%',containLabel: true},
				xAxis : [{type : 'category',data : [],axisTick: {alignWithLabel: true}}],
				yAxis : [{type : 'value'}],
				dataZoom:[
					{show: true, type: 'inside', start: 0, end:(count==0?100:(20/count<=0?100:(20/count*100))), orient:'horizontal'},
					{show: true, start: 0, end:(count==0?100:(20/count<=0?100:(20/count*100))), orient:'horizontal'}
				],
				series : [
					{name:'最大耗时',type:'line',areaStyle: {},data:[]},
					{name:'最小耗时',type:'line',areaStyle: {},data:[]},
					{name:'平均耗时',type:'line',areaStyle: {},data:[]}
				]
			}
			// set datas
			for(let i=0; i<state.dataLogCountList.length; i++){
				option.xAxis[0].data.push(state.dataLogCountList[i]._month);
				option.series[0].data.push(state.dataLogCountList[i].max_cost);
				option.series[1].data.push(state.dataLogCountList[i].min_cost);
				option.series[2].data.push(state.dataLogCountList[i].avg_cost);
			}
			// init chart
			if(!chart.data)
				chart.data = echarts.init(document.getElementById('data_log_count_chart_container'));
			// set option
			chart.data.setOption(option);
		}
	});
}

/**
 * resize
 */
const resize = () => {
	// reset height
	state.height = (document.documentElement.clientHeight-100-82)/2;
	// resize chart
	nextTick(()=>{
		// reset login chart
		if(chart.login) chart.login.resize();
		// reset operation chart
		if(chart.operation) chart.operation.resize();
		// reset data chart
		if(chart.data) chart.data.resize();
	});
}

// get home data
getHomeData();
// next tick
nextTick(resize);
// resize
window.onresize = resize;
</script>

<style scoped>
/** container & row & column */
.container{padding:2px;box-sizing:border-box;}
.el-row{padding:0;}
[class*=el-col-]{padding:2px;height:100%;box-sizing:border-box;}

/** home panel */
.home-panel{padding:8px;height:100%;background:white;box-sizing: border-box;}

/** info */
.info{box-sizing:border-box;width:100%;background:white;height:100%;position:relative;background:#2494F2;color:white;border-top:4px solid #1b7bcc;}
.info.info-primary{background:#2494F2;border-top:4px solid #1b7bcc;}
.info.info-warning{background:#f0ad4e;border-top:4px solid #eea236;}
.info.info-danger{background:#d9534f;border-top:4px solid #d43f3a;}
.info.info-success{background:#5cb85c;border-top:4px solid #4cae4c;}
.info>i{width:100px;height:100px;position:absolute;top:0;right:0;text-align:center;line-height:98px;font-size:60px;opacity:0.8;}
.info>h1{padding:0 8px;margin-top:4px;font-size:14px;font-weight:bold;}
.info>div{padding:8px;}
.info>div>dl{margin-bottom:4px;}
.info>div>dl>dt{display:inline-block;opacity:0.8;padding-right:8px;}
.info>div>dl>dd{display:inline-block;opacity:0.9;}

/** self login log 30 container */
#self_login_log_30_container{overflow:auto;}
#self_login_log_30_container>p{line-height:24px;}
</style>