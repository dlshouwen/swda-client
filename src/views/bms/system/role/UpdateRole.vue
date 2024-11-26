<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="edit">编辑角色</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="roleForm" :model="role">
					<!-- items -->
					<sw-form-item type="select" prop="systemId" v-model="role.systemId" label="所属系统" :items="selectSystems" item-key="systemId" item-value="systemName" disabled></sw-form-item>
					<sw-form-item type="text" prop="roleId" v-model="role.roleId" label="角色编号" disabled></sw-form-item>
					<sw-form-item type="text" prop="roleCode" v-model="role.roleCode" label="角色编码" valid="r|english_number|l-le200" :valid-unique="{code:'role.code.update', args:[role.roleId]}"></sw-form-item>
					<sw-form-item type="text" prop="roleName" v-model="role.roleName" label="角色名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="assistSearch" v-model="role.assistSearch" label="辅助查询" valid="l-le400"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="role.sort" label="排序码" valid="r|integer"></sw-form-item>
					<sw-form-item type="textarea" prop="remark" v-model="role.remark" label="备注" valid="l-le200"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="updateRole" permission="bms:system:role:update">保存 (S)</sw-button>
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

// import requests: get system select list, get role data, update role
import { $getSystemSelectList, $getRoleData, $updateRole } from '@/assets/config/api';

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
	// role
	role: { info:{} }
});

// to refs
const { selectSystems, role } = toRefs(state);

// props
const props = defineProps(['roleId'])

// ref
const roleForm = ref()

/**
 * reset
 */
const reset = () => {
	// reset data
	state.selectSystems = [];
	// get system select list
	getSystemSelectList();
	// get role data
	getRoleData();
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
 * general assist search
 */
const generalAssistSearch = () => {
	// defined value
	let value = '';
	// append role code
	value += state.role.roleCode?state.role.roleCode:'';
	// if has role name
	if(state.role.roleName){
		// append role name
		value += state.role.roleName;
		// append role name first spell / full spell
		value += tool.getFirstSpell(state.role.roleName);
		value += tool.getFullSpell(state.role.roleName);
	}
	// set assist search
	state.role.assistSearch = value;
}

/**
 * get role data
 */
const getRoleData = () => {
   	// get role data
	$getRoleData({roleId:props.roleId}).then(handler=>{
		// set role
		state.role = handler.data.data.role;
	});
}

/**
 * update role
 */
const updateRole = () => {
	// valid
	roleForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定更新角色信息？', '提示').then(()=>{
				// update role
				$updateRole(state.role).then(handler=>{
					// success
					if(handler.data.result){
						// success
						ElMessage.success(handler.data.message);
					}
				});
			}).catch(()=>{});
		}
	});
}

// watch
watch(()=>props.roleId, ()=>{ reset() }, {deep: true}) 
watch(()=>state.role.roleCode, ()=>{ generalAssistSearch() }, {deep: true}) 
watch(()=>state.role.roleName, ()=>{ generalAssistSearch() }, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ updateRole();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>
