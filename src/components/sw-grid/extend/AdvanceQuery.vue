<template>
	<!-- container -->
	<div class="container">
		<!-- container left -->
		<div class="container-left">
			<!-- advance query panel -->
			<div class="panel">
				<!-- advance query panel header -->
				<div class="panel-header">
					<div class="panel-title"><el-link :icon="language.advance.list.title.icon">{{language.advance.list.title.text}}</el-link></div>
				</div>
				<!-- advance query panel body -->
				<div id="advance_query_container" class="panel-body">
					<!-- advance query link -->
					<el-link v-for="advanceQuery in advanceQuerys" :key="advanceQuery.advanceQueryId" :class="advanceQuery.advanceQueryId==advanceQueryId?'active':''" :underline="false" @click="getAdvanceQueryData(advanceQuery.advanceQueryId);">{{advanceQuery.advanceQueryName}}</el-link>
				</div>
			</div>
		</div>
		<!-- container right -->
		<div class="container-right">
			<!-- advance query form -->
			<el-form ref="advanceQueryForm" label-width="68px" :model="advanceQuery" :show-message="false" :status-icon="false">
			<div class="panel" style="margin-left:0;">
				<div class="panel-header">
					<div class="panel-title">
						<el-link :icon="language.advance.main.title.icon">{{language.advance.main.title.text}}</el-link>
					</div>
					<div class="panel-btns">
						<el-link class="link-layout" type="primary" :underline="false" :loading="loading" :icon="language.advance.main.buttons.add.icon" @click="addAdvanceQuery">{{language.advance.main.buttons.add.text}}</el-link>
						<el-divider direction="vertical"></el-divider>
						<el-link class="link-layout" type="primary" :underline="false" :icon="language.advance.main.buttons.update.icon" @click="updateAdvanceQuery">{{language.advance.main.buttons.update.text}}</el-link>
						<el-divider direction="vertical"></el-divider>
						<el-link class="link-layout" type="warning" :underline="false" :icon="language.advance.main.buttons.copy.icon" @click="copyAdvanceQuery">{{language.advance.main.buttons.copy.text}}</el-link>
						<el-divider direction="vertical"></el-divider>
						<el-link class="link-layout" type="danger" :underline="false" :icon="language.advance.main.buttons.delete.icon" @click="deleteAdvanceQuery">{{language.advance.main.buttons.delete.text}}</el-link>
						<el-divider direction="vertical"></el-divider>
						<el-link class="link-layout" type="success" :underline="false" :icon="language.advance.main.buttons.sure.icon" @click="doAdvanceQuery">{{language.advance.main.buttons.sure.text}}</el-link>
					</div>
				</div>
				<div class="panel-body" style="padding:4px 0;">
					<el-row>
						<el-col :span="6">
							<el-form-item :label="language.advance.main.name.text" prop="advanceQueryName" :rules="{ valid:'r|l-l400', label:language.advance.main.name.text, type:'input', validator:validator, trigger:'change' }">
								<span :ref="setItemRef" id="advanceQueryName"><el-input v-model="advanceQuery.advanceQueryName" :placeholder="language.advance.main.name.placeholder"></el-input></span>
							</el-form-item>
						</el-col>
						<el-col :span="18">
							<el-form-item :label="language.advance.main.remark.text" prop="remark" :rules="{ valid:'r|l-l200', label:language.advance.main.remark.text, type:'input', validator:validator, trigger:'change' }">
								<span :ref="setItemRef" id="remark"><el-input v-model="advanceQuery.remark" :placeholder="language.advance.main.remark.placeholder"></el-input></span>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</div>
			<!-- advance query tab -->
			<el-tabs v-model="tab.active" style="padding:0;margin:2px 4px 0 0;">
				<!-- advance query conditions -->
				<el-tab-pane key="conditions" name="conditions" style="height:541px;">
					<template #label>
						<span><el-link :icon="language.advance.condition.title.icon" :underline="false"> {{language.advance.condition.title.text}}</el-link></span>
					</template>
					<div class="operation">
						<el-link class="link-layout" type="success" :underline="false" :icon="language.advance.condition.buttons.insert.icon" @click="insertCondition">{{language.advance.condition.buttons.insert.text}}</el-link>
						<el-divider direction="vertical"></el-divider>
						<el-link class="link-layout" type="danger" :underline="false" :icon="language.advance.condition.buttons.clear.icon" @click="clearCondition">{{language.advance.condition.buttons.clear.text}}</el-link>
					</div>
					<el-table :data="advanceQuery.conditionList" border height="517">
						<el-table-column prop="index" header-align="center" align="center" :label="language.advance.condition.column.sequence" width="40">
							<template #default="scope">{{scope.$index+1}}</template>
						</el-table-column>
						<el-table-column prop="leftParentheses" header-align="center" align="center" :label="language.advance.condition.column.leftParentheses" width="60">
							<template #default="scope">
								<el-form-item label-width="0" :prop="'leftParentheses_'+scope.row.conditionId" :rules="{ valid:'only_left_parentheses|l-le10', label:language.advance.condition.column.leftParentheses, obj:'conditionList', no:scope.$index, item:'leftParentheses', type:'input', message:language.advance.condition.errors.left_parentheses_error, validator:validator, trigger:'change' }">
									<span :ref="setItemRef" :id="'leftParentheses_'+scope.row.conditionId"><el-input v-model="scope.row.leftParentheses"></el-input></span>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionField" header-align="center" align="center" :label="language.advance.condition.column.field" width="160">
							<template #default="scope">
								<el-form-item label-width="0" :prop="'conditionField_'+scope.row.conditionId" :rules="{ valid:'r', label:language.advance.condition.column.field, obj:'conditionList', no:scope.$index, item:'conditionField', type:'input', validator:validator, trigger:'change' }">
									<span :ref="setItemRef" :id="'conditionField_'+scope.row.conditionId">
										<el-select v-model="scope.row.conditionField" @change="scope.row.conditionValue=''" placeholder="">
											<template v-for="column in columns">
												<el-option v-if="column.advance" :label="column.label" :value="column.id"></el-option>
											</template>
										</el-select>
									</span>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionType" header-align="center" align="center" :label="language.advance.condition.column.condition" width="94">
							<template #default="scope">
								<el-form-item label-width="0" :prop="'conditionType_'+scope.row.conditionId" :rules="{ valid:'r', label:language.advance.condition.column.condition, obj:'conditionList', no:scope.$index, item:'conditionType', type:'input', validator:validator, trigger:'change' }">
									<span :ref="setItemRef" :id="'conditionType_'+scope.row.conditionId">
										<el-select v-model="scope.row.conditionType" placeholder="">
											<el-option v-for="(value, key) in dataStore.dict.condition_type" :key="key" :label="value" :value="key"></el-option>
										</el-select>
									</span>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionValue" header-align="center" align="center" :label="language.advance.condition.column.value" width="188">
							<template #default="scope">
								<template v-if="scope.row.conditionField">
									<template v-if="column[scope.row.conditionField].dict">
										<el-form-item label-width="0" :prop="'conditionValue_'+scope.row.conditionId" :rules="{ valid:'', label:column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<span :ref="setItemRef" :id="'conditionValue_'+scope.row.conditionId">
												<el-select v-model="scope.row.conditionValue" placeholder="">
													<el-option label="" value=""></el-option>
													<el-option v-for="(value, key) in column[scope.row.conditionField].dict" :key="key" :label="value" :value="key"></el-option>
												</el-select>
											</span>
										</el-form-item>
									</template>
									<template v-else-if="column[scope.row.conditionField].type=='number'">
										<el-form-item label-width="0" :prop="'conditionValue_'+scope.row.conditionId" :rules="{ valid:'r|double', label:column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<span :ref="setItemRef" :id="'conditionValue_'+scope.row.conditionId"><el-input v-model="scope.row.conditionValue"></el-input></span>
										</el-form-item>
									</template>
									<template v-else-if="column[scope.row.conditionField].type=='date'">
										<el-form-item label-width="0" :prop="'conditionValue_'+scope.row.conditionId" :rules="{ valid:'r', label:column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<span :ref="setItemRef" :id="'conditionValue_'+scope.row.conditionId"><el-date-picker v-model="scope.row.conditionValue" type="datetime" :value-format="column[scope.row.conditionField].format" :format="column[scope.row.conditionField].format"></el-date-picker></span>
										</el-form-item>
									</template>
									<template v-else>
										<el-form-item label-width="0" :prop="'conditionValue_'+scope.row.conditionId" :rules="{ valid:'', label:column[scope.row.conditionField].label, obj:'conditionList', no:scope.$index, item:'conditionValue', type:'input', validator:validator, trigger:'change' }">
											<span :ref="setItemRef" :id="'conditionValue_'+scope.row.conditionId"><el-input v-model="scope.row.conditionValue"></el-input></span>
										</el-form-item>
									</template>
								</template>
							</template>
						</el-table-column>
						<el-table-column prop="rightParentheses" header-align="center" align="center" :label="language.advance.condition.column.rightParentheses" width="60">
							<template #default="scope">
								<el-form-item label-width="0" :prop="'rightParentheses_'+scope.row.conditionId" :rules="{ valid:'only_right_parentheses|l-le10', label:language.advance.condition.column.rightParentheses, obj:'conditionList', no:scope.$index, item:'rightParentheses', type:'input', message:language.advance.condition.errors.right_parentheses_error, validator:validator, trigger:'change' }">
									<span :ref="setItemRef" :id="'rightParentheses_'+scope.row.conditionId"><el-input v-model="scope.row.rightParentheses"></el-input></span>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="conditionLogic" header-align="center" align="center" :label="language.advance.condition.column.logic" width="72">
							<template #default="scope">
								<el-form-item label-width="0" :prop="'conditionLogic_'+scope.row.conditionId" :rules="{ valid:'', label:language.advance.condition.column.logic, obj:'conditionList', no:scope.$index, item:'conditionLogic', type:'input', validator:validator, trigger:'change' }">
									<span :ref="setItemRef" :id="'conditionLogic_'+scope.row.conditionId">
										<el-select v-model="scope.row.conditionLogic" placeholder="">
											<el-option label="" value=""></el-option>
											<el-option v-for="(value, key) in dataStore.dict.condition_logic" :key="key" :label="value" :value="key"></el-option>
										</el-select>
									</span>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="operation" header-align="center" align="center" :label="language.advance.condition.column.operation" width="72">
							<template #default="scope">
								<el-link type="primary" :underline="false" :title="language.advance.condition.column.buttons.up.title" :icon="language.advance.condition.column.buttons.up.icon" @click="moveCondition('up', scope.$index)"></el-link>
								<el-link type="primary" :underline="false" :title="language.advance.condition.column.buttons.down.title" :icon="language.advance.condition.column.buttons.down.icon" @click="moveCondition('down', scope.$index)"></el-link>
								<el-link type="danger" :underline="false" :title="language.advance.condition.column.buttons.delete.title" :icon="language.advance.condition.column.buttons.delete.icon" @click="deleteCondition(scope.$index)"></el-link>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- advance query sorts -->
				<el-tab-pane key="sorts" name="sorts" style="height:541px;">
					<template #label>
						<span><el-link :icon="language.advance.sort.title.icon" :underline="false"> {{language.advance.sort.title.text}}</el-link></span>
					</template>
					<div class="operation">
						<el-link class="link-layout" type="success" :underline="false" :icon="language.advance.sort.buttons.insert.icon" @click="insertSort">{{language.advance.sort.buttons.insert.text}}</el-link>
						<el-divider direction="vertical"></el-divider>
						<el-link class="link-layout" type="danger" :underline="false" :icon="language.advance.sort.buttons.clear.icon" @click="clearSort">{{language.advance.sort.buttons.clear.text}}</el-link>
					</div>
					<el-table :data="advanceQuery.sortList" border height="517">
						<el-table-column prop="index" header-align="center" align="center" :label="language.advance.sort.column.sequence" width="40">
							<template #default="scope">{{scope.$index+1}}</template>
						</el-table-column>
						<el-table-column prop="sortField" header-align="center" align="center" :label="language.advance.sort.column.field" width="160">
							<template #default="scope">
								<el-form-item label-width="0" :prop="'sortField_'+scope.row.sortId" :rules="{ valid:'r', label:language.advance.sort.column.field, obj:'sortList', no:scope.$index, item:'sortField', type:'input', validator:validator, trigger:'change' }">
									<span :ref="setItemRef" :id="'sortField_'+scope.row.sortId">
										<el-select v-model="scope.row.sortField" placeholder="">
											<template v-for="column in columns">
												<el-option v-if="column.advance" :label="column.label" :value="column.id"></el-option>
											</template>
										</el-select>
									</span>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="sortLogic" header-align="center" align="center" :label="language.advance.sort.column.logic" width="72">
							<template #default="scope">
								<el-form-item label-width="0" :prop="'sortLogic_'+scope.row.sortId" :rules="{ valid:'r', label:language.advance.sort.column.logic, obj:'sortList', no:scope.$index, item:'sortLogic', type:'input', validator:validator, trigger:'change' }">
									<span :ref="setItemRef" :id="'sortLogic_'+scope.row.sortId">
										<el-select v-model="scope.row.sortLogic" placeholder="">
											<el-option v-for="(value, key) in dataStore.dict.sort_logic" :key="key" :label="value" :value="key"></el-option>
										</el-select>
									</span>
								</el-form-item>
							</template>
						</el-table-column>
						<el-table-column prop="operation" header-align="center" align="center" :label="language.advance.sort.column.operation" width="72">
							<template #default="scope">
								<el-link type="primary" :underline="false" :title="language.advance.sort.column.buttons.up.title" :icon="language.advance.sort.column.buttons.up.icon" @click="moveSort('up', scope.$index)"></el-link>
								<el-link type="primary" :underline="false" :title="language.advance.sort.column.buttons.down.title" :icon="language.advance.sort.column.buttons.down.icon" @click="moveSort('down', scope.$index)"></el-link>
								<el-link type="danger" :underline="false" :title="language.advance.sort.column.buttons.delete.title" :icon="language.advance.sort.column.buttons.delete.icon" @click="deleteSort(scope.$index)"></el-link>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
			</el-form>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & inject
import { ref, reactive, toRefs, inject } from 'vue'

// import tool
import * as tool from '../tool/tool';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// parentheses validation
const parenthesesValidation = {
	format: {
		only_left_parentheses: function(rule, value, callback, item, option, lang){
			if (value.replaceAll('(', '').length>0) {
				var message = rule.message;
				if(option.style=='title') item.title = message;
				if(option.style=='tooltip') item.content = message;
				callback(new Error(message));
				return;
			}
			if(option.style=='title') item.title = '';
			if(option.style=='tooltip') item.content = '';
			callback();
		},
		only_right_parentheses: function(rule, value, callback, item, option, lang){
			if (value.replaceAll(')', '').length>0) {
				var message = rule.message;
				if(option.style=='title') item.title = message;
				if(option.style=='tooltip') item.content = message;
				callback(new Error(message));
				return;
			}
			if(option.style=='title') item.title = '';
			if(option.style=='tooltip') item.content = '';
			callback();
		}
	}
};

// props
const props = defineProps(['language', 'option', 'server', 'columns', 'column', 'params'])

// const state
const state = reactive({
	// loading
	loading: false,
	// tab
	tab: { active: 'conditions' },
	// sequence
	sequence: { condition: 0, sort: 0 },
	// current advance query id
	advanceQueryId: '',
	// advance query
	advanceQuery: { advanceQueryId: 0, advanceQueryName: '', functionCode: props.option.advance, remark: '', conditionList: [], sortList: [] },
	// advance query list
	advanceQuerys: []
});

// to refs
const { loading, tab, sequence, advanceQueryId, advanceQuery, advanceQuerys } = toRefs(state);

// inject
const _advanceQuery = inject('advanceQuery');

// ref
const advanceQueryForm = ref()

// ref item
const itemRefs = []
const setItemRef = el => {
	if (el) {
		itemRefs[el.id] = el
	}
}

/**
 * validator
 * @prarm rule
 * @prarm value
 * @prarm callback
 */
const validator = (rule, value, callback) => {
	if(rule.obj){
		props.option.validation(rule, state.advanceQuery[rule.obj][rule.no][rule.item], callback, itemRefs[rule.field], parenthesesValidation);
	}else{
		props.option.validation(rule, value, callback, itemRefs[rule.field]);
	}
}

/**
 * do advance query
 */
const doAdvanceQuery = () => {
	_advanceQuery(state.advanceQuery);
}

/**
 * get advance query list
 */
const getAdvanceQueryList = () => {
	// get advance query list
	props.option.request({url:props.server+'/advance_query/list', method:'post', params:{functionCode:props.option.advance}}).then(handler=>{
		// set datas
		state.advanceQuerys = handler.data.data.advanceQueryList;
	});
}

/**
 * get advance query data
 * @prarm advanceQueryId
 */
const getAdvanceQueryData = (advanceQueryId) => {
	// set current advance query id
	state.advanceQueryId = advanceQueryId;
	// get advance query data
	props.option.request({url:props.server+'/advance_query/data', method:'post', params:{advanceQueryId:state.advanceQueryId}}).then(handler=>{
		// set data
		state.advanceQuery = handler.data.data.advanceQuery;
	});
}

/**
 * add advance query
 */
const addAdvanceQuery = () => {
	// set loading
	state.loading = true;
	// valid
	advanceQueryForm.value.validate((valid)=>{
		if(valid){
			// confirm
			props.option.messageBox.confirm(props.language.advance.main.message.add.content, props.language.advance.main.message.add.title).then(()=>{
				// add advance query
				props.option.request({url:props.server+'/advance_query/add', method:'post', data:state.advanceQuery}).then(handler=>{
					// success
					if(handler.data.result){
						// show message
						props.option.message.success(handler.data.message);
						// get advance query list
						getAdvanceQueryList();
					}else{
						props.option.message.warning(handler.data.message);
					}
					state.loading = false;
				});
			}).catch(()=>{
				state.loading = false;
			});
		}
	});
}

/**
 * update advance query
 */
const updateAdvanceQuery = () => {
	// no current
	if(state.advanceQueryId===''){
		props.option.message.warning(props.language.advance.main.message.update.nothing);
		return;
	}
	// set loading
	state.loading = true;
	// valid
	advanceQueryForm.value.validate((valid)=>{
		if(valid){
			// confirm
			props.option.messageBox.confirm(props.language.advance.main.message.update.content, props.language.advance.main.message.update.title).then(()=>{
				// update advance query
				props.option.request({url:props.server+'/advance_query/update', method:'post', data:state.advanceQuery}).then(handler=>{
					// success
					if(handler.data.result){
						// show message
						props.option.message.success(handler.data.message);
						// get advance query list
						getAdvanceQueryList();
					}else{
						props.option.message.warning(handler.data.message);
					}
					state.loading = false;
				});
			}).catch(()=>{
				state.loading = false;
			});
		}
	});
}

/**
 * copy advance query
 */
const copyAdvanceQuery = () => {
	// no current
	if(state.advanceQueryId===''){
		props.option.message.warning(props.language.advance.main.message.copy.nothing);
		return;
	}
	// set loading
	state.loading = true;
	// confirm
	props.option.messageBox.confirm(props.language.advance.main.message.copy.content, props.language.advance.main.message.copy.title).then(()=>{
		// copy advance query
		props.option.request({url:props.server+'/advance_query/copy', method:'post', params:{advanceQueryId:state.advanceQueryId}}).then(handler=>{
			// success
			if(handler.data.result){
				// show message
				props.option.message.success(handler.data.message);
				// get advance query list
				getAdvanceQueryList();
			}else{
				props.option.message.warning(handler.data.message);
			}
			state.loading = false;
		});
	}).catch(()=>{
		state.loading = false;
	});
}

/**
 * delete advance query
 */
const deleteAdvanceQuery = () => {
	// no current
	if(state.advanceQueryId===''){
		props.option.message.warning(props.language.advance.main.message.delete.nothing);
		return;
	}
	// set loading
	state.loading = true;
	// confirm
	props.option.messageBox.confirm(props.language.advance.main.message.delete.content, props.language.advance.main.message.delete.title).then(()=>{
		// delete advance query
		props.option.request({url:props.server+'/advance_query/delete', method:'post', params:{advanceQueryId:state.advanceQueryId}}).then(handler=>{
			// success
			if(handler.data.result){
				// show message
				props.option.message.success(handler.data.message);
				// get advance query list
				getAdvanceQueryList();
				// reset advance query
				state.advanceQueryId = '';
				state.advanceQuery.advanceQueryId = 0;
				state.advanceQuery.advanceQueryName = '';
				state.advanceQuery.remark = '';
			}else{
				props.option.message.warning(handler.data.message);
			}
			state.loading = false;
		});
	}).catch(()=>{
		state.loading = false;
	});
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
	props.option.messageBox.confirm(props.language.advance.condition.message.clear.content, props.language.advance.condition.message.clear.title).then(()=>{
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
	props.option.messageBox.confirm(props.language.advance.sort.message.clear.content, props.language.advance.sort.message.clear.title).then(()=>{
		state.advanceQuery.sortList = [];
	}).catch(()=>{});
}

// get advance query list
getAdvanceQueryList();
</script>

<style scoped>
/** container */
.container{display:flex;flex-direction:row;}
.container-left{flex-basis:200px;flex-grow: 0;}
.container-right{flex-grow:1;}

/** advance query container */
#advance_query_container{height:600px;overfloat:auto;}
#advance_query_container a{display:block;border:1px solid #eee;font-size:12px;color:#666;margin:4px;padding:4px 6px;text-decoration:none;transition:transform 1s;}
#advance_query_container a:hover{border-color:#409EFF;}
#advance_query_container a.active{border-color:#409EFF;background:#409eff;color:white;}

/** el form */
.el-form{padding:0;}
.el-form-item{margin:0;}
.el-date-editor.el-input, .el-date-editor.el-input__inner{width:100%;}
.el-date-editor.el-input--suffix .el-input__inner{padding-right:0;}
.el-form-item__content>span{margin-bottom:0;}

/** operation */
.operation{text-align:right;height:24px;line-height:24px;border-bottom:1px solid #f0f0f0;padding:0 8px;}
</style>