<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="系统编号">
					<el-input v-model="grid.query.manualQueryParameters.eq_system_id" placeholder="请输入系统编号" clearable style="width:130px" />
				</el-form-item>
				<el-form-item label="系统名称">
					<el-input v-model="grid.query.manualQueryParameters.lk_systemname" placeholder="请输入系统名称" clearable style="width:130px" />
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
					<sw-button type="primary" @click="addSystem" authority="bms:system:system:add"><sw-icon icon="plus"></sw-icon>新增</sw-button>
					<el-button type="warning" @click="updateSystem()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteSystem()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<sw-button link type="warning" @click="updateSystem(scope.row.systemId)" divider>编辑</sw-button>
							<el-button link type="danger" @click="deleteSystem(scope.row.systemId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="系统编号" prop="systemId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="系统编码" prop="systemCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="系统名称" prop="systemName" width="160" align="center" sortable show-overflow-tooltip />
					<el-table-column label="图标" prop="icon" width="90" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag type="primary"><sw-icon :icon="scope.row.icon"></sw-icon></el-tag>
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="sort" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" width="180" align="left" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
			<!-- pagination -->
			<el-row class="panel-pagination">
				<el-pagination v-model:current-page="grid.query.page.current" v-model:page-size="grid.query.page.size" :page-sizes="grid.option.sizes"
					:layout="grid.option.layout" :total="grid.total" @size-change="search" @current-change="search" />
			</el-row>
		</el-card>
	</el-container>
	<!-- add system -->
	<AddSystem ref="addSystemRef" @callback="search"></AddSystem>
	<!-- update system -->
	<UpdateSystem ref="updateSystemRef" @callback="search"></UpdateSystem>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddSystem from './AddSystem.vue'
import UpdateSystem from './UpdateSystem.vue'

// import apis
import { $getSystemPageResult, $deleteSystem } from '@/api/bms/system/system' 

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
	// get system page result
	$getSystemPageResult(grid.query).then(handler=>{
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

// add system ref
const addSystemRef = ref()

/**
 * add system
 */
const addSystem = ()=>{
	// add system init
	addSystemRef.value.init();
}

// update system ref
const updateSystemRef = ref()

/**
 * update system
 */
const updateSystem = (systemId)=>{
	// no system id
	if(!systemId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个系统。', type: 'warning' })
			// return
			return
		}
		// set system id
		systemId = grid.selects[0].systemId
	}
	// update system init
	updateSystemRef.value.init(systemId);
}

/**
 * delete system
 */
const deleteSystem = (systemId)=>{
	// defined system ids
	let systemIds = []
	// no system id
	if(!systemId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个系统。', type: 'warning' })
			// return
			return
		}
		// set system id
		systemIds = grid.selects.map(select=>select.systemId)
	}else{
		// push system id
		systemIds.push(systemId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete system
		$deleteSystem(systemIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>