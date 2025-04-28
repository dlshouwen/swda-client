<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="search" :inline="true">
				<el-form-item label="用户编号">
					<el-input v-model="search.eq_user_id" placeholder="请输入用户编号" clearable style="width:130px" />
				</el-form-item>
				<el-form-item label="用户名称">
					<el-input v-model="search.lk_username" placeholder="请输入用户名称" clearable style="width:130px" />
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="search.eq_gender" clearable style="width:100px">
						<el-option v-for="item in appStore.dict.gender.datas" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click="reset"><sw-icon icon="redo"></sw-icon>重置</el-button>
					<el-button type="primary" @click="load"><sw-icon icon="search"></sw-icon>查询</el-button>
					<el-button type="primary" @click="addUser"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateUser()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteUser()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- grid container -->
		<el-card class="panel panel-auto">
			<!-- grid -->
			<sw-table ref="gridRef" row-key="userId" url="/bms/permission/user/page" :search="search" title="用户列表">
				<sw-table-column type="selection" width="55" :advance="false" :printable="false" :exportable="false" />
				<sw-table-column label="操作" width="120" align="center" :advance="false" :printable="false" :exportable="false">
					<template #default="scope">
						<el-button link type="warning" @click="updateUser(scope.row.userId)">编辑</el-button>
						<el-button link type="danger" @click="deleteUser(scope.row.userId)">删除</el-button>
					</template>
				</sw-table-column>
				<sw-table-column prop="username" label="用户名称" width="120" fast="lk" />
				<sw-table-column prop="realName" label="真实名称" width="120" fast="lk" />
				<sw-table-column prop="organName" label="所属机构" width="120" fast="eq" />
				<sw-table-column prop="superAdmin" label="超级管理员" width="130" dict="zero_one" fast="eq" fast-type="radio" >
					<template #default="scope">
						<el-tag type="danger" v-if="scope.row.superAdmin=='1'">超级管理员</el-tag>
						<span v-if="scope.row.superAdmin=='0'"></span>
					</template>
				</sw-table-column>
				<sw-table-column prop="status" label="用户状态" dict="open_close" width="120" fast="eq" fast-type="radio" />
				<sw-table-column prop="gender" label="性别" dict="gender" width="90" fast="eq" fast-type="radio" />
				<sw-table-column prop="cardId" label="证件号" width="200" fast="eq" />
				<sw-table-column prop="mobile" label="手机号" width="180" fast="eq" />
				<sw-table-column prop="email" label="Email" width="200" fast="eq" />
				<sw-table-column prop="address" label="地址" width="200" fast="lk" />
				<sw-table-column prop="remark" label="备注" width="200" fast="lk" />
				<sw-table-column prop="createTime" label="创建时间" data-type="date" width="180" fast="range" />
			</sw-table>
		</el-card>
	</el-container>
	<!-- add user -->
	<AddUser ref="addUserRef" @callback="search"></AddUser>
	<!-- update user -->
	<UpdateUser ref="updateUserRef" @callback="search"></UpdateUser>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddUser from './AddUser.vue'
import UpdateUser from './UpdateUser.vue'

// import apis
import { $deleteUser } from '@/api/bms/permission/user' 

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// const grid ref
const gridRef = ref()

// const params
const search = ref({})

/**
 * reset
 */
const reset = ()=>{
	// reset
	search.value = {}
}

/**
 * load
 */
const load = ()=>{
	// load
	gridRef.value.load()
}

// add user ref
const addUserRef = ref()

/**
 * add user
 */
const addUser = ()=>{
	// add user init
	addUserRef.value.init();
}

// update user ref
const updateUserRef = ref()

/**
 * update user
 */
const updateUser = (userId)=>{
	// no user id
	if(!userId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个用户。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个用户。', type: 'warning' })
			// return
			return
		}
		// set user id
		userId = selects[0].userId
	}
	// update user init
	updateUserRef.value.init(userId);
}

/**
 * delete user
 */
const deleteUser = async (userId)=>{
	// defined user ids
	let userIds = []
	// no user id
	if(!userId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个用户。', type: 'warning' })
			// return
			return
		}
		// set user id
		userIds = selects.map(select=>select.userId)
	}else{
		// push user id
		userIds.push(userId)
	}
	// confirm
	await ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
	// delete user
	await $deleteUser(userIds)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: load })
}
</script>