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
					<label style="flex-basis:90px;">字典类型编号：</label>
					<span><el-input v-model="search.eq_dictCategoryId" placeholder="请输入字典类型编号"></el-input></span>
					<label style="flex-basis:90px;">字典类型名称：</label>
					<span style="flex:1;"><el-input v-model="search.lk_dictCategoryName" placeholder="请输入字典类型名称"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="collection">字典分类管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addDictCategory();" permission="bms:system:dict:dict_category:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateDictCategory();" permission="bms:system:dict:dict_category:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteDictCategory();" permission="bms:system:dict:dict_category:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="dictCategoryGrid" id="dict_category_list" title="字典类型列表" url="/bms/system/dict_category/list" row-key="dictCategoryId" :search="search" :height="height"
						@row-click="row=>{setDictCategoryId(row.dictCategoryId)}" @row-dblclick="row=>{updateDictCategory(row.dictCategoryId)}" @selection-change="selection=>{selectDictCategorys=selection}">
						<sw-column type="selection" key="dictCategoryId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="60" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateDictCategory(scope.row.dictCategoryId)" permission="bms:system:dict:dict_category:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteDictCategory(scope.row.dictCategoryId)" permission="bms:system:dict:dict_category:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="dictCategoryId" label="字典类型编号" width="140" data-type="number" fast="eq"></sw-column>
						<sw-column id="dictCategoryName" label="字典类型名称" width="120" fast="lk"></sw-column>
						<sw-column id="sort" label="排序" width="60" data-type="number" fast="eq"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="新增" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddDictCategory></AddDictCategory>
		</el-dialog>
		<el-dialog title="编辑" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateDictCategory :dictCategoryId="currentDictCategoryId"></UpdateDictCategory>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted & inject
import { ref, reactive, toRefs, watch, nextTick, onMounted, inject } from 'vue'

// import requests: get dict category list, delete dict category
import { $getDictCategoryList, $deleteDictCategory } from '@/assets/config/api';

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

// import components: add dict category & update dict category
import AddDictCategory from '@/views/bms/system/dict/AddDictCategory';
import UpdateDictCategory from '@/views/bms/system/dict/UpdateDictCategory';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_dictCategoryId:'', lk_dictCategoryName:'' },
	// show
	show: { add: false, update: false },
	// current dict category id
	currentDictCategoryId: '',
	// select dict categorys
	selectDictCategorys: [],
});

// to refs
const { height, search, show, currentDictCategoryId, selectDictCategorys } = toRefs(state);

// inject
const setDictCategoryId = inject('setDictCategoryId');

// ref
const dictCategoryGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_dictCategoryId:'', lk_dictCategoryName:'' };
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
	dictCategoryGrid.value.load();
}

/**
 * add dict category
 */
const addDictCategory = () => {
	state.show.add = true;
}

/**
 * update dict category
 * @param dictCategoryId
 */
const updateDictCategory = (dictCategoryId) => {
	// param invalid
	if(dictCategoryId===undefined||dictCategoryId===null){
		// no select
		if(state.selectDictCategorys.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		dictCategoryId = state.selectDictCategorys[0].dictCategoryId;
	}
	// set current dict category id
	state.currentDictCategoryId = dictCategoryId;
	// show update dict category
	state.show.update = true;
}

/**
 * delete dict category
 * @param dictCategoryIds
 */
const deleteDictCategory = (dictCategoryIds) => {
	// param invalid
	if(!dictCategoryIds){
		// no select
		if(state.selectDictCategorys.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		dictCategoryIds = state.selectDictCategorys.map(dictCategory=>dictCategory.dictCategoryId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除字典类型信息？', '警告').then(()=>{
		// delete dict category
		$deleteDictCategory({dictCategoryIds:dictCategoryIds}).then(handler=>{
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

//load data
onMounted(()=>{
	load();
})

// set grid height
window.onresize = resize;
nextTick(resize);

// hotkey
key('alt+q', ()=>{ load();return false; });
key('alt+r', ()=>{ reset();return false; });
key('alt+a', ()=>{ addDictCategory();return false; });
key('alt+u', ()=>{ updateDictCategory();return false; });
key('alt+d', ()=>{ deleteDictCategory();return false; });
</script>