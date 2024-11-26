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
					<span><el-cascader v-model="selectRegions" :options="selectRegionOptions" @change="handleRegionChange" :props="{checkStrictly:true}" clearable></el-cascader></span>
					<label>机构编号：</label>
					<span><el-input v-model="search.eq_organ_id" placeholder="请输入机构编号"></el-input></span>
					<label>机构编码：</label>
					<span><el-input v-model="search.lk_organ_code" placeholder="请输入机构编码"></el-input></span>
					<label>机构名称：</label>
					<span><el-input v-model="search.lk_organ_name" placeholder="请输入机构名称"></el-input></span>
					<label>辅助查询：</label>
					<span style="flex:1;"><el-input style="width:100%;" v-model="search.lk_assist_search" placeholder="请输入辅助查询"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="organ">机构管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addOrgan();" permission="bms:system:organ:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateOrgan();" permission="bms:system:organ:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteOrgan();" permission="bms:system:organ:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="organGrid" id="organ_list" title="机构列表" url="/bms/system/organ/list" row-key="organId" :search="search" :height="height"
						@row-dblclick="row=>{updateOrgan(row.organId)}" @selection-change="selection=>{selectOrgans=selection}">
						<sw-column type="selection" key="organId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="80" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateOrgan(scope.row.organId)" permission="bms:system:organ:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteOrgan(scope.row.organId)" permission="bms:system:organ:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="organId" label="机构编号" width="100" data-type="number" fast="eq"></sw-column>
						<sw-column id="organCode" label="机构编码" width="100" fast="lk"></sw-column>
						<sw-column id="organName" label="机构名称" width="160" fast="lk"></sw-column>
						<sw-column id="contact" label="联系人" width="60" fast="lk"></sw-column>
						<sw-column id="contactPhone" label="联系人电话" width="100" fast="lk"></sw-column>
						<sw-column id="longitude" label="精度" width="160" data-type="number" fast="eq" hide></sw-column>
						<sw-column id="latitude" label="纬度" width="160" data-type="number" fast="eq" hide></sw-column>
						<sw-column id="location" label="位置" width="260" data-type="number" fast="eq" :fast="false" :advance="false" :export="false" :print="false" :formatter="row=>('['+row.longitude+','+row.latitude+']')"></sw-column>
						<sw-column id="provinceName" label="所属省" width="160" fast="lk" info hide></sw-column>
						<sw-column id="cityName" label="所属市" width="160" fast="lk" info hide></sw-column>
						<sw-column id="countyName" label="所属区" width="160" fast="lk" info hide></sw-column>
						<sw-column id="region" label="区域" width="160" fast="lk" :formatter="row=>(row.info['provinceName']+'/'+row.info['cityName']+'/'+row.info['countyName'])"></sw-column>
						<sw-column id="address" label="地址" width="160" fast="lk"></sw-column>
						<sw-column id="sort" label="排序" width="48" data-type="number" fast="range"></sw-column>
						<sw-column id="remark" label="备注" width="120" fast="lk"></sw-column>
						<sw-column id="creatorName" label="创建人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="createTime" label="创建时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
						<sw-column id="editorName" label="编辑人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="editTime" label="编辑时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="新增" center width="1000px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddOrgan></AddOrgan>
		</el-dialog>
		<el-dialog title="编辑" center width="1000px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateOrgan :organId="currentOrganId"></UpdateOrgan>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get organ list, delete organ
import { $getRegionCascaderList, $getOrganList, $deleteOrgan } from '@/assets/config/api';

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

// import components: add organ & update organ
import AddOrgan from '@/views/bms/system/organ/AddOrgan';
import UpdateOrgan from '@/views/bms/system/organ/UpdateOrgan';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_province_id:'', eq_city_id:'', eq_county_id:'', eq_organ_id: '', lk_organ_code: '', lk_organ_name: '', lk_assist_search: '' },
	// show
	show: { add: false, update: false, setSystem: false, setRole: false },
	// current organ id
	currentOrganId: null,
	// select organs
	selectOrgans: [],
	// select region options
	selectRegionOptions: [],
	// select regions
	selectRegions: [],
});

// to refs
const { height, search, show, currentOrganId, selectOrgans, selectRegionOptions, selectRegions } = toRefs(state);

// ref
const organGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	// reset search
	state.search = { eq_province_id:'', eq_city_id:'', eq_county_id:'', eq_organ_id: '', lk_organ_code: '', lk_organ_name: '', lk_assist_search: '' };
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
	organGrid.value.load();
}

/**
 * get region cascader list
 */
const getRegionCascaderList = () => {
	$getRegionCascaderList().then(handler=>{
		state.selectRegionOptions = handler.data.data.cascaderItems;
	});
}

/**
 * handle region change
 * @param value
 */
const handleRegionChange = (value) => {
	state.search.eq_province_id = value&&value.length>0?value[0]:'';
	state.search.eq_city_id = value&&value.length>1?value[1]:'';
	state.search.eq_county_id = value&&value.length>2?value[2]:'';
}

/**
 * add organ
 */
const addOrgan = () => {
	state.show.add = true;
}

/**
 * update organ
 * @param organId
 */
const updateOrgan = (organId) => {
	// param invalid
	if(organId===undefined||organId===null){
		// no select
		if(state.selectOrgans.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		organId = state.selectOrgans[0].organId;
	}
	// set current organ id
	state.currentOrganId = organId;
	// show update organ
	state.show.update = true;
}

/**
 * delete organ
 * @param organIds
 */
const deleteOrgan = (organIds) => {
	// param invalid
	if(!organIds){
		// no select
		if(state.selectOrgans.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		organIds = state.selectOrgans.map(organ=>organ.organId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除机构信息？', '警告').then(()=>{
		// delete organ
		$deleteOrgan({organIds:organIds}).then(handler=>{
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
key('alt+a', ()=>{ addOrgan();return false; });
key('alt+u', ()=>{ updateOrgan();return false; });
key('alt+d', ()=>{ deleteOrgan();return false; });
</script>