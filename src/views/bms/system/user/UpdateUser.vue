<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="edit">编辑用户</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="userForm" :model="user" label-width="80px" :show-message="false" :status-icon="true">
					<!-- items -->
					<sw-form-item type="slot" prop="organId" label="所属机构" valid="">
						<el-select class="select-organ" v-model="organ.value" :popper-append-to-body="false" ref="selectOrgan" clearable @clear="clearOrgan" style="width:100%">
							<div class="select-organ-popper">
								<el-input placeholder="输入关键字进行过滤" v-model="organ.filter" class="organ-filter" />
								<el-option :value="organ.datas">
									<el-tree class="organ-tree" :data="organ.datas" node-key="organId"  :props="{children:'children',label:'organName'}" 
										ref="tree" highlight-current :expand-on-click-node="false" @node-click="organNodeClick" :filter-node-method="filterOrgan">
									</el-tree>
								</el-option>
							</div>
						</el-select>
					</sw-form-item>
					<sw-form-item type="text" prop="userId" v-model="user.userId" label="用户编号" disabled></sw-form-item>
					<sw-form-item type="text" prop="userCode" v-model="user.userCode" label="用户编码" valid="r|english_number|l-le200" :valid-unique="{code:'user.code.update', args:[user.userId]}"></sw-form-item>
					<sw-form-item type="text" prop="userName" v-model="user.userName" label="用户名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="radio" prop="isEnable" v-model="user.isEnable" label="启用" :items="dataStore.dict.zero_one" valid="r"></sw-form-item>
					<sw-form-item type="radio" prop="sex" v-model="user.sex" label="性别" :items="dataStore.dict.sex" valid="r"></sw-form-item>
					<sw-form-item type="text" prop="cardId" v-model="user.cardId" label="证件号" valid="card18"></sw-form-item>
					<sw-form-item type="text" prop="phone" v-model="user.phone" label="联系电话" valid="l-le20"></sw-form-item>
					<sw-form-item type="text" prop="email" v-model="user.email" label="电子邮箱" valid="email|l-le200"></sw-form-item>
					<sw-form-item type="textarea" prop="address" v-model="user.address" label="联系地址" valid="l-le600"></sw-form-item>
					<sw-form-item type="text" prop="assistSearch" v-model="user.assistSearch" label="辅助查询"></sw-form-item>
					<sw-form-item type="textarea" prop="remark" v-model="user.remark" label="备注" valid="l-le200"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="updateUser" permission="bms:system:user:update">保存 (S)</sw-button>
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

// import requests: get select organ list, get user data, update user
import { $getSelectOrganList, $getUserData, $updateUser } from '@/assets/config/api';

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
	// organ
	organ: { datas: [], filter: '', value: '' },
	// user
	user: { info:{} }
});

//to refs
const { organ, user } = toRefs(state);

// ref
const userForm = ref();
const selectOrgan = ref();
const tree = ref();

/**
 * reset
 */
const reset = () => {
	// get select organ list
	getSelectOrganList();
	// get user data
	getUserData();
	// set organ
	state.organ.filter = '';
	state.organ.value = '';
}

/**
 * get select organ list
 */
const getSelectOrganList = () => {
	// get select organ list
	$getSelectOrganList().then(handler=>{
		// set organ datas
		state.organ.datas = handler.data.data.organList;
		// convert organ datas to tree data
		state.organ.datas = tool.getTree(state.organ.datas, '0', 'organId', 'preOrganId', 'children', 'hasChildren');
	});
}

/**
 * organ node click
 * @param data
 */
const organNodeClick = (data) => {
	// set organ id
	state.user.organId = data.organId;
	// set organ name
	state.user.info.organName = data.organName;
	// set organ value
	state.organ.value = data.organName;
	// blur
	selectOrgan.value.blur();
}

/**
 * filter organ
 * @param value
 * @param data
 */
const filterOrgan = (value, data) => {
	// if value not exist
	if (!value) 
		return true;
	// is fined
	return data.organName.indexOf(value)!==-1;
}

/**
 * clear organ
 */
const clearOrgan = () => {
	// set organ id null
	state.user.organId = '';
	// set organ name null
	state.user.info.organName = '';
}

/**
 * general assist search
 */
const generalAssistSearch = () => {
	// defined value
	let value = '';
	// append user code
	value += state.user.userCode?state.user.userCode:'';
	// if has user name
	if(state.user.userName){
		// append user name
		value += state.user.userName;
		// append user name first spell / full spell
		value += tool.getFirstSpell(state.user.userName);
		value += tool.getFullSpell(state.user.userName);
	}
	// set assist search
	state.user.assistSearch = value;
}

/**
 * get user data
 * @param data
 */
const getUserData = () => {
   	// get user data
	$getUserData({userId:props.userId}).then(handler=>{
		// set user
		state.user = handler.data.data.user;
		// set organ name
		state.organ.value = state.user.info.organName;
	});
}

/**
 * update user
 */
const updateUser = () => {
	// valid
	userForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定更新用户信息？', '提示').then(()=>{
				// update user
				$updateUser(state.user).then(handler=>{
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
watch(()=>props.userId, ()=>{ reset(); }, {deep: true}) 
watch(()=>state.organ.filter, (value)=>{ tree.value.filter(value); }, {deep: true}) 
watch(()=>state.user.userCode, ()=>{ generalAssistSearch() }, {deep: true}) 
watch(()=>state.user.userName, ()=>{ generalAssistSearch() }, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ updateUser();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>
