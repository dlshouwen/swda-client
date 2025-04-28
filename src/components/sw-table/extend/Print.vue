<template>
	<!-- operation -->
	<el-row>
		<el-button type="success" :icon="$t('table.print.buttons.print.icon')" @click="print">{{t('table.print.buttons.print.text')}}</el-button>
	</el-row>
	<!-- columns table -->
	<el-table ref="columnsTableRef" :data="columns" row-key="prop" @row-click="rowClick" @selection-change="selectionChange" border height="400" style="margin-top:12px;">
		<el-table-column type="selection" header-align="center" align="center" width="40" column-key="prop" :reserve-selection="true"></el-table-column>
		<el-table-column prop="index" header-align="center" align="center" :label="$t('table.print.column.sequence')" width="80">
			<template #default="scope">{{scope.$index+1}}</template>
		</el-table-column>
		<el-table-column prop="label" :label="$t('table.print.column.field')" align="left" header-align="center"></el-table-column>
		<el-table-column prop="operation" header-align="center" align="center" :label="$t('table.print.column.operation')" width="100">
			<template #default="scope">
				<el-link type="primary" :title="$t('table.print.column.buttons.up.title')" :icon="$t('table.print.column.buttons.up.icon')" @click.stop="moveColumn('up', scope.$index)"></el-link>
				<el-divider direction="vertical" />
				<el-link type="primary" :title="$t('table.print.column.buttons.down.title')" :icon="$t('table.print.column.buttons.down.icon')" @click.stop="moveColumn('down', scope.$index)"></el-link>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup>
// import vue: ref & reactive & to refs & inject & next tick
import { ref, reactive, computed, inject, nextTick } from 'vue'

// import vue i18n
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// props
const props = defineProps(['columns'])

// columns
const columns = reactive([])

// load columns
props.columns.forEach(column=>{
	if(column.printable) columns.push(column)
})

// const selects
const selects = ref()

// const columns table ref
const columnsTableRef = ref()

/**
 * row click
 * @param row
 * @param column
 * @param cell
 * @param event
 */
const rowClick = (row, column, cell, event) => {
	columnsTableRef.value.toggleRowSelection(row, !(selects.value.length>0 && selects.value.indexOf(row)!=-1));
}

/**
 * selection change
 * @param records
 */
const selectionChange = (records) => {
	selects.value = records
}

/**
 * move column
 * @param type
 * @param index
 */
const moveColumn = (type, index) => {
	// up
	if(type=='up'&&index>0){
		columns.splice(index-1, 0, columns.splice(index, 1)[0]);
	}
	// down
	if(type=='down'&&index<columns.length){
		columns.splice(index+1, 0, columns.splice(index, 1)[0]);
	}
}

// default check all
nextTick(() => {
	columns.forEach((column) => {
		columnsTableRef.value.toggleRowSelection(column, true);
	});
});

// const emit
const emit = defineEmits(['callback'])

/**
 * print
 */
const print = () => {
	// callback
	emit('callback', selects.value)
}
</script>

<style scoped>
</style>