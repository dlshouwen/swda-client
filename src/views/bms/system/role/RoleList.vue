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
						<el-select v-model="search.eq_system_id" placeholder="请选择所属系统">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(system, index) in selectSystems" :key="system.systemId" :label="system.systemName" :value="system.systemId"></el-option>
						</el-select>
					</span>
					<label>角色编号：</label>
					<span><el-input v-model="search.eq_role_id" placeholder="请输入角色编号"></el-input></span>
					<label>角色编码：</label>
					<span><el-input v-model="search.lk_role_code" placeholder="请输入角色编码"></el-input></span>
					<label>角色名称：</label>
					<span><el-input v-model="search.lk_role_name" placeholder="请输入角色名称"></el-input></span>
					<label>辅助查询：</label>
					<span style="flex:1;"><el-input style="width:100%;" v-model="search.lk_assist_search" placeholder="请输入辅助查询"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="role">角色管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addRole();" permission="bms:system:role:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateRole();" permission="bms:system:role:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteRole();" permission="bms:system:role:delete" divider>删除 (D)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="s-flag" @click.stop="setPermission();" permission="bms:system:role:set_permission" divider>配置权限 (P)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="user" @click.stop="setUser();" permission="bms:system:role:set_user">配置用户 (K)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="roleGrid" id="role_list" title="角色列表" url="/bms/system/role/list" row-key="roleId" :search="search" :height="height"
						@row-dblclick="row=>{updateRole(row.roleId)}" @selection-change="selection=>{selectRoles=selection}">
						<sw-column type="selection" key="roleId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="110" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateRole(scope.row.roleId)" permission="bms:system:role:update" divider></sw-link>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteRole(scope.row.roleId)" permission="bms:system:role:delete" divider></sw-link>
								<sw-link type="primary" :underline="false" icon="flag" @click.stop="setPermission(scope.row.systemId, scope.row.roleId)" permission="bms:system:role:set_permission" divider></sw-link>
								<sw-link type="primary" :underline="false" icon="user" @click.stop="setUser(scope.row.roleId)" permission="bms:system:role:set_user"></sw-link>
							</template>
						</sw-column>
						<sw-column id="systemName" label="所属系统" width="120" fast="lk" info></sw-column>
						<sw-column id="roleId" label="角色编号" width="80" data-type="number" fast="eq"></sw-column>
						<sw-column id="roleCode" label="角色编码" width="80" fast="lk"></sw-column>
						<sw-column id="roleName" label="角色名称" width="100" fast="lk"></sw-column>
						<sw-column id="sort" label="排序" width="60" data-type="number" fast="range"></sw-column>
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
		<el-dialog title="新增" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.add">
			<AddRole></AddRole>
		</el-dialog>
		<el-dialog title="编辑" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateRole :roleId="currentRoleId"></UpdateRole>
		</el-dialog>
		<el-dialog title="配置权限" center width="400px" height="720px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.setPermission">
			<SetPermission :systemId="currentSystemId" :roleId="currentRoleId"></SetPermission>
		</el-dialog>
		<el-dialog title="配置用户" center width="1000px" height="800px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.setUser">
			<SetUser :roleId="currentRoleId"></SetUser>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get system select list, get role list, delete role
import { $getSystemSelectList, $getRoleList, $deleteRole } from '@/assets/config/api';

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

// import components: add role & update role & set permission & set user
import AddRole from '@/views/bms/system/role/AddRole';
import UpdateRole from '@/views/bms/system/role/UpdateRole';
import SetPermission from '@/views/bms/system/role/SetPermission';
import SetUser from '@/views/bms/system/role/SetUser';

// const state
const state = reactive({
	// height
	height: 0,
	// search
	search: { eq_system_id:'', eq_role_id:'', lk_role_code:'', lk_role_name:'', lk_assist_search:'' },
	// show
	show: { add: false, update: false, setPermission: false, setUser: false },
	// current system id
	currentSystemId: '',
	// select systems
	selectSystems : [],
	// current role id
	currentRoleId: '',
	// select roles
	selectRoles: [],
});

// to refs
const { height, search, show, currentSystemId, selectSystems, currentRoleId, selectRoles } = toRefs(state);

// ref
const roleGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_system_id:'', eq_role_id:'', lk_role_code:'', lk_role_name:'', lk_assist_search:'' };
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
	roleGrid.value.load();
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
 * add role
 */
const addRole = () => {
	state.show.add = true;
}

/**
 * update role
 * @param roleId
 */
const updateRole = (roleId) => {
	// param invalid
	if(roleId===undefined||roleId===null){
		// no select
		if(state.selectRoles.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first select
		roleId = state.selectRoles[0].roleId;
	}
	// set current role id
	state.currentRoleId = roleId;
	// show update role
	state.show.update = true;
}

/**
 * delete role
 * @param roleIds
 */
const deleteRole = (roleIds) => {
	// param invalid
	if(!roleIds){
		// no select
		if(state.selectRoles.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set selects
		roleIds = state.selectRoles.map(role=>role.roleId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除角色信息？', '警告').then(()=>{
		// delete role
		$deleteRole({roleIds:roleIds}).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success(handler.data.message);
				// load
				state.load();
			}
		});
	}).catch(()=>{});
}

/**
 * set permission
 * @param roleId
 */
const setPermission = (systemId, roleId) => {
	// param invalid
	if(roleId===undefined||roleId===null){
		// no select
		if(state.selectRoles.length<=0){
			ElMessage.warning('未选择需要配置权限的数据。');
			return;
		}
		// set first select
		systemId = state.selectRoles[0].systemId;
		roleId = state.selectRoles[0].roleId;
	}
	// set current system id
	state.currentSystemId = systemId;
	// set current role id
	state.currentRoleId = roleId;
	// show set permission
	state.show.setPermission = true;
}

/**
 * set user
 * @param roleId
 */
const setUser = (roleId) => {
	// param invalid
	if(roleId===undefined||roleId===null){
		// no select
		if(state.selectRoles.length<=0){
			ElMessage.warning('未选择需要配置用户的数据。');
			return;
		}
		// set first select
		roleId = state.selectRoles[0].roleId;
	}
	// set current role id
	state.currentRoleId = roleId;
	// show set user
	state.show.setUser = true;
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
key('alt+a', ()=>{ addRole();return false; });
key('alt+u', ()=>{ updateRole();return false; });
key('alt+d', ()=>{ deleteRole();return false; });
key('alt+p', ()=>{ setPermission();return false; });
key('alt+k', ()=>{ setUser();return false; });
</script>