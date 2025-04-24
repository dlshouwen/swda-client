<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="所属系统">
					<el-select v-model="grid.query.manualQueryParameters.eq_system_id" placeholder="所属系统" style="width:160px">
						<el-option v-for="system in systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属机构">
					<el-tree-select v-model="grid.query.manualQueryParameters.eq_organ_id" :data="organList" check-strictly :render-after-expand="false" style="width:160px" />
				</el-form-item>
				<el-form-item label="角色编号">
					<el-input v-model="grid.query.manualQueryParameters.eq_role_id" placeholder="请输入角色编号" clearable style="width:130px" />
				</el-form-item>
				<el-form-item label="角色名称">
					<el-input v-model="grid.query.manualQueryParameters.lk_rolename" placeholder="请输入角色名称" clearable style="width:130px" />
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click="reset"><sw-icon icon="redo"></sw-icon>重置</el-button>
					<el-button type="primary" @click="search"><sw-icon icon="search"></sw-icon>查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- grid container -->
		<el-card class="panel panel-auto">
			<!-- operate -->
			<el-row class="panel-operate">
				<el-col class="left" :span="12">
					<el-button type="default" @click="search"><sw-icon icon="sync"></sw-icon>刷新</el-button>
				</el-col>
				<el-col class="right" :span="12">
					<el-button type="primary" @click="addRole"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateRole()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteRole()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateRole(scope.row.roleId)">编辑</el-button>
							<el-button link type="danger" @click="deleteRole(scope.row.roleId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="角色编号" prop="roleId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="所属系统" prop="systemName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="所属机构" prop="organName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="角色编码" prop="roleCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="角色名称" prop="roleName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="数据范围" prop="dataScope" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.data_scope_type[scope.row.dataScope].style">{{appStore.dict.data_scope_type[scope.row.dataScope].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="排序码" prop="sort" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column prop="remark" label="备注" sortable show-overflow-tooltip width="200" />
					<el-table-column prop="createTime" label="创建时间" align="center" sortable show-overflow-tooltip width="180" />
				</el-table>
			</el-row>
			<!-- pagination -->
			<el-row class="panel-pagination">
				<el-pagination v-model:current-page="grid.query.page.current" v-model:page-size="grid.query.page.size" :page-sizes="grid.option.sizes"
					:layout="grid.option.layout" :total="grid.total" @size-change="search" @current-change="search" />
			</el-row>
		</el-card>
	</el-container>
	<!-- add role -->
	<AddRole ref="addRoleRef" @callback="search"></AddRole>
	<!-- update role -->
	<UpdateRole ref="updateRoleRef" @callback="search"></UpdateRole>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddRole from './AddRole.vue'
import UpdateRole from './UpdateRole.vue'

// import apis
import { $getRolePageResult, $deleteRole } from '@/api/bms/permission/role' 
import { $getSystemList } from '@/api/bms/system/system'
import { $getOrganList } from '@/api/bms/permission/organ'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// const grid container ref
const gridContainerRef = ref(null)

// const grid ref
const gridRef = ref(null)

// const grid
const grid = reactive({
	option: {
		height: '200px',
		sizes: [50, 100, 500, 1000],
		layout: 'total, sizes, prev, pager, next, jumper'
	},
	selects: [],
	total: 0,
	datas: [],
	query: {
		page: {
			size: 50,
			current: 1
		},
		manualQueryParameters: {},
		fastQueryParameters: {},
		advanceQueryConditions: [],
		advanceQuerySorts: [],
	}
});

// mounted
onMounted(() => {
	// get system list
	getSystemList()
	// get organ list
	getOrganList()
	// search
	search()
	// resize height
	grid.option.height = gridContainerRef.value.$el.clientHeight+ 'px'
	// resize
    window.onresize = () => {
		// resize height
        grid.option.height = gridContainerRef.value.$el.clientHeight + 'px'
    }
})

// const organ list
const organList = ref()

// const system list
const systemList = ref()

/**
 * get system list
 */
const getSystemList = async () => {
	// get system list
	let handler = await $getSystemList()
	// set system datas
	systemList.value = handler.data
}

/**
 * get organ list
 */
const getOrganList = async () => {
	// get organ list
	let handler = await $getOrganList()
	// set organ datas
	organList.value = handler.data
}

/**
 * reset
 */
const reset = ()=>{
	// reset
	grid.query.manualQueryParameters = {}
}

/**
 * search
 */
const search = ()=>{
	// get role page result
	$getRolePageResult(grid.query).then(handler=>{
		// set total
		grid.total = handler.data.total
		// set datas
		grid.datas = handler.data.datas
	})
}

/**
 * grid selection change
 */
const gridSelectionChange = (datas)=>{
	// set select
	grid.selects = datas
}

// add role ref
const addRoleRef = ref()

/**
 * add role
 */
const addRole = ()=>{
	// add role init
	addRoleRef.value.init();
}

// update role ref
const updateRoleRef = ref()

/**
 * update role
 */
const updateRole = (roleId)=>{
	// no role id
	if(!roleId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个角色。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个角色。', type: 'warning' })
			// return
			return
		}
		// set role id
		roleId = grid.selects[0].roleId
	}
	// update role init
	updateRoleRef.value.init(roleId);
}

/**
 * delete role
 */
const deleteRole = (roleId)=>{
	// defined role ids
	let roleIds = []
	// no role id
	if(!roleId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个角色。', type: 'warning' })
			// return
			return
		}
		// set role id
		roleIds = grid.selects.map(select=>select.roleId)
	}else{
		// push role id
		roleIds.push(roleId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete role
		$deleteRole(roleIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>