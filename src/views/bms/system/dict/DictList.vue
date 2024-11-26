<template>
	<!-- container -->
	<div class="container">
		<!-- search -->
		<div class="panel search-panel" style="margin-left:0;">
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
					<label>字典编号：</label>
					<span><el-input v-model="search.eq_dictId" placeholder="请输入字典编号"></el-input></span>
					<label style="flex-basis:60px;">字典键：</label>
					<span style="flex:1;"><el-input v-model="search.lk_dictKey" placeholder="请输入字典键"></el-input></span>
					<label style="flex-basis:60px;">字典值：</label>
					<span style="flex:1;"><el-input v-model="search.lk_dictValue" placeholder="请输入字典值"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel" style="margin-left:0;">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="collection">字典分类管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addDict();" permission="bms:system:dict:dict:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateDict();" permission="bms:system:dict:dict:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteDict();" permission="bms:system:dict:dict:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="dictGrid" id="dict_list" title="字典列表" url="/bms/system/dict/list" row-key="dictId" :params="params" :search="search" :height="height"
						@row-dblclick="row=>{updateDict(row.dictId)}" @selection-change="selection=>{selectDicts=selection}">
						<sw-column type="selection" key="dictId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="80" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateDict(scope.row.dictId)" permission="bms:system:dict:dict:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteDict(scope.row.dictId)" permission="bms:system:dict:dict:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="dictId" label="字典编号" width="140" data-type="number" fast="eq"></sw-column>
						<sw-column id="dictKey" label="字典键" width="120" fast="lk"></sw-column>
						<sw-column id="dictValue" label="字典值" width="120" fast="lk"></sw-column>
						<sw-column id="sort" label="排序" width="60" data-type="number" fast="range"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="新增" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddDict :dictCategoryId="dictCategoryId"></AddDict>
		</el-dialog>
		<el-dialog title="编辑" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateDict :dictCategoryId="dictCategoryId" :dictId="currentDictId"></UpdateDict>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get dict list, delete dict
import { $getDictList, $deleteDict } from '@/assets/config/api';

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

// import components: add dict & update dict
import AddDict from '@/views/bms/system/dict/AddDict';
import UpdateDict from '@/views/bms/system/dict/UpdateDict';

// const state
const state = reactive({
	// height
	height: 0,
	// params
	params: { dictCategoryId: props.dictCategoryId },
	// search
	search: { eq_dictId:'', lk_dictKey:'', lk_dictValue:'' },
	// show
	show: { add: false, update: false },
	// current dict id
	currentDictId: '',
	// select dicts
	selectDicts: [],
});

// to refs
const { height, params, search, show, currentDictId, selectDicts } = toRefs(state);

// props
const props = defineProps(['dictCategoryId']);

// ref
const dictGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_dictId:'', lk_dictKey:'', lk_dictValue:'' };
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
	dictGrid.value.load();
}

/**
 * add dict
 */
const addDict = () => {
	state.show.add = true;
}

/**
 * update dict
 * @param dictId
 */
const updateDict = (dictId) => {
	// param invalid
	if(dictId===undefined||dictId===null){
		// no select
		if(state.selectDicts.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		dictId = state.selectDicts[0].dictId;
	}
	// set current dict id
	state.currentDictId = dictId;
	// show update dict
	state.show.update = true;
}

/**
 * delete dict
 * @param dictIds
 */
const deleteDict = (dictIds) => {
	// param invalid
	if(!dictIds){
		// no select
		if(state.selectDicts.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		dictIds = state.selectDicts.map(dict=>dict.dictId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除字典信息？', '警告').then(()=>{
		// delete dict
		$deleteDict({dictCategoryId:props.dictCategoryId, dictIds:dictIds}).then(handler=>{
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
watch(()=>props.dictCategoryId, (value)=>{
	state.params.dictCategoryId = value
	load()
}, {deep: true}) 

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
key('alt+a', ()=>{ addDict();return false; });
key('alt+u', ()=>{ updateDict();return false; });
key('alt+d', ()=>{ deleteDict();return false; });
</script>