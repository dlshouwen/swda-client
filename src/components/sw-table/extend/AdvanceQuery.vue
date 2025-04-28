<template>
	<!-- row -->
	<el-row :gutter="12">
		<!-- col -->
		<el-col :span="24">
			<!-- card -->
			<el-card shadow="never">
				<!-- advance query form -->
				<el-form ref="advanceQueryForm" :inline="true" :model="state.advanceQuery" :show-message="false" :status-icon="false">
					<el-form-item>
						<el-input v-model="state.advanceQuery.advanceQueryName" :placeholder="$t('table.advance.main.name.placeholder')" clearable />
					</el-form-item>
					<el-form-item>
						<el-input v-model="state.advanceQuery.remark" :placeholder="$t('table.advance.main.remark.placeholder')" clearable />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" :underline="false" :icon="$t('table.advance.main.buttons.add.icon')" @click="addAdvanceQuery">{{t('table.advance.main.buttons.add.text')}}</el-button>
						<el-button type="primary" :underline="false" :icon="$t('table.advance.main.buttons.update.icon')" @click="updateAdvanceQuery">{{t('table.advance.main.buttons.update.text')}}</el-button>
						<el-button type="warning" :underline="false" :icon="$t('table.advance.main.buttons.copy.icon')" @click="copyAdvanceQuery">{{t('table.advance.main.buttons.copy.text')}}</el-button>
						<el-button type="danger" :underline="false" :icon="$t('table.advance.main.buttons.delete.icon')" @click="deleteAdvanceQuery">{{t('table.advance.main.buttons.delete.text')}}</el-button>
						<el-button type="success" :underline="false" :icon="$t('table.advance.main.buttons.sure.icon')" @click="advanceQuery">{{t('table.advance.main.buttons.sure.text')}}</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</el-col>
	</el-row>
	<!-- row -->
	<el-row :gutter="12" style="margin-top:12px;">
		<!-- left -->
		<el-col :span="6">
			<!-- card -->
			<el-card shadow="never">
				<el-menu>
					<el-menu-item v-for="advanceQuery in state.advanceQueryList" @click="getAdvanceQueryData(advanceQuery.advanceQueryId)">{{advanceQuery.advanceQueryName}}</el-menu-item>
				</el-menu>
			</el-card>
		</el-col>
		<!-- right -->
		<el-col :span="18">
			<!-- card -->
			<el-tabs v-model="state.tab" type="border-card">
				<el-tab-pane name="condition">
					<template #label><sw-icon :icon="$t('table.advance.condition.title.icon')"></sw-icon> {{t('table.advance.condition.title.text')}}</template>
					<el-row>
						<el-button type="success" :icon="$t('table.advance.condition.buttons.insert.icon')" @click="insertCondition">{{t('table.advance.condition.buttons.insert.text')}}</el-button>
						<el-button type="danger" :icon="$t('table.advance.condition.buttons.clear.icon')" @click="clearCondition">{{t('table.advance.condition.buttons.clear.text')}}</el-button>
					</el-row>
					<el-table :data="state.advanceQuery.conditionList" border height="600" style="margin-top:12px;">
						<el-table-column prop="index" header-align="center" align="center" :label="$t('table.advance.condition.column.sequence')" width="60">
							<template #default="scope">{{scope.$index+1}}</template>
						</el-table-column>
						<el-table-column prop="leftParentheses" header-align="center" align="center" :label="$t('table.advance.condition.column.leftParentheses')" width="80">
							<template #default="scope">
								<el-form-item label-width="0" :prop="`leftParentheses_${scope.row.conditionId}`" :rules="{ lang:t, valid:'only_left_parentheses|l-le10', label:t('table.advance.condition.column.leftParentheses'), obj:'conditionList', no:scope.$index, item:'leftParentheses', type:'input', message:t('table.advance.condition.errors.left_parentheses_error'), validator:validator, trigger:'change' }">
									<el-input v-model="scope.row.leftParentheses"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionField" header-align="center" align="center" :label="$t('table.advance.condition.column.field')" width="160">
							<template #default="scope">
								<el-form-item label-width="0" :prop="`conditionField_${scope.row.conditionId}`" :rules="{ lang:t, valid:'r', label:t('table.advance.condition.column.field'), obj:'conditionList', no:scope.$index, item:'conditionField', type:'input', validator:validator, trigger:'change' }">
									<el-select v-model="scope.row.conditionField" @change="scope.row.conditionValue=''" placeholder="">
										<template v-for="column in props.columns">
											<el-option v-if="column.advance" :label="column.label" :value="column.prop"></el-option>
										</template>
									</el-select>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionType" header-align="center" align="center" :label="$t('table.advance.condition.column.condition')" width="140">
							<template #default="scope">
								<el-form-item label-width="0" :prop="`conditionType_${scope.row.conditionId}`" :rules="{ lang:t, valid:'r', label:t('table.advance.condition.column.condition'), obj:'conditionList', no:scope.$index, item:'conditionType', type:'input', validator:validator, trigger:'change' }">
									<el-select v-model="scope.row.conditionType" placeholder="">
										<el-option v-for="dict in appStore.dict.condition_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
									</el-select>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionValue" header-align="center" align="center" :label="$t('table.advance.condition.column.value')">
							<template #default="scope">
								<template v-if="scope.row.conditionField">
									<template v-if="props.column[scope.row.conditionField].dict">
										<el-form-item label-width="0" :prop="`conditionValue_${scope.row.conditionId}`" :rules="{ lang:t, valid:'', label:props.column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<el-select v-model="scope.row.conditionValue" placeholder="">
												<el-option label="" value=""></el-option>
												<el-option v-if="typeof props.column[scope.row.conditionField].dict === 'object'" v-for="(value, key) in props.column[scope.row.conditionField].dict" :key="key" :label="value" :value="key"></el-option>
												<el-option v-if="typeof props.column[scope.row.conditionField].dict === 'array'" v-for="dict in props.column[scope.row.conditionField].dict" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
												<el-option v-if="typeof props.column[scope.row.conditionField].dict === 'string'" v-for="dict in appStore.dict[props.column[scope.row.conditionField].dict].datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
											</el-select>
										</el-form-item>
									</template>
									<template v-else-if="props.column[scope.row.conditionField].dataType=='number'">
										<el-form-item label-width="0" :prop="`conditionValue_${scope.row.conditionId}`" :rules="{ lang:t, valid:'r|double', label:props.column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<el-input v-model="scope.row.conditionValue"></el-input>
										</el-form-item>
									</template>
									<template v-else-if="props.column[scope.row.conditionField].dataType=='date'">
										<el-form-item label-width="0" :prop="`conditionValue_${scope.row.conditionId}`" :rules="{ lang:t, valid:'r', label:props.column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<el-date-picker v-model="scope.row.conditionValue" type="datetime" :value-format="props.column[scope.row.conditionField].format" :format="props.column[scope.row.conditionField].format"></el-date-picker>
										</el-form-item>
									</template>
									<template v-else>
										<el-form-item label-width="0" :prop="`conditionValue_${scope.row.conditionId}`" :rules="{ lang:t, valid:'', label:props.column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<el-input v-model="scope.row.conditionValue"></el-input>
										</el-form-item>
									</template>
								</template>
							</template>
						</el-table-column>
						<el-table-column prop="rightParentheses" header-align="center" align="center" :label="$t('table.advance.condition.column.rightParentheses')" width="80">
							<template #default="scope">
								<el-form-item label-width="0" :prop="`rightParentheses_${scope.row.conditionId}`" :rules="{ lang:t, valid:'only_right_parentheses|l-le10', label:t('table.advance.condition.column.rightParentheses'), obj:'conditionList', no:scope.$index, item:'rightParentheses', type:'input', message:t('table.advance.condition.errors.right_parentheses_error'), validator:validator, trigger:'change' }">
									<el-input v-model="scope.row.rightParentheses"></el-input>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionLogic" header-align="center" align="center" :label="$t('table.advance.condition.column.logic')" width="100">
							<template #default="scope">
								<el-form-item label-width="0" :prop="`conditionLogic_${scope.row.conditionId}`" :rules="{ lang:t, valid:'', label:t('table.advance.condition.column.logic'), obj:'conditionList', no:scope.$index, item:'conditionLogic', type:'input', validator:validator, trigger:'change' }">
									<el-select v-model="scope.row.conditionLogic" placeholder="">
										<el-option label="" value=""></el-option>
										<el-option v-for="dict in appStore.dict.condition_logic.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
									</el-select>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="operation" header-align="center" align="center" :label="$t('table.advance.condition.column.operation')" width="110">
							<template #default="scope">
								<el-link type="primary" :underline="false" :title="$t('table.advance.condition.column.buttons.up.title')" :icon="$t('table.advance.condition.column.buttons.up.icon')" @click="moveCondition('up', scope.$index)"></el-link>
								<el-divider direction="vertical" />
								<el-link type="primary" :underline="false" :title="$t('table.advance.condition.column.buttons.down.title')" :icon="$t('table.advance.condition.column.buttons.down.icon')" @click="moveCondition('down', scope.$index)"></el-link>
								<el-divider direction="vertical" />
								<el-link type="danger" :underline="false" :title="$t('table.advance.condition.column.buttons.delete.title')" :icon="$t('table.advance.condition.column.buttons.delete.icon')" @click="deleteCondition(scope.$index)"></el-link>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane name="sort">
					<template #label><sw-icon :icon="$t('table.advance.sort.title.icon')"></sw-icon> {{t('table.advance.sort.title.text')}}</template>
					<el-row>
						<el-button class="link-layout" type="success" :underline="false" :icon="$t('table.advance.sort.buttons.insert.icon')" @click="insertSort">{{t('table.advance.sort.buttons.insert.text')}}</el-button>
						<el-button class="link-layout" type="danger" :underline="false" :icon="$t('table.advance.sort.buttons.clear.icon')" @click="clearSort">{{t('table.advance.sort.buttons.clear.text')}}</el-button>
					</el-row>
					<el-table :data="state.advanceQuery.sortList" border height="600" style="margin-top:12px;">
						<el-table-column prop="index" header-align="center" align="center" :label="$t('table.advance.sort.column.sequence')" width="60">
							<template #default="scope">{{scope.$index+1}}</template>
						</el-table-column>
						<el-table-column prop="sortField" header-align="center" align="center" :label="$t('table.advance.sort.column.field')" width="240">
							<template #default="scope">
								<el-form-item label-width="0" :prop="`sortField_${scope.row.sortId}`" :rules="{ lang:t, valid:'r', label:t('table.advance.sort.column.field'), obj:'sortList', no:scope.$index, item:'sortField', type:'input', validator:validator, trigger:'change' }">
									<el-select v-model="scope.row.sortField" placeholder="">
										<template v-for="column in props.columns">
											<el-option v-if="column.advance" :label="column.label" :value="column.prop"></el-option>
										</template>
									</el-select>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="sortLogic" header-align="center" align="center" :label="$t('table.advance.sort.column.logic')" width="120">
							<template #default="scope">
								<el-form-item label-width="0" :prop="`sortLogic_${scope.row.sortId}`" :rules="{ lang:t, valid:'r', label:t('table.advance.sort.column.logic'), obj:'sortList', no:scope.$index, item:'sortLogic', type:'input', validator:validator, trigger:'change' }">
									<el-select v-model="scope.row.sortLogic" placeholder="">
										<el-option v-for="dict in appStore.dict.sort_logic.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
									</el-select>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="operation" header-align="center" align="center" :label="$t('table.advance.sort.column.operation')" width="110">
							<template #default="scope">
								<el-link type="primary" :underline="false" :title="$t('table.advance.sort.column.buttons.up.title')" :icon="$t('table.advance.sort.column.buttons.up.icon')" @click="moveSort('up', scope.$index)"></el-link>
								<el-divider direction="vertical" />
								<el-link type="primary" :underline="false" :title="$t('table.advance.sort.column.buttons.down.title')" :icon="$t('table.advance.sort.column.buttons.down.icon')" @click="moveSort('down', scope.$index)"></el-link>
								<el-divider direction="vertical" />
								<el-link type="danger" :underline="false" :title="$t('table.advance.sort.column.buttons.delete.title')" :icon="$t('table.advance.sort.column.buttons.delete.icon')" @click="deleteSort(scope.$index)"></el-link>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			  </el-tabs>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
// import vue elements
import { ref, reactive } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import request
import request from '@/utils/request'

// import validator
import { validator } from '@/utils/validator'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// import vue i18n
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

// parentheses validation
const parenthesesValidation = {
	format: {
		only_left_parentheses: function(rule, value, callback, item, option, lang){
			if (value.replaceAll('(', '').length>0) {
				var message = rule.message
				if(option.style=='title') item.title = message
				if(option.style=='tooltip') item.content = message
				callback(new Error(message))
				return
			}
			if(option.style=='title') item.title = ''
			if(option.style=='tooltip') item.content = ''
			callback()
		},
		only_right_parentheses: function(rule, value, callback, item, option, lang){
			if (value.replaceAll(')', '').length>0) {
				var message = rule.message
				if(option.style=='title') item.title = message
				if(option.style=='tooltip') item.content = message
				callback(new Error(message))
				return
			}
			if(option.style=='title') item.title = ''
			if(option.style=='tooltip') item.content = ''
			callback()
		}
	}
}

/**
 * validation
 * @prarm rule
 * @prarm value
 * @prarm callback
 */
const validation = (rule, value, callback) => {
	if(rule.obj){
		validator(rule, state.advanceQuery[rule.obj][rule.no][rule.item], callback);
	}else{
		validator(rule, value, callback);
	}
}

// props
const props = defineProps(['id', 'columns', 'column', 'advance'])

// const state
const state = reactive({
	// tab
	tab: 'condition',
	// sequence
	sequence: { condition:0, sort:0 },
	// current advance query id
	currentAdvanceQueryId: 0,
	// advance
	advanceQuery: { advanceQueryId:0, advanceQueryName:'', functionCode:props.id, remark:'', conditionList:[], sortList:[] },
	// advance query list
	advanceQueryList: []
})

// const advance query form
const advanceQueryForm = ref()

/**
 * get advance query list
 */
const getAdvanceQueryList = async () => {
	// get advance query list
	let { data } = await request.post('/grid/advance_query/list', {functionCode:props.id})
	// set advance query list
	state.advanceQueryList = data
}

/**
 * get advance query data
 * @prarm advanceQueryId
 */
const getAdvanceQueryData = async (advanceQueryId: number) => {
	// set current advance query id
	state.currentAdvanceQueryId = advanceQueryId;
	// get advance query data
	let { data } = await request('/grid/advance_query/'+advanceQueryId+'/data')
	// set advance query data
	state.advanceQuery = data
}

/**
 * add advance query
 */
const addAdvanceQuery = async () => {
	// valid
	let valid = await advanceQueryForm.value.validate()
	// pass
	if(valid){
		// confirm
		await ElMessageBox.confirm(t('table.advance.main.message.add.content'), t('table.advance.main.message.add.title'))
		// set null
		state.advanceQuery.advanceQueryId = 0
		// add advance query
		let { message } = await request.post('/grid/advance_query/add', state.advanceQuery)
		// show message
		ElMessage.success(message)
		// get advance query list
		getAdvanceQueryList()
	}
}

/**
 * update advance query
 */
const updateAdvanceQuery = async () => {
	// no current
	if(state.currentAdvanceQueryId===''){
		ElMessage.warning(t('table.advance.main.message.update.nothing'))
		return;
	}
	// valid
	let valid = await advanceQueryForm.value.validate()
	// pass
	if(valid){
		// confirm
		await ElMessageBox.confirm(t('table.advance.main.message.update.content'), t('table.advance.main.message.update.title'))
		// update advance query
		let { message } = await request.post('/grid/advance_query/update', state.advanceQuery)
		// show message
		ElMessage.success(message)
		// get advance query list
		getAdvanceQueryList()
	}
}

/**
 * copy advance query
 */
const copyAdvanceQuery = async () => {
	// no current
	if(state.currentAdvanceQueryId===''){
		ElMessage.warning(t('.advance.main.message.copy.nothing'));
		return;
	}
	// confirm
	await ElMessageBox.confirm(t('.advance.main.message.copy.content'), t('.advance.main.message.copy.title'))
	// copy advance query
	let { message } = await request.post('/grid/advance_query/copy', state.currentAdvanceQueryId)
	// show message
	ElMessage.success(message)
	// get advance query list
	getAdvanceQueryList()
}

/**
 * delete advance query
 */
const deleteAdvanceQuery = async () => {
	// no current
	if(state.advanceQueryId===''){
		ElMessage.warning(t('.advance.main.message.delete.nothing'));
		return;
	}
	// confirm
	await ElMessageBox.confirm(t('.advance.main.message.delete.content'), t('.advance.main.message.delete.title'))
	// delete advance query
	let { message } = await request.post('/grid/advance_query/delete', state.currentAdvanceQueryId)
	// show message
	ElMessage.success(message)
	// get advance query list
	getAdvanceQueryList()
}

/**
 * insert condition
 */
const insertCondition = () => {
	// defined condition
	let condition = {};
	condition.conditionId = state.sequence.condition--;
	condition.advanceQueryId = 0;
	condition.leftParentheses = '';
	condition.conditionField = '';
	condition.conditionType = '';
	condition.conditionValue = '';
	condition.rightParentheses = '';
	condition.conditionLogic = '';
	condition.sort = 0;
	// push condition
	state.advanceQuery.conditionList.push(condition);
}

/**
 * move condition
 * @prarm type
 * @prarm index
 */
const moveCondition = (type, index) => {
	// get datas
	let datas = state.advanceQuery.conditionList;
	// up
	if(type=='up'&&index>0){
		datas.splice(index-1, 0, datas.splice(index, 1)[0]);
	}
	// down
	if(type=='down'&&index<datas.length){
		datas.splice(index+1, 0, datas.splice(index, 1)[0]);
	}
}

/**
 * delete condition
 * @prarm index
 */
const deleteCondition = (index) => {
	state.advanceQuery.conditionList.splice(index, 1);
}

/**
 * clear condition
 */
const clearCondition = () => {
	// if none
	if(state.advanceQuery.conditionList.length<=0){
		return;
	}
	// confirm
	ElMessageBox.confirm(t('table.advance.condition.message.clear.content'), t('table.advance.condition.message.clear.title'), { type: 'warning' }).then(() => {
		state.advanceQuery.conditionList = [];
	}).catch(()=>{});
}

/**
 * insert sort
 */
const insertSort = () => {
	// defined sort
	let sort = {};
	sort.sortId = state.sequence.sort--;
	sort.advanceQueryId = 0;
	sort.sortField = '';
	sort.sortLogic = '';
	sort.sort = 0;
	// push sort
	state.advanceQuery.sortList.push(sort);
}

/**
 * move sort
 * @prarm type
 * @prarm index
 */
const moveSort = (type, index) => {
	// get datas
	let datas = state.advanceQuery.sortList;
	// up
	if(type=='up'&&index>0){
		datas.splice(index-1, 0, datas.splice(index, 1)[0]);
	}
	// down
	if(type=='down'&&index<datas.length){
		datas.splice(index+1, 0, datas.splice(index, 1)[0]);
	}
}

/**
 * delete sort
 * @prarm index
 */
const deleteSort = (index) => {
	state.advanceQuery.sortList.splice(index, 1);
}

/**
 * clear sort
 */
const clearSort = () => {
	// if none
	if(state.advanceQuery.sortList.length<=0){
		return;
	}
	// confirm
	ElMessageBox.confirm(t('table.advance.sort.message.clear.content'), t('table.advance.sort.message.clear.title'), { type: 'warning' }).then(() => {
		state.advanceQuery.sortList = [];
	}).catch(()=>{});
}

// get advance query list
getAdvanceQueryList();

// const emit
const emit = defineEmits(['callback'])

/**
 * advance query
 */
const advanceQuery = () => {
	// callback
	emit('callback', state.advanceQuery)
}
</script>

<style scoped>
.el-form-item{margin-bottom:20px;}
</style>