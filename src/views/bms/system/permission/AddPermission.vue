<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="plus">新增权限</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="permissionForm" :model="permission">
					<!-- items -->
					<sw-form-item type="select" prop="systemId" v-model="permission.systemId" label="所属系统" :items="selectSystems" item-key="systemId" item-value="systemName" @change="systemChange" valid="r" disabled></sw-form-item>
					<sw-form-item type="cascader" prop="prePermissionId" v-model="selectPermissions" label="上级权限" @change="permissionChange" :item-props="{options:selectPermissionOptions, clearable:true, props:{checkStrictly:true}}"></sw-form-item>
					<sw-form-item type="text" prop="permissionId" v-model="permission.permissionId" label="权限编号" valid="r|number" :valid-unique="{code:'permission.id.add', args:[]}"></sw-form-item>
					<sw-form-item type="text" prop="permissionCode" v-model="permission.permissionCode" label="权限编码" valid="r|english_number|l-le200" :valid-unique="{code:'permission.code.add', args:[]}"></sw-form-item>
					<sw-form-item type="text" prop="permissionName" v-model="permission.permissionName" label="权限名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="radio" prop="permissionType" v-model="permission.permissionType" label="权限类型" :items="dataStore.dict.permission_type" valid="r"></sw-form-item>
					<sw-form-item type="text" prop="permissionValue" v-model="permission.permissionValue" label="权限值" valid="r|l-le200"></sw-form-item>
					<sw-form-item type="text" prop="path" v-model="permission.path" label="路径" valid="l-le800"></sw-form-item>
					<sw-form-item type="text" prop="component" v-model="permission.component" label="组件" valid="l-le800"></sw-form-item>
					<sw-form-item type="text" prop="icon" v-model="permission.icon" label="图标" valid="r|l-le40"></sw-form-item>
					<sw-form-item type="text" prop="assistSearch" v-model="permission.assistSearch" label="辅助查询" valid="l-le400"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="permission.sort" label="排序码" valid="r|integer"></sw-form-item>
					<sw-form-item type="textarea" prop="remark" v-model="permission.remark" label="备注" valid="l-le200"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="addPermission" permission="bms:system:permission:add">保存 (S)</sw-button>
						<sw-button type="warning" :underline="false" icon="refresh-left" @click="reset">重置 (R)</sw-button>
					</sw-form-item>
				</sw-form>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get system select list, get permission cascader list, get permission data, add permission
import { $getSystemSelectList, $getPermissionCascaderList, $getPermissionData, $addPermission } from '@/assets/config/api';

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
	// select systems
	selectSystems: [],
	// select permission options
	selectPermissionOptions: [],
	// select permissions
	selectPermissions: [],
	// icascader
	icascader: 0,
	// permission
	permission: { info:{} }
});

// to refs
const { selectSystems, selectPermissionOptions, selectPermissions, icascader, permission } = toRefs(state);

// props
const props = defineProps(['systemId', 'permissionId'])

// ref
const permissionForm = ref()

/**
 * reset
 */
const reset = () => {
	// reset data
	state.selectSystems = [];
	state.selectPermissionOptions = null;
	state.selectPermissions = [];
	state.permission = { info:{} };
	state.icascader ++;
	// get system select list
	getSystemSelectList();
	// if system id exist
	if(props.systemId){
		// get permission cascader list
		getPermissionCascaderList();
	}
	// get permission data
	getPermissionData();
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
 * system change
 * @param system
 */
const systemChange = (system) => {
	// get permission cascader list
	getPermissionCascaderList();
}

/**
 * get permission cascader list
 */
const getPermissionCascaderList = () => {
	// get permission cascader list
	$getPermissionCascaderList({systemId:(props.systemId?props.systemId:-1)}).then(handler=>{
		// set select permission options
		state.selectPermissionOptions = handler.data.data.cascaderItems;
		// set select permissions
		setSelectPermissions();
	});
}

/**
 * set select permissions
 */
const setSelectPermissions = () => {
	// if no permission
	if(props.permissionId){
		// set select permissions
		state.selectPermissions = tool.searchCascaderId(state.selectPermissionOptions, props.permissionId, state.permission.systemId);
	}
	// permission change
	permissionChange(state.selectPermissions);
}

/**
 * permission change
 * @param value
 */
const permissionChange = (value) => {
	// set pre permission id
	state.permission.prePermissionId = (value&&value.length>0)?value[value.length-1]:0;
}

/**
 * get permission data
 */
const getPermissionData = () => {
	// get permission data
	$getPermissionData({permissionId:-1}).then(handler=>{
		// set permission
		state.permission = handler.data.data.permission;
		// set system id
		state.permission.systemId = props.systemId;
	});
}

/**
 * general assist search
 */
const generalAssistSearch = () => {
	// defined value
	let value = '';
	// append permission code
	value += state.permission.permissionCode?state.permission.permissionCode:'';
	// if has permission name
	if(state.permission.permissionName){
		// append permission name
		value += state.permission.permissionName;
		// append permission name first spell / full spell
		value += tool.getFirstSpell(state.permission.permissionName);
		value += tool.getFullSpell(state.permission.permissionName);
	}
	// set assist search
	state.permission.assistSearch = value;
}

/**
 * add permission
 */
const addPermission = () => {
	// valid
	permissionForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定新增权限信息？', '提示').then(()=>{
				// add permission
				$addPermission(state.permission).then(handler=>{
					// success
					if(handler.data.result){
						// message
						ElMessage.success(handler.data.message);
						// reset
						reset();
					}
				});
			}).catch(()=>{});
		}
	});
}

// watch
watch(()=>props.systemId, ()=>{ reset() }, {deep: true}) 
watch(()=>props.permissionId, ()=>{ reset() }, {deep: true}) 
watch(()=>state.permission.permissionCode, ()=>{ generalAssistSearch() }, {deep: true}) 
watch(()=>state.permission.permissionName, ()=>{ generalAssistSearch() }, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ addPermission();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>