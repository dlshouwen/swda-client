<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="开放平台类型">
					<el-select v-model="grid.query.manualQueryParameters.eq_open_type" clearable placeholder="平台类型" style="width:200px">
						<el-option v-for="dict in appStore.dict.open_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
					</el-select>
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
					<el-button type="primary" @click="addAuthPlatform"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateAuthPlatform()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteAuthPlatform()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateAuthPlatform(scope.row.authPlatformId)">编辑</el-button>
							<el-button link type="danger" @click="deleteAuthPlatform(scope.row.authPlatformId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="平台类型" prop="openType" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.open_type[scope.row.openType].style">{{appStore.dict.open_type[scope.row.openType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="Client ID" prop="clientId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="Client Secret" prop="clientSecret" width="200" align="center" sortable show-overflow-tooltip />
					<el-table-column label="Redirect URI" prop="redirectUri" width="200" align="center" sortable show-overflow-tooltip />
					<el-table-column label="排序码" prop="sort" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" width="120" align="center" sortable show-overflow-tooltip />
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
	<!-- add auth platform -->
	<AddAuthPlatform ref="addAuthPlatformRef" @callback="search"></AddAuthPlatform>
	<!-- update auth platform -->
	<UpdateAuthPlatform ref="updateAuthPlatformRef" @callback="search"></UpdateAuthPlatform>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddAuthPlatform from './AddAuthPlatform.vue'
import UpdateAuthPlatform from './UpdateAuthPlatform.vue'

// import apis
import { $getAuthPlatformPageResult, $deleteAuthPlatform } from '@/api/bms/platform/authPlatform' 

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
	// get auth platform page result
	$getAuthPlatformPageResult(grid.query).then(handler=>{
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

// add auth platform ref
const addAuthPlatformRef = ref()

/**
 * add auth platform
 */
const addAuthPlatform = ()=>{
	// add auth platform init
	addAuthPlatformRef.value.init();
}

// update auth platform ref
const updateAuthPlatformRef = ref()

/**
 * update auth platform
 */
const updateAuthPlatform = (authPlatformId)=>{
	// no auth platform id
	if(!authPlatformId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个授权平台。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个授权平台。', type: 'warning' })
			// return
			return
		}
		// set auth platform id
		authPlatformId = grid.selects[0].authPlatformId
	}
	// update auth platform init
	updateAuthPlatformRef.value.init(authPlatformId);
}

/**
 * delete auth platform
 */
const deleteAuthPlatform = (authPlatformId)=>{
	// defined auth platform ids
	let authPlatformIds = []
	// no auth platform id
	if(!authPlatformId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个授权平台。', type: 'warning' })
			// return
			return
		}
		// set auth platform id
		authPlatformIds = grid.selects.map(select=>select.authPlatformId)
	}else{
		// push auth platform id
		authPlatformIds.push(authPlatformId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete auth platform
		$deleteAuthPlatform(authPlatformIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>