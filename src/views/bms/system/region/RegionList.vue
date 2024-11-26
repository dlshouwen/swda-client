<template>
	<!-- container -->
	<div class="container">
		<!-- search -->
		<div class="panel search-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="search">查询面板</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="default" :underline="false" icon="search" @click.stop="load" divider>查询 (Q)</sw-link>
					<sw-link class="link-layout" type="warning" :underline="false" icon="refresh-left" @click.stop="reset">重置 (R)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div class="search">
					<label>区域编号：</label>
					<span><el-input v-model="search.eq_regionId" placeholder="请输入区域编号"></el-input></span>
					<label>区域名称：</label>
					<span><el-input v-model="search.lk_regionName" placeholder="请输入区域名称"></el-input></span>
					<label style="flex-basis:42px;">启用：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_isOpen" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.zero_one" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label style="flex-basis:42px;">热门：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_isHot" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.zero_one" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="location">区域管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addRegion();" permission="bms:system:region:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateRegion();" permission="bms:system:region:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteRegion();" permission="bms:system:region:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<sw-grid ref="regionGrid" id="region_list" title="区域列表" url="/bms/system/region/list" row-key="regionId" :search="search" :height="height"
						tree lazy tree-prop="regionName" :tree-expand-node-props="{width:140, label:'区域名称', headerAlign:'center'}" :tree-top-value="0" :datas-render="datasRender"
						@row-dblclick="row=>{updateRegion(row.regionId)}" @selection-change="selection=>{selectRegions=selection}">
						<sw-column type="selection" key="regionId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="80" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="plus" @click.stop="addRegion(scope.row.regionId)" permission="bms:system:region:add" divider></sw-link>
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateRegion(scope.row.regionId)" permission="bms:system:region:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteRegion(scope.row.regionId)" permission="bms:system:region:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="regionId" label="区域编号" width="90" data-type="number" fast="eq"></sw-column>
						<sw-column id="regionType" label="区域类型" width="90" :dict="dataStore.dict.region_type" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="regionName" label="区域名称" width="100" fast="lk"></sw-column>
						<sw-column id="regionFullName" label="区域全名" width="240" align="left" fast="lk"></sw-column>
						<sw-column id="regionNamePinyin" label="简拼" width="100" fast="lk"></sw-column>
						<sw-column id="regionNameFullPinyin" label="全拼" width="200" align="left" fast="lk"></sw-column>
						<sw-column id="postalCode" label="邮政编码" width="100" fast="lk"></sw-column>
						<sw-column id="isOpen" label="启用" width="60" :dict="dataStore.dict.zero_one" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="isHot" label="热门" width="60" :dict="dataStore.dict.zero_one" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="sort" label="排序" width="60" data-type="number" fast="range"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="新增" center width="480px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddRegion :regionId="currentRegionId"></AddRegion>
		</el-dialog>
		<el-dialog title="编辑" center width="480px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateRegion :regionId="currentRegionId"></UpdateRegion>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get region list, delete region
import { $getRegionList, $deleteRegion } from '@/assets/config/api';

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

// import components: add region & update region
import AddRegion from '@/views/bms/system/region/AddRegion';
import UpdateRegion from '@/views/bms/system/region/UpdateRegion';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_region_id: '', lk_region_name: '', eq_is_open: '', eq_is_hot: '' },
	// show
	show: { add: false, update: false },
	// current region id
	currentRegionId: '',
	// select regions
	selectRegions: [],
});

// to refs
const { height, search, show, currentRegionId, selectRegions } = toRefs(state);

// ref
const regionGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_regionId: '', lk_regionName: '', eq_isOpen: '', eq_isHot: '' };
}

/**
 * resize
 */
const resize = () => {
	state.height = gridContainer.value.offsetHeight-36;
}

/**
 * load
 */
const load = () => {
	regionGrid.value.load();
}

/**
 * data render
 * @param datas
 */
const datasRender = (datas) => {
	// set has children / children
	datas.forEach(data=>{
		data.hasChildren = data.info.children>0;
		data.children = [];
	});
	// return
	return datas;
}

/**
 * add region
 */
const addRegion = (regionId) => {
	// param invalid
	if(regionId===undefined||regionId===null){
		// no select
		if(state.selectRegions.length>0){
			// set first select
			regionId = state.selectRegions[0].regionId;
		}
	}
	// set current region id
	state.currentRegionId = regionId;
	// show add region
	state.show.add = true;
}

/**
 * update region
 * @param regionId
 */
const updateRegion = (regionId) => {
	// param invalid
	if(regionId===undefined||regionId===null){
		// no select
		if(state.selectRegions.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		regionId = state.selectRegions[0].regionId;
	}
	// set current region id
	state.currentRegionId = regionId;
	// show update region
	state.show.update = true;
}

/**
 * delete region
 * @param regionIds
 */
const deleteRegion = (regionIds) => {
	// param invalid
	if(!regionIds){
		// no select
		if(state.selectRegions.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		regionIds = state.selectRegions.map(region=>region.regionId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除区域信息？', '警告').then(()=>{
		// delete region
		$deleteRegion({regionIds:regionIds}).then(handler=>{
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

// load data
onMounted(()=>{
	load();
})

// set grid height
window.onresize = resize;
nextTick(resize);

// hotkey
key('alt+q', ()=>{ load();return false; });
key('alt+r', ()=>{ reset();return false; });
key('alt+a', ()=>{ addRegion();return false; });
key('alt+u', ()=>{ updateRegion();return false; });
key('alt+d', ()=>{ deleteRegion();return false; });
</script>