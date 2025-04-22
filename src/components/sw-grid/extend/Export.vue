<template>
	<!-- container -->
	<div class="container">
		<!-- operation -->
		<div class="operation">
			<el-radio-group v-model="exportType">
				<el-radio-button label="excel">{{language.export.type.excel}}</el-radio-button>
				<el-radio-button label="csv">{{language.export.type.csv}}</el-radio-button>
				<el-radio-button label="pdf">{{language.export.type.pdf}}</el-radio-button>
				<el-radio-button label="txt">{{language.export.type.txt}}</el-radio-button>
			</el-radio-group>
			<el-radio-group v-model="exportAllData" style="margin-left:6px;">
				<el-radio-button label="0">{{language.export.data.current}}</el-radio-button>
				<el-radio-button label="1">{{language.export.data.all}}</el-radio-button>
			</el-radio-group>
			<el-button type="success" :underline="false" :icon="language.export.buttons.export.icon" @click.native="_export">{{language.export.buttons.export.text}}</el-button>
		</div>
		<!-- columns table -->
		<el-table ref="columnsTable" :data="exportColumns" row-key="index" @row-click="rowClick" @selection-change="selectionChange" border height="366">
			<el-table-column type="selection" header-align="center" align="center" width="22" column-key="index" :reserve-selection="true"></el-table-column>
			<el-table-column prop="index" header-align="center" align="center" :label="language.export.column.sequence" width="40">
				<template #default="scope">{{scope.$index+1}}</template>
			</el-table-column>
			<el-table-column prop="label" :label="language.export.column.field" align="left" header-align="center" width="268"></el-table-column>
			<el-table-column prop="operation" header-align="center" align="center" :label="language.export.column.operation" width="60">
				<template #default="scope">
					<el-link type="primary" :underline="false" :title="language.export.column.buttons.up.title" :icon="language.export.column.buttons.up.icon" @click.stop.native="moveColumn('up', scope.$index)"></el-link>
					<el-link type="primary" :underline="false" :title="language.export.column.buttons.down.title" :icon="language.export.column.buttons.down.icon" @click.stop.native="moveColumn('down', scope.$index)"></el-link>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & inject & next tick
import { ref, reactive, toRefs, inject, nextTick } from 'vue'

// props
const props = defineProps(['language', 'columns'])

// const state
const state = reactive({
	// export columns
	exportColumns: [],
	// select columns
	selectColumns: [],
	// export type
	exportType: 'excel',
	// export all data
	exportAllData: '0',
});

// to refs
const { exportColumns, selectColumns, exportType, exportAllData } = toRefs(state);

// ref
const columnsTable = ref()

// inject
const __export = inject('_export');

/**
 * export
 */
const _export = () => {
	__export(state.exportColumns, state.exportType, state.exportAllData=='1');
}

/**
 * row click
 * @param row
 * @param column
 * @param cell
 * @param event
 */
const rowClick = (row, column, cell, event) => {
	columnsTable.value.toggleRowSelection(row, !(state.selectColumns.length>0 && state.selectColumns.indexOf(row)!=-1));
}

/**
 * selection change
 * @param records
 */
const selectionChange = (records) => {
	state.selectColumns = records;
}

/**
 * move column
 * @param type
 * @param index
 */
const moveColumn = (type, index) => {
	// get datas
	let datas = state.exportColumns;
	// up
	if(type=='up'&&index>0){
		datas.splice(index-1, 0, datas.splice(index, 1)[0]);
	}
	// down
	if(type=='down'&&index<datas.length){
		datas.splice(index+1, 0, datas.splice(index, 1)[0]);
	}
}

// load columns
props.columns.forEach((column)=>{
	if(column.export)
		state.exportColumns.push(column);
});

// default check all
state.selectColumns = state.exportColumns;
nextTick(() => {
	state.selectColumns.forEach((row) => {
		columnsTable.value.toggleRowSelection(row, true);
	});
})
</script>

<style scoped>
/** container */
.container{height:400px;background:white;}

/** operation */
.operation{padding:6px;border-bottom:1px solid #d0d0d0;}
.operation label{font-size:12px;vertical-align: middle;}
.operation .el-button{float:right;line-height:22px;height:22px;}
</style>