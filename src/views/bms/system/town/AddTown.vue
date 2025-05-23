<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="plus">新增街道</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="townForm" :model="town">
					<!-- items -->
					<sw-form-item type="cascader" prop="countyId" v-model="selectRegions" label="所属区域" valid="r" @change="regionChange" :item-props="{options:selectRegionOptions, clearable:true}"></sw-form-item>
					<sw-form-item type="text" prop="townId" v-model="town.townId" label="街道编号" valid="r|integer" :valid-unique="{code:'region.id.add', args:[]}"></sw-form-item>
					<sw-form-item type="text" prop="townName" v-model="town.townName" label="街道名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="townFullName" v-model="town.townFullName" label="街道全名" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="townNamePinyin" v-model="town.townNamePinyin" label="街道简拼" valid="r|l-le200"></sw-form-item>
					<sw-form-item type="text" prop="townNameFullPinyin" v-model="town.townNameFullPinyin" label="街道全拼" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="postalCode" v-model="town.postalCode" label="邮政编码" valid="r|le6-le6"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="town.sort" label="排序码" valid="r|integer"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="addTown" permission="bms:system:town:add">保存 (S)</sw-button>
						<sw-button type="warning" :underline="false" icon="refresh-left" @click="reset">重置 (R)</sw-button>
					</sw-form-item>
				</sw-form>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get region cascader list, get town data, add town
import { $getRegionCascaderList, $getTownData, $addTown } from '@/assets/config/api';

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
	// select region options
	selectRegionOptions: [],
	// select regions
	selectRegions: [],
	// town
	town: { info:{} }
});

// to refs
const { selectRegionOptions, selectRegions, town } = toRefs(state);

// ref
const townForm = ref()

/**
 * reset
 */
const reset = () => {
	// reset data
	state.selectRegions = [];
	// get region cascader list
	getRegionCascaderList();
	// get town data
	getTownData();
}

/**
 * get region cascader list
 */
const getRegionCascaderList = () => {
	// get region cascader list
	$getRegionCascaderList().then(handler=>{
		// set select region options
		state.selectRegionOptions = handler.data.data.cascaderItems;
	});
}

/**
 * region change
 * @param value
 */
const regionChange = (value) => {
	// set province id
	state.town.provinceId = (value&&value.length>0)?value[0]:'';
	// set city id
	state.town.cityId = (value&&value.length>1)?value[1]:'';
	// set county id
	state.town.countyId = (value&&value.length>2)?value[2]:'';
}

/**
 * get town data
 */
const getTownData = () => {
	// get town data
	$getTownData({townId:-1}).then(handler=>{
		// set town
		state.town = handler.data.data.town;
	});
}

/**
 * add town
 */
const addTown = () => {
	// valid
	townForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定新增街道信息？', '提示').then(()=>{
				// add town
				$addTown(state.town).then(handler=>{
					// success
					if(handler.data.result){
						// message
						ElMessage.success(handler.data.message);
						// reset
						reset();
					}
				});
			}).catch(()=>{});
		}
	});
}

// watch
watch(()=>state.town.townName, (value)=>{
	if(value){
		state.town.townNamePinyin = tool.getFirstSpell(value);
		state.town.townNameFullPinyin = tool.getFullSpell(value);
	}else{
		state.town.townNamePinyin = '';
		state.town.townNameFullPinyin = '';
	}
}, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ addTown();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>