<template>
	<!-- container -->
	<div class="container">
		<!-- tabs -->
		<el-tabs v-model="tab.active">
			<!-- set user -->
			<el-tab-pane name="set_user">
				<!-- title -->
				<template #label><el-link icon="user" :underline="false">个人设置 (1)</el-link></template>
				<!-- form -->
				<sw-form ref="userForm" :model="user">
					<!-- form items -->
					<sw-form-item type="text" prop="userId" v-model="user.userId" label="用户编号" valid="r|integer" disabled></sw-form-item>
					<sw-form-item type="text" prop="userCode" v-model="user.userCode" label="用户编码" valid="r|english_number|l-le200" :valid-unique="{code:'user.code.update', args:[user.userId]}"></sw-form-item>
					<sw-form-item type="text" prop="organId" v-model="user.info.organName" label="所属机构" :item-props="{'suffix-icon':'el-icon-thumb'}" disabled></sw-form-item>
					<sw-form-item type="text" prop="userName" v-model="user.userName" label="用户名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="radio" prop="sex" v-model="user.sex" label="性别" valid="r" :items="dataStore.dict.sex"></sw-form-item>
					<sw-form-item type="text" prop="cardId" v-model="user.cardId" label="证件号" valid="card18"></sw-form-item>
					<sw-form-item type="text" prop="phone" v-model="user.phone" label="联系电话" valid="l-le20"></sw-form-item>
					<sw-form-item type="text" prop="email" v-model="user.email" label="电子邮箱" valid="email|l-le200"></sw-form-item>
					<sw-form-item type="textarea" prop="address" v-model="user.address" label="联系地址" valid="l-le600"></sw-form-item>
					<sw-form-item type="text" prop="assistSearch" v-model="user.assistSearch" label="辅助查询" valid="l-le400"></sw-form-item>
					<sw-form-item type="textarea" prop="remark" v-model="user.remark" label="备注" valid="l-le200"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" :loading="loading" @click="setUser">保存 (s)</sw-button>
					</sw-form-item>
				</sw-form>
			</el-tab-pane>
			<!-- change password -->
			<el-tab-pane name="change_password">
				<!-- title -->
				<template #label><el-link icon="lock" :underline="false">修改密码 (2)</el-link></template>
				<!-- form -->
				<sw-form ref="passwordForm" :model="password">
					<!-- form items -->
					<sw-form-item type="password" prop="oldPassword" v-model="password.oldPassword" label="原密码" valid="r"></sw-form-item>
					<sw-form-item ref="newPasswordValue" type="password" prop="newPassword" v-model="password.newPassword" label="新密码" valid="r|le6-le18">
						<div class="password-letter">
							<span class="strength s1" :class="password.strength>0?'password-strength-color':''"></span>
							<span class="strength s2" :class="password.strength>1?'password-strength-color':''"></span>
							<span class="strength s3" :class="password.strength>2?'password-strength-color':''"></span>
						</div>
					</sw-form-item>
					<sw-form-item type="password" prop="repeatNewPassword" v-model="password.repeatNewPassword" label="重复密码" valid="r|le6-le18" :password="password.newPassword"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" :loading="loading" @click="changePassword">保存 (s)</sw-button>
					</sw-form-item>
				</sw-form>
			</el-tab-pane>
			<!-- set shortcut -->
			<el-tab-pane name="set_shortcut">
				<!-- title -->
				<template #label><el-link icon="magic-stick" :underline="false">设置快捷方式 (3)</el-link></template>
				<!-- tree -->
				<el-tree ref="shortcutTree" :data="shortcuts" :default-expanded-keys="expands" :show-checkbox="true" node-key="permission_id" node-value="permission_name" style="height:480px;overflow:auto;" :props="{label:'permission_name'}"></el-tree>
				<!-- operation -->
				<div class="operation-container">
					<sw-button type="success" :underline="false" icon="circle-check" :loading="loading" @click="setShortcut">保存 (s)</sw-button>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch
import { ref, reactive, toRefs, watch } from 'vue'

// import requests: get assist data, set user, change password, set shortcut
import { $getAssistData, $setUser, $changePassword, $setShortcut } from '@/assets/config/api';

// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

//import tool
import * as tool from '@/assets/utils/tool';

//import store: data
import { useDataStore } from '@/store/data'
//get store: data
const dataStore = useDataStore();

// const state
const state = reactive({
	// loading
	loading: false,
	// user
	user: { userId:'', info:{} },
	// password
	password: { oldPassword:'', newPassword:'', repeatNewPassword:'', strength: 0 },
	// shortcuts
	shortcuts: [],
	// expands
	expands: [],
	// tab
	tab:{ active:'set_user' }
});

// to refs
const { loading, user, password, shortcuts, expands, tab } = toRefs(state);

// refs
const userForm = ref()
const passwordForm = ref()
const newPasswordValue = ref()
const shortcutTree = ref()

/**
 * get assist data
 */
const getAssistData = () => {
	// get assist data
	$getAssistData().then(handler=>{
		// set user
		state.user = handler.data.data.user;
		// set shortcut
		state.shortcuts = handler.data.data.shortcutList;
		// set disabled / checked / expands
		let shortcutList = handler.data.data.shortcutList;
		let shorcutCheckNodes = [];
		shortcutList.forEach(shortcut=>{
			// set expands
			state.expands.push(shortcut.permission_id);
			// set checked
			if(shortcut.checked=='1'){
				shorcutCheckNodes.push(shortcut.permission_id);
			}
			// set disabled
			let disabled = false;
			shortcutList.forEach(_shortcut=>{
				if(_shortcut.pre_permission_id==shortcut.permission_id){
					disabled = true;
					return false;
				}
			});
			shortcut.disabled = disabled;
		});
		// set shortcut conert to tree
		state.shortcuts = tool.getTree(shortcutList, 1, 'permission_id', 'pre_permission_id', 'children');
		// set checked
		shortcutTree.value.setCheckedKeys(shorcutCheckNodes);
	});
}

/**
 * set user
 */
const setUser = () => {
	// valid
	userForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定保存个人信息吗？', '警告').then(()=>{
				// set user
				$setUser(state.user).then(handler=>{
					if(handler.data.result){
						ElMessage.success(handler.data.message);
					}
				}).catch(()=>{});
			}).catch(()=>{});
		}
	});
}

/**
 * change password
 */
const changePassword = () => {
	// valid
	passwordForm.value.validate((valid)=>{
		if(valid){
			// strength
			if(state.password.strength<=2){
				ElMessage.warning('密码强度不符合规范，请重新填写。');
				newPasswordValue.value.focus();
				return;
			}
			// equals
			if(state.password.oldPassword!==state.password.newPassword){
				ElMessage.warning('重复密码与新密码不一致，请重新填写。');
				newPasswordValue.value.focus();
				return;
			}
			// confirm
			ElMessageBox.confirm('确定修改密码？', '警告').then(()=>{
				// change password
				$changePassword({oldPassword:state.password.oldPassword, newPassword:state.password.newPassword}).then(handler=>{
					if(handler.data.result){
						ElMessage.success(handler.data.message);
					}
				}).catch(()=>{});
			}).catch(()=>{});
		}
	});
}

/**
 * set shortcut
 */
const setShortcut = () => {
	// confirm
	ElMessageBox.confirm('确定保存快捷方式吗？', '警告').then(()=>{
		// get permission ids
		let permissionIds = '';
		const checkedPermissionKeys = shortcutTree.value.getCheckedKeys();
		checkedPermissionKeys.forEach((key, index)=>{
			permissionIds += key + (index==(checkedPermissionKeys.length-1)?'':',');
		});
		// set shortcut
		$setShortcut({permissionIds:permissionIds}).then(handler=>{
			if(handler.data.result){
				ElMessage.success(handler.data.message);
			}
		}).catch(()=>{});
	}).catch(()=>{});
}

// watch
watch(()=>state.password, (newValue, oldValue)=>{
	if(newValue.newPassword.length>=6) {
		let o=(/[0-9]+/.test(newValue.newPassword))?1:0, p=(/[a-zA-Z]+/.test(newValue.newPassword))?1:0, q=(/[^0-9a-zA-Z]+/.test(newValue.newPassword))?1:0; 
		state.password.strength = o + p + q;
	}else{
		state.password.strength = 0;
	}
}, {immediate: true, deep: true}) 

// get assist data
getAssistData();

// import key
import key from 'keymaster';

// hotkey
key('ctrl+alt+1', ()=>{ state.tab.active='set_user';return false; });
key('ctrl+alt+2', ()=>{ state.tab.active='change_password';return false; });
key('ctrl+alt+3', ()=>{ state.tab.active='set_shortcut';return false; });
key('ctrl+alt+s', ()=>{ 
	if(state.tab.active=='set_user') setUser();
	if(state.tab.active=='change_password') changePassword();
	if(state.tab.active=='set_shortcut') setShortcut();
	return false;
});
</script>

<style scoped>
/** password letter */
.password-letter{margin:6px 0 2px 0;height:6px;font-size:12px;}
.password-letter span{float:left;display:inline-block;width:68px;height:6px;margin-right:2px;text-align:center;color:#fff;background-color:#d0d0d0;}
.password-letter span.s1.password-strength-color{ background-color:#e62929;}
.password-letter span.s2.password-strength-color{ background-color:#ec971f;}
.password-letter span.s3.password-strength-color{ background-color:#449d44;}
/** operation container */
.operation-container{padding:4px 0;text-align:center;border-top:1px solid #f0f0f0;}
</style>