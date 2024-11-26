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
					<label>所属系统：</label>
					<span>
						<el-select v-model="currentSystemId" placeholder="请选择所属系统">
							<el-option v-for="(system, index) in selectSystems" :key="system.systemId" :label="system.systemName" :value="system.systemId"></el-option>
						</el-select>
					</span>
					<label>权限编号：</label>
					<span><el-input v-model="search.eq_permissionId" placeholder="请输入权限编号"></el-input></span>
					<label>权限编码：</label>
					<span><el-input v-model="search.lk_permissionCode" placeholder="请输入权限编号"></el-input></span>
					<label>权限名称：</label>
					<span><el-input v-model="search.lk_permissionName" placeholder="请输入权限名称"></el-input></span>
					<label>权限类型：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_permissionType" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.permission_type" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label>辅助查询：</label>
					<span style="flex:1;"><el-input style="width:100%;" v-model="search.lk_assistSearch" placeholder="请输入辅助查询"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="s-flag">权限管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addPermission();" permission="bms:system:permission:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updatePermission();" permission="bms:system:permission:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deletePermission();" permission="bms:system:permission:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<sw-grid ref="permissionGrid" id="permission_list" title="权限列表" url="/bms/system/permission/list" row-key="permissionId" :search="search" :height="height" :params="{systemId:currentSystemId}"
						tree tree-prop="permissionName" :tree-expand-node-props="{width:140, label:'权限名称', headerAlign:'center'}" :tree-top-value="0" :datas-render="datasRender"
						@row-dblclick="row=>{updatePermission(row.permissionId)}" @selection-change="selection=>{selectPermissions=selection}">
						<sw-column type="selection" key="permissionId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="80" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="plus" @click.stop="addPermission(scope.row.permissionId)" permission="bms:system:permission:add" divider></sw-link>
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updatePermission(scope.row.permissionId)" permission="bms:system:permission:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deletePermission(scope.row.permissionId)" permission="bms:system:permission:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="systemName" label="所属系统" width="120" fast="lk" info></sw-column>
						<sw-column id="permissionId" label="权限编号" width="90" data-type="number" fast="eq"></sw-column>
						<sw-column id="permissionCode" label="权限编码" width="260" align="left" fast="lk"></sw-column>
						<sw-column id="permissionName" label="权限名称" width="120" align="left" fast="lk"></sw-column>
						<sw-column id="permissionType" label="权限类型" width="90" :dict="dataStore.dict.permission_type" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="permissionValue" label="权限值" width="260" align="left" fast="lk"></sw-column>
						<sw-column id="path" label="路径" width="260" align="left" fast="lk"></sw-column>
						<sw-column id="component" label="组件" width="260" align="left" fast="lk"></sw-column>
						<sw-column id="icon" label="图标" width="60" fast="lk" :sortable="false">
							<template #default="scope">
								<el-link :icon="scope.row.icon" :underline="false"></el-link>
							</template>
						</sw-column>
						<sw-column id="sort" label="排序" width="60" data-type="number" fast="eq"></sw-column>
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
		<el-dialog title="新增" center width="480px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddPermission :systemId="currentSystemId" :permissionId="currentPermissionId"></AddPermission>
		</el-dialog>
		<el-dialog title="编辑" center width="480px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdatePermission :systemId="currentSystemId" :permissionId="currentPermissionId"></UpdatePermission>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get system select list, delete permission, delete permission
import { $getSystemSelectList, $getPermissionList, $deletePermission } from '@/assets/config/api';

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

// import components: add permission & update permission
import AddPermission from '@/views/bms/system/permission/AddPermission';
import UpdatePermission from '@/views/bms/system/permission/UpdatePermission';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_permissionId: '', lk_permissionCode:'', lk_permissionName: '', eq_permissionType: '', lk_assistSearch: '' },
	// show
	show: { add: false, update: false },
	// current permission id
	currentPermissionId: '',
	// select permissions
	selectPermissions: [],
	// current system id
	currentSystemId: '1',
	// select systems
	selectSystems : [],
});

// to refs
const { height, search, show, currentPermissionId, selectPermissions, currentSystemId, selectSystems } = toRefs(state);

// ref
const permissionGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_permissionId: '', lk_permissionCode:'', lk_permissionName: '', eq_permissionType: '', lk_assistSearch: '' };
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
	permissionGrid.value.load();
}

/**
 * get system select list
 */
const getSystemSelectList = () => {
	// get system select list
	$getSystemSelectList().then(handler=>{
		// set select systems
		state.selectSystems = handler.data.data.systemList;
	});
}

/**
 * data render
 * @param datas
 */
const datasRender = (datas) => {
	// convert datas to tree datas
	return tool.getTree(datas, null, 'permissionId', 'prePermissionId', 'children', '_hasChildren_');
}

/**
 * add permission
 */
const addPermission = (permissionId) => {
	// param invalid
	if(permissionId===undefined||permissionId===null){
		// no select
		if(state.selectPermissions.length>0){
			// set first select
			permissionId = state.selectPermissions[0].permissionId;
		}
	}
	// set current permission id
	state.currentPermissionId = permissionId;
	// show add permission
	state.show.add = true;
}

/**
 * update permission
 * @param permissionId
 */
const updatePermission = (permissionId) => {
	// param invalid
	if(permissionId===undefined||permissionId===null){
		// no select
		if(state.selectPermissions.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		permissionId = state.selectPermissions[0].permissionId;
	}
	// set current permission id
	state.currentPermissionId = permissionId;
	// show update permission
	state.show.update = true;
}

/**
 * delete permission
 * @param permissionIds
 */
const deletePermission = (permissionIds) => {
	// param invalid
	if(!permissionIds){
		// no select
		if(state.selectPermissions.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		permissionIds = state.selectPermissions.map(permission=>permission.permissionId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除权限信息？', '警告').then(()=>{
		// delete permission
		$deletePermission({permissionIds:permissionIds}).then(handler=>{
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

// get system list
getSystemSelectList();

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
key('alt+a', ()=>{ addPermission();return false; });
key('alt+u', ()=>{ updatePermission();return false; });
key('alt+d', ()=>{ deletePermission();return false; });
</script>