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
					<label>机构名称：</label>
					<span><el-input v-model="search.lk_organName" placeholder="请输入机构名称"></el-input></span>
					<label>用户编号：</label>
					<span><el-input v-model="search.eq_userId" placeholder="请输入用户编号"></el-input></span>
					<label>用户编码：</label>
					<span><el-input v-model="search.lk_userCode" placeholder="请输入用户编码"></el-input></span>
					<label>用户名称：</label>
					<span><el-input v-model="search.lk_userName" placeholder="请输入用户名称"></el-input></span>
					<label style="flex-basis:42px;">启用：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_isEnable" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.zero_one" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label style="flex-basis:42px;">性别：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_sex" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.sex" :key="key" :label="value" :value="key"></el-option>
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
					<el-link icon="user">用户管理</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="primary" :underline="false" icon="plus" @click.stop="addUser();" permission="bms:system:user:add" divider>新增 (A)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="edit" @click.stop="updateUser();" permission="bms:system:user:update" divider>编辑 (U)</sw-link>
					<sw-link class="link-layout" type="warning" :underline="false" icon="key" @click.stop="resetPassword();" permission="bms:system:user:reset_password" divider>重置密码 (K)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="menu" @click.stop="setSystem();" permission="bms:system:user:set_system" divider>配置系统 (S)</sw-link>
					<sw-link class="link-layout" type="primary" :underline="false" icon="avatar" @click.stop="setRole();" permission="bms:system:user:set_role" divider>配置角色 (R)</sw-link>
					<sw-link class="link-layout" type="danger" :underline="false" icon="delete" @click.stop="deleteUser();" permission="bms:system:user:delete">删除 (D)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="userGrid" id="user_list" title="用户列表" url="/bms/system/user/list" row-key="userId" :search="search" :height="height"
						@row-dblclick="row=>{updateUser(row.userId)}" @selection-change="selection=>{selectUsers=selection}">
						<sw-column type="selection" key="userId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column label="操作" width="140" :fast="false" :advance="false" :export="false" :print="false" :sortable="false">
							<template #default="scope">
								<sw-link type="primary" :underline="false" icon="edit" @click.stop="updateUser(scope.row.userId)" permission="bms:system:user:update" divider></sw-link>
								<sw-link type="warning" :underline="false" icon="key" @click.stop="resetPassword(scope.row.userId)" permission="bms:system:user:reset_password" divider></sw-link>
								<template v-if="scope.row.userId>0">
									<sw-link type="primary" :underline="false" icon="menu" @click.stop="setSystem(scope.row.userId)" permission="bms:system:user:set_system" divider></sw-link>
									<sw-link type="primary" :underline="false" icon="avatar" @click.stop="setRole(scope.row.userId)" permission="bms:system:user:set_role" divider></sw-link>
								</template>
								<sw-link type="danger" :underline="false" icon="delete" @click.stop="deleteUser(scope.row.userId)" permission="bms:system:user:delete"></sw-link>
							</template>
						</sw-column>
						<sw-column id="organName" label="所属机构" width="140" fast="lk" info></sw-column>
						<sw-column id="userId" label="用户编号" width="100" data-type="number" fast="eq"></sw-column>
						<sw-column id="userCode" label="用户编码" width="100" fast="lk"></sw-column>
						<sw-column id="userName" label="用户名称" width="100" fast="lk"></sw-column>
						<sw-column id="passwordExpireTime" label="过期时间" width="100" data-type="date" otype="string" oformat="yyyy-MM-dd" format="yyyy-MM-dd" fast="range"></sw-column>
						<sw-column id="isEnable" label="启用" width="60" :dict="dataStore.dict.zero_one" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="sex" label="性别" width="60" :dict="dataStore.dict.sex" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="cardId" label="证件号" width="140" fast="lk"></sw-column>
						<sw-column id="phone" label="联系电话" width="90" fast="lk"></sw-column>
						<sw-column id="email" label="电子邮箱" width="160" fast="lk"></sw-column>
						<sw-column id="address" label="联系地址" width="180" fast="lk"></sw-column>
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
			<AddUser></AddUser>
		</el-dialog>
		<el-dialog title="编辑" center width="400px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.update">
			<UpdateUser :userId="currentUserId"></UpdateUser>
		</el-dialog>
		<el-dialog title="配置系统" center width="800px" height="600px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.setSystem">
			<SetSystem :userId="currentUserId"></SetSystem>
		</el-dialog>
		<el-dialog title="配置角色" center width="800px" height="600px" @close="load" :close-on-click-modal="false" :destroy-on-close="true" v-model="show.setRole">
			<SetRole :userId="currentUserId"></SetRole>
		</el-dialog>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get user list, delete user, reset password
import { $getUserList, $deleteUser, $resetPassword } from '@/assets/config/api';

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

// import components: add user & update user & set system & set role
import AddUser from '@/views/bms/system/user/AddUser';
import UpdateUser from '@/views/bms/system/user/UpdateUser';
import SetSystem from '@/views/bms/system/user/SetSystem';
import SetRole from '@/views/bms/system/user/SetRole';

// const state
const state = reactive({
	// loading
	loading: false,
	// height
	height: 500,
	// search
	search: { eq_userId: '', lk_userCode: '', lk_userName: '', eq_isEnable: '', eq_sex: '', lk_assistSearch: '' },
	// show
	show: { add: false, update: false, setSystem: false, setRole: false },
	// current user id
	currentUserId: '',
	// select users
	selectUsers: [],
});

// to refs
const { loading, height, search, show, currentUserId, selectUsers } = toRefs(state);

// ref
const userGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_userId: '', lk_userCode: '', lk_userName: '', eq_isEnable: '', eq_sex: '', lk_assistSearch: '' };
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
	userGrid.value.load();
}

/**
 * add user
 */
const addUser = () => {
	state.show.add = true;
}

/**
 * update user
 * @param userId
 */
const updateUser = (userId) => {
	// param invalid
	if(userId===undefined||userId===null){
		// no select
		if(state.selectUsers.length<=0){
			ElMessage.warning('未选择需要更新的数据。');
			return;
		}
		// set first user
		userId = state.selectUsers[0].userId;
	}
	// set current user id
	state.currentUserId = userId;
	// show update user
	state.show.update = true;
}

/**
 * delete user
 * @param userIds
 */
const deleteUser = (userIds) => {
	// param invalid
	if(!userIds){
		// no select
		if(state.selectUsers.length<=0){
			ElMessage.warning('未选择需要删除的数据。');
			return;
		}
		// set user ids
		userIds = state.selectUsers.map(user=>user.userId).join(',');
	}
	// confirm
	ElMessageBox.confirm('确定删除用户信息？', '警告').then(()=>{
		// delete user
		$deleteUser({userIds:userIds}).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success({message:handler.data.message, dangerouslyUseHTMLString:true});
				// load
				load();
			}
		});
	}).catch(()=>{});
}

/**
 * reset password
 * @param userIds
 */
const resetPassword = (userId) => {
	// param invalid
	if(userId===undefined||userId===null){
		// no select
		if(state.selectUsers.length<=0){
			ElMessage.warning('未选择需要重置密码的数据。');
			return;
		}
		// set user ids
		userId = state.selectUsers[0].userId;
	}
	// confirm
	ElMessageBox.confirm('确定重置用户密码吗？', '警告').then(()=>{
		// delete user
		$resetPassword({userId:userId}).then(handler=>{
			// success
			if(handler.data.result){
				ElMessage.success(handler.data.message);
			}
		});
	}).catch(()=>{});
}

/**
 * set system
 * @param userId
 */
const setSystem = (userId) => {
	// param invalid
	if(userId===undefined||userId===null){
		// no select
		if(state.selectUsers.length<=0){
			ElMessage.warning('未选择需要配置系统的数据。');
			return;
		}
		// set user id
		userId = state.selectUsers[0].userId;
	}
	// if system account
	if(userId<0){
		ElMessage.warning('系统账户无需配置系统信息。');
		return;
	}
	// set current user id
	state.currentUserId = userId;
	// show set system
	state.show.setSystem = true;
}

/**
 * set role
 * @param userId
 */
const setRole = (userId) => {
	// param invalid
	if(userId===undefined||userId===null){
		// no select
		if(state.selectUsers.length<=0){
			ElMessage.warning('未选择需要配置角色的数据。');
			return;
		}
		// set user id
		userId = state.selectUsers[0].userId;
	}
	// if system account
	if(userId<0){
		ElMessage.warning('系统账户无需配置角色信息。');
		return;
	}
	// set current user id
	state.currentUserId = userId;
	// show set role
	state.show.setRole = true;
}

// watch
watch(()=>state.search, ()=>{ load() }, {deep: true}) 

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
key('alt+a', ()=>{ addUser();return false; });
key('alt+u', ()=>{ updateUser();return false; });
key('alt+d', ()=>{ deleteUser();return false; });
key('alt+k', ()=>{ resetPassword();return false; });
key('alt+s', ()=>{ setSystem();return false; });
key('alt+r', ()=>{ setRole();return false; });
</script>