<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="flag">配置权限</el-link>
				</div>
				<!-- panel buttons -->
				<div class="panel-btns">
					<sw-link class="link-layout" type="success" :underline="false" icon="check" @click.stop="setRolePermission();" permission="bms:system:role:set_permission">配置权限 (S)</sw-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body" id="tree_container">
				<!-- permission tree -->
				<el-tree ref="permissionTree" node-key="permissionId" show-checkbox check-on-click-node check-strictly
					:props="{id:'permissionId', pid:'prePermissionId', label:'permissionName'}" :data="permissions" 
					:default-checked-keys="defaultCheckedPermissions" :default-expanded-keys="defaultExpandedPermissions"></el-tree>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get role permission list, set role permission
import { $getRolePermissionList, $setRolePermission } from '@/assets/config/api';

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
	// default checked permissions
	defaultCheckedPermissions:[],
	// default expanded permissions
	defaultExpandedPermissions:[],
	// permissions
	permissions: []
});

// to refs
const { defaultCheckedPermissions, defaultExpandedPermissions, permissions } = toRefs(state);

// props
const props = defineProps(['systemId', 'roleId']);

// ref
const permissionTree = ref();

/**
 * get role permission list
 */
const getRolePermissionList = () => {
	// get role permission list
	$getRolePermissionList({systemId:props.systemId, roleId:props.roleId}).then(handler=>{
		// get datas
		state.permissions = handler.data.data.permissionList;
		// construt tree datas
		state.permissions = tool.getTree(state.permissions, props.systemId, 'permissionId', 'prePermissionId', 'children', 'hasChildren');
		// set default checked permissions
		state.defaultCheckedPermissions = getLeafCheckedPermissions(state.permissions);
		// set default expanded permissions
		state.defaultExpandedPermissions = [];
		state.permissions.forEach(permission=>{
			state.defaultExpandedPermissions.push(permission.permissionId);
		});
	});
}

/**
 * get leaf checked permissions
 * @param permissions
 */
const getLeafCheckedPermissions = (permissions) => {
	// defined checked permissions
	let checkedPermissions = [];
	// for each permission
	for(let i=0; i<permissions.length; i++){
		// get permission
		let permission = permissions[i];
		// if has children
		if(permission.children&&permission.children.length>0){
			// get sub permissions
			let subCheckedPermissions = getLeafCheckedPermissions(permission.children);
			// if has sub then concat
			if(subCheckedPermissions.length>0){
				checkedPermissions = checkedPermissions.concat(subCheckedPermissions);
			}
		}
		// if checked
		if(permission.info.checked=='1'){
			// push checked permissions
			checkedPermissions.push(permission.permissionId);
		}
	}
	// return checked permissions
	return checkedPermissions;
}

/**
 * set role permission
 */
const setRolePermission = () => {
	// confirm
	ElMessageBox.confirm('确定配置权限信息吗？', '警告').then(()=>{
		// get checked permissions
		let permissions = permissionTree.value.getCheckedNodes(false, true);
		// construct permission ids
		let permissionIds = [];
		permissions.forEach(permission=>{
			permissionIds.push(permission.permissionId);
		});
		// set role permission
		$setRolePermission({roleId:props.roleId, permissionIds:permissionIds.join(',')}).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success(handler.data.message);
			}
		});
	}).catch(()=>{});
}

//watch
watch(()=>props.roleId, ()=>{ getRolePermissionList() }, {deep: true}) 

// get role permission list
getRolePermissionList();

// hotkey
key('alt+s', ()=>{ setRolePermission();return false; });
</script>

<style scoped>
/** tree container */
#tree_container{height:540px;overflow:auto;}
</style>