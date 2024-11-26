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
					<el-link icon="menu">配置系统</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="success" :underline="false" icon="check" @click.stop="setUserSystem();" permission="bms:system:user:set_system">配置系统 (S)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<sw-grid ref="systemGrid" id="system_list" title="系统列表" url="/bms/system/user/set_system/list" row-key="systemId" :params="params" :search="search" :height="height"
						@row-dblclick="row=>{updateUser(row.systemId)}" @selection-change="selection=>{selectSystems=selection}" @grid-completed="gridCompleted">
						<sw-column type="selection" key="systemId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
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
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: set user system
import { $setUserSystem } from '@/assets/config/api';

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
	// height
	height: 480,
	// params
	params: {userId: props.userId},
	// search
	search: { eq_system_id: '', lk_system_code: '', lk_system_name: '', lk_assist_search: '' },
	// select systems
	selectSystems: [],
});

// to refs
const { height, params, search, selectSystems } = toRefs(state);

// props
const props = defineProps(['userId']);

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
 * load
 */
const load = () => {
	systemGrid.value.load();
}

/**
 * grid completed
 */
const gridCompleted = () => {
	// next tick
	nextTick(()=>{
		// set select systems is empty
		state.selecSystems = [];
		// clear selection
		systemGrid.value.clearSelection();
		// set selection
		systemGrid.value.datas.exhibit.forEach(data=>{ systemGrid.value.toggleRowSelection(data, data.info.checked=='1'); });
	});
}

/**
 * set user system
 */
const setUserSystem = () => {
	// confirm
	ElMessageBox.confirm('确定配置用户系统信息吗？', '警告').then(()=>{
		// get insert system ids
		let insertSystemIds = state.selectSystems.map(data=>data.systemId).join(',');
		// get delete system ids
		let deleteSystemIds = systemGrid.value.datas.origin.map(data=>data.systemId).join(',');
		// delete user
		$setUserSystem({userId:props.userId, insertSystemIds:insertSystemIds, deleteSystemIds:deleteSystemIds}).then(handler=>{
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

//watch
watch(()=>state.search, ()=>{ load() }, {deep: true}) 
watch(()=>props.userId, (value)=>{
	state.params.userId = value
	load()
}, {deep: true}) 

// load data
onMounted(()=>{
	load();
})

// hotkey
key('alt+q', ()=>{ load();return false; });
key('alt+r', ()=>{ reset();return false; });
key('alt+s', ()=>{ setUserSystem();return false; });
</script>