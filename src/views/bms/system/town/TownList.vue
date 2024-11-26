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
					<label>所属城市：</label>
					<span><el-cascader v-model="selectRegions" :options="selectRegionOptions" @change="regionChange" :props="{checkStrictly:true}" clearable></el-cascader></span>
					<label>街道编号：</label>
					<span><el-input v-model="search.eq_town_id" placeholder="请输入街道编号"></el-input></span>
					<label>街道名称：</label>
					<span><el-input v-model="search.lk_town_name" placeholder="请输入街道名称"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="guide">街道管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addTown();" permission="bms:system:town:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateTown();" permission="bms:system:town:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteTown();" permission="bms:system:town:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<sw-grid ref="townGrid" id="town_list" title="街道列表" url="/bms/system/town/list" row-key="townId" :search="search" :height="height"
						@row-dblclick="row=>{updateTown(row.townId)}" @selection-change="selection=>{selectTowns=selection}">
						<sw-column type="selection" key="townId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="60" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateTown(scope.row.townId)" permission="bms:system:town:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteTown(scope.row.townId)" permission="bms:system:town:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="provinceName" label="区域信息" header-align="center">
							<sw-column id="provinceName" label="所属省" width="100" :merge="['provinceId']" fast="lk" info></sw-column>
							<sw-column id="cityName" label="所属市" width="100" :merge="['cityId']" fast="lk" info></sw-column>
							<sw-column id="countyName" label="所属区" width="100" :merge="['countyId']" fast="lk" info></sw-column>
						</sw-column>
						<sw-column label="基本信息" header-align="center">
							<sw-column id="townId" label="街道编号" width="100" fast="lk"></sw-column>
							<sw-column id="townName" label="街道名称" width="100" fast="lk"></sw-column>
							<sw-column id="townFullName" label="街道全名" width="280" align="left" fast="lk"></sw-column>
						</sw-column>
						<sw-column label="其他信息" header-align="center">
							<sw-column id="townNamePinyin" label="街道拼音" width="100" fast="lk"></sw-column>
							<sw-column id="townNameFullPinyin" label="街道全拼" width="200" fast="lk"></sw-column>
							<sw-column id="postalCode" label="邮政编码" width="90" fast="lk"></sw-column>
						</sw-column>
						<sw-column id="sort" label="排序" width="60" data-type="number" fast="range"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="新增" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddTown></AddTown>
		</el-dialog>
		<el-dialog title="编辑" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateTown :townId="currentTownId"></UpdateTown>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get region cascader list, get town list, delete town
import { $getRegionCascaderList, $getTownList, $deleteTown } from '@/assets/config/api';

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

// import components: add town & update town
import AddTown from '@/views/bms/system/town/AddTown';
import UpdateTown from '@/views/bms/system/town/UpdateTown';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_province_id:'', eq_city_id:'', eq_county_id:'', eq_town_id: '', lk_town_name: '' },
	// show
	show: { add: false, update: false },
	// current town id
	currentTownId: '',
	// select towns
	selectTowns: [],
	// select region options
	selectRegionOptions: [],
	// select regions
	selectRegions: [],
});

// to refs
const { height, search, show, currentTownId, selectTowns, selectRegionOptions, selectRegions } = toRefs(state);

// ref
const townGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_province_id:'', eq_city_id:'', eq_county_id:'', eq_town_id: '', lk_town_name: '' };
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
	townGrid.value.load();
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
	state.search.eq_province_id = value&&value.length>0?value[0]:'';
	// set city id
	state.search.eq_city_id = value&&value.length>1?value[1]:'';
	// set county id
	state.search.eq_county_id = value&&value.length>2?value[2]:'';
}

/**
 * add town
 */
const addTown = () => {
	state.show.add = true;
}

/**
 * update town
 * @param townId
 */
const updateTown = (townId) => {
	// param invalid
	if(townId===undefined||townId===null){
		// no select
		if(state.selectTowns.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		townId = state.selectTowns[0].townId;
	}
	// set current town id
	state.currentTownId = townId;
	// show update town
	state.show.update = true;
}

/**
 * delete town
 * @param townIds
 */
const deleteTown = (townIds) => {
	// param invalid
	if(!townIds){
		// no select
		if(state.selectTowns.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		townIds = state.selectTowns.map(town=>town.townId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除街道信息？', '警告').then(()=>{
		// delete town
		$deleteTown({townIds:townIds}).then(handler=>{
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

// get region cascader list
getRegionCascaderList();

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
key('alt+a', ()=>{ addTown();return false; });
key('alt+u', ()=>{ updateTown();return false; });
key('alt+d', ()=>{ deleteTown();return false; });
</script>