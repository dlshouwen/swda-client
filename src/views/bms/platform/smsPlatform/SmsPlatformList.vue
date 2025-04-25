<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="短信平台类型">
					<el-select v-model="grid.query.manualQueryParameters.eq_sms_platform_type" clearable placeholder="平台类型" style="width:200px">
						<el-option v-for="dict in appStore.dict.sms_platform_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
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
					<el-button type="primary" @click="addSmsPlatform"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateSmsPlatform()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteSmsPlatform()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateSmsPlatform(scope.row.smsPlatformId)">编辑</el-button>
							<el-button link type="danger" @click="deleteSmsPlatform(scope.row.smsPlatformId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="smsPlatformId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="编码" prop="smsPlatformCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="名称" prop="smsPlatformName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="平台类型" prop="smsPlatformType" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.sms_platform_type[scope.row.smsPlatformType].style">{{appStore.dict.open_type[scope.row.smsPlatformType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="状态" prop="status" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.open_close[scope.row.status].style">{{appStore.dict.open_close[scope.row.status].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="签名名称" prop="signName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="模板编号" prop="templateId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="应用编号" prop="appId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="发送人编号" prop="senderId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="接入地址" prop="url" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="access key" prop="accessKey" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="secret key" prop="secretKey" width="120" align="center" sortable show-overflow-tooltip />
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
	<!-- add sms platform -->
	<AddSmsPlatform ref="addSmsPlatformRef" @callback="search"></AddSmsPlatform>
	<!-- update sms platform -->
	<UpdateSmsPlatform ref="updateSmsPlatformRef" @callback="search"></UpdateSmsPlatform>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddSmsPlatform from './AddSmsPlatform.vue'
import UpdateSmsPlatform from './UpdateSmsPlatform.vue'

// import apis
import { $getSmsPlatformPageResult, $deleteSmsPlatform } from '@/api/bms/platform/smsPlatform' 

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
	// get sms platform page result
	$getSmsPlatformPageResult(grid.query).then(handler=>{
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

// add sms platform ref
const addSmsPlatformRef = ref()

/**
 * add sms platform
 */
const addSmsPlatform = ()=>{
	// add sms platform init
	addSmsPlatformRef.value.init();
}

// update sms platform ref
const updateSmsPlatformRef = ref()

/**
 * update sms platform
 */
const updateSmsPlatform = (smsPlatformId)=>{
	// no sms platform id
	if(!smsPlatformId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个短信平台。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个短信平台。', type: 'warning' })
			// return
			return
		}
		// set sms platform id
		smsPlatformId = grid.selects[0].smsPlatformId
	}
	// update sms platform init
	updateSmsPlatformRef.value.init(smsPlatformId);
}

/**
 * delete sms platform
 */
const deleteSmsPlatform = (smsPlatformId)=>{
	// defined sms platform ids
	let smsPlatformIds = []
	// no sms platform id
	if(!smsPlatformId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个短信平台。', type: 'warning' })
			// return
			return
		}
		// set sms platform id
		smsPlatformIds = grid.selects.map(select=>select.smsPlatformId)
	}else{
		// push sms platform id
		smsPlatformIds.push(smsPlatformId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete sms platform
		$deleteSmsPlatform(smsPlatformIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>