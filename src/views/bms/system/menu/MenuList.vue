<template>
	<!-- container -->
	<sw-container>
		<!-- search panel -->
		<sw-panel icon="search">
			<!-- title -->
			<template #title>查询面板</template>
			<!-- operation -->
			<template #operation>
				<sw-button type="warning" icon="redo" @click="reset">重置</sw-button>
				<sw-button type="primary" icon="search" @click="load">查询</sw-button>
			</template>
			<!-- form -->
			<el-form :model="search" :inline="true">
				<sw-select-system v-model="search.eq_system_id" label="所属系统" clearable style="width:130px" />
			</el-form>
		</sw-panel>
		<!-- data panel -->
		<sw-panel icon="app-store" flex>
			<!-- title -->
			<template #title>系统列表</template>
			<!-- operation -->
			<template #operation>
				<sw-button authority="bms:system:menu:add" type="primary" icon="plus" @click="addMenu">新增</sw-button>
				<sw-button authority="bms:system:menu:update" type="warning" icon="edit" @click="updateMenu()">编辑</sw-button>
				<sw-button authority="bms:system:menu:delete" type="danger" icon="delete" @click="deleteMenu()">删除</sw-button>
			</template>
			<!-- grid -->
			<sw-table ref="gridRef" url="/bms/system/menu/list" once row-key="Id" :search="search">
				<sw-table-column type="selection" width="55" element />
				<sw-table-column label="操作" width="210" element>
					<template #default="scope">
						<sw-link authority="bms:system:menu:update" type="warning" divider @click="updateJob(scope.row.menuId)">编辑</sw-link>
						<sw-link authority="bms:system:menu:delete" type="danger" divider @click="deleteJob(scope.row.menuId)">删除</sw-link>
					</template>
				</sw-table-column>
				<sw-table-column data-type="number" prop="jobId" label="任务编号" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="jobCode" label="任务编码" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="jobName" label="任务名称" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="jobGroup" dict="job_group" label="任务分组" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="jobStatus" dict="job_status" label="任务状态" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="allowConcurrent" dict="zero_one" label="允许并发" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="beanName" label="bean名称" align="left" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="methodName" label="方法名称" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="params" label="参数" align="left" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="cronExpression" label="cron表达式" width="120" fast="lk" />
				<sw-table-column data-type="string" prop="assistSearch" label="辅助查询" width="120" fast="lk" />
				<sw-table-column data-type="number" prop="sort" label="排序码" width="120" fast="eq" />
				<sw-table-column data-type="string" prop="remark" label="备注" align="left" width="120" fast="lk" />
				<sw-table-column data-type="date" prop="createTime" label="创建时间" width="180" fast="range" />
			</sw-table>
		</sw-panel>
	</sw-container>
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