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
					<el-link icon="avatar">配置角色</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="success" :underline="false" icon="check" @click.stop="setUserRole();" permission="bms:system:user:set_role">配置角色 (S)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="roleGrid" id="role_list" title="角色列表" url="/bms/system/user/set_role/list" row-key="roleId" :params="params" :search="search" :height="height"
						@row-dblclick="row=>{updateRole(row.roleId)}" @selection-change="selection=>{selectRoles=selection}" @grid-completed="gridCompleted">
						<sw-column type="selection" key="roleId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
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
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: set user role
import { $setUserRole } from '@/assets/config/api';

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

// props
const props = defineProps(['userId'])

// const state
const state = reactive({
	// height
	height: 480,
	// params
	params: {userId: props.userId},
	// search
	search: { eq_role_id: '', lk_role_code: '', lk_role_name: '', lk_assist_search: '' },
	// select roles
	selectRoles: [],
});

// to refs
const { height, params, search, selectRoles } = toRefs(state);

// ref
const roleGrid = ref()

/**
 * reset
 */
const reset = () => {
	this.search = { eq_role_id: '', lk_role_code: '', lk_role_name: '', lk_assist_search: '' };
}

/**
 * load
 */
const load = () => {
	roleGrid.value.load();
}

/**
 * grid completed
 */
const gridCompleted = () => {
	// set select roles is empty
	state.selectRoles = [];
	// clear selection
	roleGrid.value.clearSelection();
	// set selection
	nextTick(()=>{
		roleGrid.value.datas.exhibit.forEach(data=>{ roleGrid.value.toggleRowSelection(data, data.info.checked=='1'); });
	});
}

/**
 * set user role
 */
const setUserRole = () => {
	// confirm
	ElMessageBox.confirm('确定配置用户角色信息吗？', '警告').then(()=>{
		// get insert role ids
		let insertRoleIds = state.selectRoles.map(data=>data.roleId).join(',');
		// get delete role ids
		let deleteRoleIds = roleGrid.value.datas.origin.map(data=>data.roleId).join(',');
		// delete user
		$setUserRole({userId:props.userId, insertRoleIds:insertRoleIds, deleteRoleIds:deleteRoleIds}).then(handler=>{
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
key('alt+s', ()=>{ setUserRole();return false; });
</script>