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
					<label>系统编号：</label>
					<span><el-input v-model="search.eq_system_id" placeholder="请输入系统编号"></el-input></span>
					<label>系统编码：</label>
					<span><el-input v-model="search.lk_system_code" placeholder="请输入系统编码"></el-input></span>
					<label>系统名称：</label>
					<span><el-input v-model="search.lk_system_name" placeholder="请输入系统名称"></el-input></span>
					<label>辅助查询：</label>
					<span style="flex:1;"><el-input style="width:100%;" v-model="search.lk_assist_search" placeholder="请输入辅助查询"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="system">系统管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addSystem();" permission="bms:system:system:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateSystem();" permission="bms:system:system:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteSystem();" permission="bms:system:system:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="systemGrid" id="system_list" title="用户列表" url="/bms/system/system/list" row-key="systemId" :search="search" :height="height"
						@row-dblclick="row=>{updateSystem(row.systemId)}" @selection-change="selection=>{selectSystems=selection}">
						<sw-column type="selection" key="systemId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="60" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateSystem(scope.row.systemId)" permission="bms:system:system:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteSystem(scope.row.systemId)" permission="bms:system:system:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="systemId" label="系统编号" width="100" data-type="number" fast="eq"></sw-column>
						<sw-column id="systemCode" label="系统编码" width="100" fast="lk"></sw-column>
						<sw-column id="systemName" label="系统名称" width="100" fast="lk"></sw-column>
						<sw-column id="icon" label="图标" width="60" fast="lk" :sortable="false">
							<template #default="scope">
								<el-link :icon="scope.row.icon" :underline="false"></el-link>
							</template>
						</sw-column>
						<sw-column id="sort" label="排序" width="60" data-type="number" fast="eq"></sw-column>
						<sw-column id="remark" label="备注" width="200" fast="lk"></sw-column>
						<sw-column id="creatorName" label="创建人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="createTime" label="创建时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
						<sw-column id="editorName" label="编辑人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="editTime" label="编辑时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
		<!-- dialog -->
		<el-dialog title="新增" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddSystem></AddSystem>
		</el-dialog>
		<el-dialog title="编辑" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateSystem :systemId="currentSystemId"></UpdateSystem>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get system list, delete system
import { $getSystemList, $deleteSystem } from '@/assets/config/api';

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

// import components: add system & update system
import AddSystem from '@/views/bms/system/system/AddSystem';
import UpdateSystem from '@/views/bms/system/system/UpdateSystem';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_system_id: '', lk_system_code: '', lk_system_name: '', lk_assist_search: '' },
	// show
	show: { add: false, update: false },
	// current system id
	currentSystemId: '',
	// select systems
	selectSystems: [],
});

// to refs
const { height, search, show, currentSystemId, selectSystems } = toRefs(state);

// ref
const systemGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_system_id: '', lk_system_code: '', lk_system_name: '', lk_assist_search: '' };
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
	systemGrid.value.load();
}

/**
 * add system
 */
const addSystem = () => {
	state.show.add = true;
}

/**
 * update system
 * @param systemId
 */
const updateSystem = (systemId) => {
	// param invalid
	if(systemId===undefined||systemId===null){
		// no select
		if(state.selectSystems.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		systemId = state.selectSystems[0].systemId;
	}
	// set current system id
	state.currentSystemId = systemId;
	// show update system
	state.show.update = true;
}

/**
 * delete system
 * @param systemIds
 */
const deleteSystem = (systemIds) => {
	// param invalid
	if(!systemIds){
		// no select
		if(state.selectSystems.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		systemIds = state.selectSystems.map(system=>system.systemId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除系统信息？', '警告').then(()=>{
		// delete system
		$deleteSystem({systemIds:systemIds}).then(handler=>{
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
key('alt+a', ()=>{ addSystem();return false; });
key('alt+u', ()=>{ updateSystem();return false; });
key('alt+d', ()=>{ deleteSystem();return false; });
</script>