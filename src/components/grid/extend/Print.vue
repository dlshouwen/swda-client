<template>
	<!-- container -->
	<div class="container">
		<!-- operation -->
		<div class="operation">
			<el-button type="success" :underline="false" :icon="language.print.buttons.print.icon" @click="print">{{language.print.buttons.print.text}}</el-button>
		</div>
		<!-- columns table -->
		<el-table ref="columnsTable" :data="printColumns" row-key="index" @row-click="rowClick" @selection-change="selectionChange" border height="366">
			<el-table-column type="selection" header-align="center" align="center" width="22" column-key="index" :reserve-selection="true"></el-table-column>
			<el-table-column prop="index" header-align="center" align="center" :label="language.print.column.sequence" width="40">
				<template #default="scope">{{scope.$index+1}}</template>
			</el-table-column>
			<el-table-column prop="label" :label="language.print.column.field" align="left" header-align="center" width="268"></el-table-column>
			<el-table-column prop="operation" header-align="center" align="center" :label="language.print.column.operation" width="60">
				<template #default="scope">
					<el-link type="primary" :underline="false" :title="language.print.column.buttons.up.title" :icon="language.print.column.buttons.up.icon" @click.stop="moveColumn('up', scope.$index)"></el-link>
					<el-link type="primary" :underline="false" :title="language.print.column.buttons.down.title" :icon="language.print.column.buttons.down.icon" @click.stop="moveColumn('down', scope.$index)"></el-link>
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
	// print columns
	printColumns: [],
	// select columns
	selectColumns: []
});

//to refs
const { printColumns, selectColumns } = toRefs(state);

//ref
const columnsTable = ref()

//inject
const _print= inject('print');

/**
 * print
 */
const print = () => {
	_print(state.printColumns);
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
	let datas = state.printColumns;
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
	if(column.print)
		state.printColumns.push(column);
});

// default check all
state.selectColumns = state.printColumns;
nextTick(() => {
	state.printColumns.forEach((row) => {
		columnsTable.value.toggleRowSelection(row, true);
	});
});
</script>

<style scoped>
/** container */
.container{height:400px;background:white;}

/** operation */
.operation{padding:6px;border-bottom:1px solid #d0d0d0;}
.operation .el-button{float:right;line-height:22px;height:22px;}
</style>