<template>
	<!-- operation -->
	<div class="operation">
		<el-radio-group v-model="exportType">
			<el-radio-button label="excel">{{t('table.export.type.excel')}}</el-radio-button>
			<el-radio-button label="csv">{{t('table.export.type.csv')}}</el-radio-button>
			<el-radio-button label="pdf">{{t('table.export.type.pdf')}}</el-radio-button>
			<el-radio-button label="txt">{{t('table.export.type.txt')}}</el-radio-button>
		</el-radio-group>
		<el-radio-group v-model="exportAllData" style="margin-left:6px;">
			<el-radio-button label="0">{{t('table.export.data.current')}}</el-radio-button>
			<el-radio-button label="1">{{t('table.export.data.all')}}</el-radio-button>
		</el-radio-group>
		<el-button type="success" :underline="false" :icon="$t('table.export.buttons.export.icon')" @click.native="_export">{{t('table.export.buttons.export.text')}}</el-button>
	</div>
	<!-- columns table -->
	<el-table ref="columnsTableRef" :data="columns" row-key="prop" @row-click="rowClick" @selection-change="selectionChange" border height="400">
		<el-table-column type="selection" header-align="center" align="center" width="40" column-key="prop" :reserve-selection="true"></el-table-column>
		<el-table-column prop="index" header-align="center" align="center" :label="$t('table.export.column.sequence')" width="80">
			<template #default="scope">{{scope.$index+1}}</template>
		</el-table-column>
		<el-table-column prop="label" :label="$t('table.export.column.field')" align="left" header-align="center"></el-table-column>
		<el-table-column prop="operation" header-align="center" align="center" :label="$t('table.export.column.operation')" width="100">
			<template #default="scope">
				<el-link type="primary" :underline="false" :title="$t('table.export.column.buttons.up.title')" :icon="$t('table.export.column.buttons.up.icon')" @click.stop.native="moveColumn('up', scope.$index)"></el-link>
				<el-link type="primary" :underline="false" :title="$t('table.export.column.buttons.down.title')" :icon="$t('table.export.column.buttons.down.icon')" @click.stop.native="moveColumn('down', scope.$index)"></el-link>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup>
// import vue: ref & reactive & to refs & inject & next tick
import { ref, reactive, toRefs, inject, nextTick } from 'vue'

// import vue i18n
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// props
const props = defineProps(['columns'])

// columns
const columns = reactive([])

// load columns
props.columns.forEach(column=>{
	if(column.exportable) columns.push(column)
})

// const selects
const selects = ref()

// const export type
const exportType = ref('excel')

// const export all data
const exportAllData = ref('0')

// column table ref
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
	selects.value = records;
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
})

// const emit
const emit = defineEmits(['callback'])

/**
 * export
 */
const _export = () => {
	// callback
	emit('callback', selects.value, exportType.value, exportAllData.value)
}
</script>

<style scoped>
</style>