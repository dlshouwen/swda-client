<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="plus">新增区域</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="regionForm" :model="region">
					<!-- items -->
					<sw-form-item type="cascader" prop="preRegionId" v-model="selectRegions" label="上级区域" @change="regionChange" :item-props="{options:selectRegionOptions, clearable:true, props:{checkStrictly:true}}"></sw-form-item>
					<sw-form-item type="text" prop="regionId" v-model="region.regionId" label="区域编号" valid="r|number|le6-le6" :valid-unique="{code:'region.id.add', args:[]}"></sw-form-item>
					<sw-form-item type="radio" prop="regionType" v-model="region.regionType" label="区域类型" :items="dataStore.dict.region_type" valid="r"></sw-form-item>
					<sw-form-item type="text" prop="regionName" v-model="region.regionName" label="区域名称" valid="r|l-le200"></sw-form-item>
					<sw-form-item type="text" prop="regionFullName" v-model="region.regionFullName" label="区域全名" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="regionNamePinyin" v-model="region.regionNamePinyin" label="区域简拼" valid="r|l-le200"></sw-form-item>
					<sw-form-item type="text" prop="regionNameFullPinyin" v-model="region.regionNameFullPinyin" label="区域全拼" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="postalCode" v-model="region.postalCode" label="邮政编码" valid="r|le6-le6"></sw-form-item>
					<sw-form-item type="radio" prop="isOpen" v-model="region.isOpen" label="启用" :items="dataStore.dict.zero_one" valid="r"></sw-form-item>
					<sw-form-item type="radio" prop="isHot" v-model="region.isHot" label="热门" :items="dataStore.dict.zero_one" valid="r"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="region.sort" label="排序码" valid="r|integer"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="addRegion" permission="bms:system:region:add">保存 (S)</sw-button>
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

// import requests: get region cascader list, get region data, add region
import { $getRegionCascaderList, $getRegionData, $addRegion } from '@/assets/config/api';

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
	// region
	region: { info:{} }
});

// to refs
const { selectRegionOptions, selectRegions, region } = toRefs(state);

// props
const props = defineProps(['regionId'])

// ref
const regionForm = ref()

/**
 * reset
 */
const reset = () => {
	// get region cascader list
	getRegionCascaderList();
	// get region data
	getRegionData();
}

/**
 * get region cascader list
 */
const getRegionCascaderList = () => {
	// get region cascader list
	$getRegionCascaderList().then(handler=>{
		// set select region options
		state.selectRegionOptions = handler.data.data.cascaderItems;
		// set select regions
		setSelectRegions();
	});
}

/**
 * set select regions
 */
const setSelectRegions = () => {
	// if has region id
	if(props.regionId){
		// set select regions
		state.selectRegions = tool.searchCascaderId(state.selectRegionOptions, props.regionId, 0);
	}
	// region change
	regionChange(state.selectRegions);
}

/**
 * region change
 * @param value
 */
const regionChange = (value) => {
	// set pre region id
	state.region.preRegionId = (value&&value.length>0)?value[value.length-1]:0;
}

/**
 * get region data
 */
const getRegionData = () => {
	// get region data
	$getRegionData({regionId:null}).then(handler=>{
		// set region
		state.region = handler.data.data.region;
	});
}

/**
 * add region
 */
const addRegion = () => {
	// valid
	regionForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定新增区域信息？', '提示').then(()=>{
				// add region
				$addRegion(state.region).then(handler=>{
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
watch(()=>props.regionId, ()=>{ reset() }, {deep: true}) 
watch(()=>state.region.regionName, (value)=>{
	if(value){
		state.region.regionNamePinyin = tool.getFirstSpell(value);
		state.region.regionNameFullPinyin = tool.getFullSpell(value);
	}else{
		state.region.regionNamePinyin = '';
		state.region.regionNameFullPinyin = '';
	}
}, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ addRegion();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>