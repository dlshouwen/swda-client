<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="edit">编辑系统</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="systemForm" :model="system">
					<!-- items -->
					<sw-form-item type="text" prop="systemId" v-model="system.systemId" label="系统编号" disabled></sw-form-item>
					<sw-form-item type="text" prop="systemCode" v-model="system.systemCode" label="系统编码" valid="r|english_number|l-le200" :valid-unique="{code:'system.code.update', args:[system.systemId]}"></sw-form-item>
					<sw-form-item type="text" prop="systemName" v-model="system.systemName" label="系统名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="icon" v-model="system.icon" label="图标" valid="r|l-le40"></sw-form-item>
					<sw-form-item type="text" prop="assistSearch" v-model="system.assistSearch" label="辅助查询" valid="l-le400"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="system.sort" label="排序码" valid="r|integer"></sw-form-item>
					<sw-form-item type="text" prop="textarea" v-model="system.remark" label="备注" valid="l-le200"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="updateSystem" permission="bms:system:system:update">保存 (S)</sw-button>
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

// import requests: get system data, update system
import { $getSystemData, $updateSystem } from '@/assets/config/api';

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
	// system
	system: { info:{} }
});

// to refs
const { system } = toRefs(state);

// props
const props = defineProps(['systemId'])

// ref
const systemForm = ref()

/**
 * reset
 */
const reset = () => {
	// get system data
	getSystemData();
}

/**
 * general assist search
 */
const generalAssistSearch = () => {
	// defined value
	let value = '';
	// append system code
	value += state.system.systemCode?state.system.systemCode:'';
	// if has system name
	if(state.system.systemName){
		// append system name
		value += state.system.systemName;
		// append system name first spell / full spell
		value += tool.getFirstSpell(state.system.systemName);
		value += tool.getFullSpell(state.system.systemName);
	}
	// set assist search
	state.system.assistSearch = value;
}

/**
 * get system data
 */
const getSystemData = () => {
   	// get system data
	$getSystemData({systemId:props.systemId}).then(handler=>{
		// set system
		state.system = handler.data.data.system;
	});
}

/**
 * update system
 */
const updateSystem = () => {
	// valid
	systemForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定更新系统信息？', '提示').then(()=>{
				// update system
				$updateSystem(state.system).then(handler=>{
					// success
					if(handler.data.result){
						// message
						ElMessage.success(handler.data.message);
					}
				});
			}).catch(()=>{});
		}
	});
}

// watch
watch(()=>props.systemId, ()=>{ reset() }, {deep: true}) 
watch(()=>state.system.systemCode, ()=>{ generalAssistSearch() }, {deep: true}) 
watch(()=>state.system.systemName, ()=>{ generalAssistSearch() }, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ updateSystem();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>
