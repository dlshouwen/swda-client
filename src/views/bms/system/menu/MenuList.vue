<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :inline="true">
				<el-form-item label="所属系统">
					<el-select v-model="systemId" placeholder="所属系统" style="width:160px">
						<el-option v-for="system in systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click="reset"><sw-icon icon="redo"></sw-icon>重置</el-button>
					<el-button type="primary" @click="getMenuList"><sw-icon icon="search"></sw-icon>查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- grid container -->
		<el-card class="panel panel-auto">
			<!-- operate -->
			<el-row class="panel-operate">
				<el-col class="left" :span="12">
					<el-button type="default" @click="getMenuList"><sw-icon icon="sync"></sw-icon>重新加载</el-button>
				</el-col>
				<el-col class="right" :span="12">
					<el-button type="primary" @click="addMenu"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateMenu()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteMenu()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" row-key="menuId" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column prop="menuName" label="菜单名称" sortable show-overflow-tooltip width="200" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateMenu(scope.row.menuId)">编辑</el-button>
							<el-button link type="danger" @click="deleteMenu(scope.row.menuId, scope.row.preMenuId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="menuId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="编码" prop="menuCode" width="140" align="center" sortable show-overflow-tooltip />
					<el-table-column label="名称" prop="menuName" width="160" align="center" sortable show-overflow-tooltip />
					<el-table-column label="类型" prop="menuType" width="90" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.menu_type[scope.row.menuType].style">{{appStore.dict.menu_type[scope.row.menuType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="权限值" prop="authority" width="200" align="left" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="路径" prop="path" width="200" align="left" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="组件" prop="component" width="200" align="left" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="图标" prop="icon" width="90" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag type="primary"><sw-icon :icon="scope.row.icon"></sw-icon></el-tag>
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="sort" width="90" align="center" sortable show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" width="180" align="left" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
		</el-card>
	</el-container>
	<!-- add menu -->
	<AddMenu ref="addMenuRef" @callback="getMenuList"></AddMenu>
	<!-- update menu -->
	<UpdateMenu ref="updateMenuRef" @callback="getMenuList"></UpdateMenu>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddMenu from './AddMenu.vue'
import UpdateMenu from './UpdateMenu.vue'

// import apis
import { $getMenuList, $deleteMenu } from '@/api/bms/system/menu' 
import { $getSystemList } from '@/api/bms/system/system'

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
	},
	selects: [],
	datas: [],
});

// mounted
onMounted(() => {
	// reset
	reset()
	// resize height
	grid.option.height = gridContainerRef.value.$el.clientHeight+ 'px'
	// resize
    window.onresize = () => {
		// resize height
        grid.option.height = gridContainerRef.value.$el.clientHeight + 'px'
    }
})

// const system id
const systemId = ref()

// const system list
const systemList = ref()

/**
 * get system list
 */
const reset = async ()=>{
	// get system list
	await getSystemList()
	// set system id
	systemId.value = systemList.value[0].systemId
	// get menu list
	getMenuList()
}

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
 * get menu list
 */
const getMenuList = ()=>{
	// get menu list
	$getMenuList(systemId.value).then(handler=>{
		// set datas
		grid.datas = handler.data
	})
}

/**
 * grid selection change
 */
const gridSelectionChange = (datas)=>{
	// set select
	grid.selects = datas
}

// add menu ref
const addMenuRef = ref()

/**
 * add menu
 */
const addMenu = ()=>{
	// add menu init
	addMenuRef.value.init();
}

// update menu ref
const updateMenuRef = ref()

/**
 * update menu
 */
const updateMenu = (menuId)=>{
	// no menu id
	if(!menuId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个菜单。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个菜单。', type: 'warning' })
			// return
			return
		}
		// set menu id
		menuId = grid.selects[0].menuId
	}
	// update menu init
	updateMenuRef.value.init(menuId);
}

/**
 * delete menu
* @param menuId
 */
const deleteMenu = (menuId)=>{
	// no menu id
	if(!menuId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个菜单。', type: 'warning' })
			// return
			return
		}
		// no more than 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个菜单。', type: 'warning' })
			// return
			return
		}
		// set menu id
		menuId = grid.selects[0].menuId
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete menu
		$deleteMenu(menuId).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// update menu children
				getMenuList()
			}})
		})
	})
}
</script>