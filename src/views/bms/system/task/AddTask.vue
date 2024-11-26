<template>
	<!-- container -->
	<div class="container">
		<el-row style="height:100%">
			<el-col :span="7" style="height:100%">
				<!-- task panel -->
				<div class="panel data-panel">
					<div class="panel-header">
						<div class="panel-title">
							<el-link icon="plus">新增任务</el-link>
						</div>
					</div>
					<div class="panel-body">
						<!-- form -->
						<sw-form ref="taskForm" :model="task" label-width="64px">
							<!-- items -->
							<sw-form-item type="text" prop="taskId" v-model="task.taskId" label="任务编号" valid="r|integer" :valid-unique="{code:'task.id.add', args:[]}"></sw-form-item>
							<sw-form-item type="text" prop="taskCode" v-model="task.taskCode" label="任务编码" valid="r|english_number|l-le200" :valid-unique="{code:'task.code.add', args:[]}"></sw-form-item>
							<sw-form-item type="text" prop="taskName" v-model="task.taskName" label="任务名称" valid="r|l-le400"></sw-form-item>
							<sw-form-item type="radio" prop="taskStatus" v-model="task.taskStatus" label="任务状态" :items="dataStore.dict.task_status" valid="r"></sw-form-item>
							<sw-form-item type="radio" prop="isNeverOverdue" v-model="task.isNeverOverdue" label="永不过期" :items="dataStore.dict.zero_one" valid="r"></sw-form-item>
							<sw-form-item type="datetime" prop="overdueTime" v-model="task.overdueTime" label="过期时间" valid="" :item-props="{format:'YYYY-MM-DD HH:mm:ss', valueFormat:'YYYY-MM-DD HH:mm:ss'}" :disabled="task.isNeverOverdue=='1'"></sw-form-item>
							<sw-form-item type="radio" prop="isAllUser" v-model="task.isAllUser" label="全用户" :items="dataStore.dict.zero_one" valid="r"></sw-form-item>
							<sw-form-item type="number" prop="iteratorTime" v-model="task.iteratorTime" label="迭代时间" valid="r|integer" :item-props="{min:1}"></sw-form-item>
							<sw-form-item type="textarea" prop="detonateSql" v-model="task.detonateSql" label="触发SQL" valid="r|l-le400"></sw-form-item>
							<sw-form-item type="textarea" prop="alertMessage" v-model="task.alertMessage" label="提示信息" valid="r|l-le400"></sw-form-item>
							<sw-form-item type="text" prop="assistSearch" v-model="task.assistSearch" label="辅助查询" valid="l-le400"></sw-form-item>
							<sw-form-item type="text" prop="sort" v-model="task.sort" label="排序码" valid="r|integer"></sw-form-item>
							<sw-form-item type="textarea" prop="remark" v-model="task.remark" label="备注" valid="l-le200"></sw-form-item>
							<!-- operation -->
							<sw-form-item>
								<sw-button type="success" :underline="false" icon="circle-check" @click="addTask" permission="bms:system:task:add">保存 (S)</sw-button>
								<sw-button type="warning" :underline="false" icon="refresh-left" @click="reset">重置 (R)</sw-button>
							</sw-form-item>
						</sw-form>
					</div>
				</div>
			</el-col>
			<el-col :span="5" style="height:100%">
				<!-- permission panel -->
				<div class="panel data-panel" style="margin-left:0;">
					<div class="panel-header">
						<div class="panel-title">
							<el-link icon="s-flag">响应功能</el-link>
						</div>
					</div>
					<div class="panel-body" style="height:469px;overflow:auto;">
						<el-tree ref="permissionTree" show-checkbox node-key="id" :check-on-click-node="true" :default-expand-all="true" :check-strictly="true" @check="permissionTreeCheck"
							:props="{id:'id', pid:'pid', label:'label'}" :data="permissions" :default-checked-keys="defaultCheckedPermissions"></el-tree>
					</div>
				</div>
			</el-col>
			<el-col :span="12" style="height:100%">
				<!-- user panel -->
				<div class="panel data-panel" style="margin-left:0;">
					<div class="panel-header">
						<div class="panel-title">
							<el-link icon="user">响应用户</el-link>
						</div>
					</div>
					<div class="panel-body">
						<sw-grid ref="userGrid" id="user_list" title="用户列表" url="/bms/system/task/user/list" row-key="userId" :params="{taskId: -1}" :height="200" 
							:toolbar-label="false" layout="prev, pager, next, total"
							@selection-change="selection=>{selectUsers=selection}" @grid-completed="userGridCompleted">
							<sw-column type="selection" key="userId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
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
				<!-- role panel -->
				<div class="panel data-panel" style="margin-left:0;">
					<div class="panel-header">
						<div class="panel-title">
							<el-link icon="avatar">响应角色</el-link>
						</div>
					</div>
					<div class="panel-body">
						<sw-grid ref="roleGrid" id="role_list" title="角色列表" url="/bms/system/task/role/list" row-key="roleId" :params="{taskId: -1}" :height="180" 
							:toolbar-label="false" layout="prev, pager, next, total"
							@selection-change="selection=>{selectRoles=selection}" @grid-completed="roleGridCompleted">
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
			</el-col>
		</el-row>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get permission tree list, get task role list, get task user list, get task data, add task
import { $getPermissionTreeList, $getTaskRoleList, $getTaskUserList, $getTaskData, $addTask } from '@/assets/config/api';

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
	// height
	height: 0,
	// permissions
	permissions: [],
	// default checked permissions
	defaultCheckedPermissions: [],
	// task
	task: { info:{} },
	// select users
	selectUsers: [],
	// select roles
	selectRoles: [],
});

// to refs
const { height, permissions, defaultCheckedPermissions, task, selectUsers, selectRoles } = toRefs(state);

// ref
const taskForm = ref()
const permissionTree = ref()
const userGrid = ref()
const roleGrid = ref()

/**
 * reset
 */
const reset = () => {
	// get permission tree list
	getPermissionTreeList();
	// user load
	userLoad();
	// role load
	roleLoad();
	// get task data
	getTaskData();
}

/**
 * get permission tree list
 */
const getPermissionTreeList = () => {
	// get permission tree list
	$getPermissionTreeList({systemId:'', permissionType:'1'}).then(handler=>{
		// set permissions
		state.permissions = handler.data.data.permissionList;
		// set not leaf permission disabled
		setNotLeafPermissionsDisabled(state.permissions);
	});
}

/**
 * set not leaf permission disabled
 * @param permissions
 */
const setNotLeafPermissionsDisabled = (permissions) => {
	// for each permissions
	for(let i=0; i<permissions.length; i++){
		// get permission
		let permission = permissions[i];
		// if not leaf
		if(!permission.leaf){
			// set disabled true
			permission.disabled = true;
			// set not leacf permissions disabled
			setNotLeafPermissionsDisabled(permission.children);
		}
	}
}

/**
 * permission tree check
 * @param node
 * @param datas
 */
const permissionTreeCheck = (node, datas) => {
	// if checked keys greate than 2
	if(datas.checkedKeys.length>=2) {
		// set check keys
		permissionTree.value.setCheckedKeys([node.id]);
	}
	// set permission id
	state.task.permissionId = node.id.replace('p', '');
}

/**
 * user load
 */
const userLoad = () => {
	userGrid.value.load();
}

/**
 * user grid completed
 */
const userGridCompleted = () => {
	// next tick
	nextTick(()=>{
		// set select users empty
		state.selectUsers = [];
		// clear selection
		userGrid.value.clearSelection();
		// select users
		userGrid.value.datas.origin.forEach(data=>{ userGrid.value.toggleRowSelection(data, data.info.checked=='1'); });
	})
}

/**
 * load
 */
const roleLoad = () => {
	roleGrid.value.load();
}

/**
 * grid completed
 */
const roleGridCompleted = (event) => {
	// next tick
	nextTick(()=>{
		// set select roles empty
		state.selectRoles = [];
		// clear selection
		roleGrid.value.clearSelection();
		// select roles
		roleGrid.value.datas.origin.forEach(data=>{ roleGrid.value.toggleRowSelection(data, data.info.checked=='1'); });
	})
}

/**
 * general assist search
 */
const generalAssistSearch = () => {
	// defined value
	let value = '';
	// append task code
	value += state.task.taskCode?state.task.taskCode:'';
	// if has task name
	if(state.task.taskName){
		// append task name
		value += state.task.taskName;
		// append task name first spell / full spell
		value += tool.getFirstSpell(state.task.taskName);
		value += tool.getFullSpell(state.task.taskName);
	}
	// set assist search
	state.task.assistSearch = value;
}

/**
 * get task data
 */
const getTaskData = () => {
   	// get task data
	$getTaskData({taskId:-1}).then(handler=>{
		// set task
		state.task = handler.data.data.task;
	});
}

/**
 * add task
 */
const addTask = () => {
	// valid
	taskForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定新增任务信息？', '提示').then(()=>{
				// set role ids
				let roleIds = [];
				state.selectRoles.forEach(role=>{
					roleIds.push(role.roleId);
				});
				state.task.info.roleIds = roleIds.join(',');
				// set user ids
				let userIds = [];
				state.selectUsers.forEach(user=>{
					userIds.push(user.userId);
				});
				state.task.info.userIds = userIds.join(',');
				// add task
				$addTask(state.task).then(handler=>{
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

//watch
watch(()=>state.task.taskCode, ()=>{ generalAssistSearch() }, {deep: true}) 
watch(()=>state.task.taskName, ()=>{ generalAssistSearch() }, {deep: true}) 

// reset
onMounted(()=>{
	reset();
})

// hotkey
key('alt+s', ()=>{ addTask();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>