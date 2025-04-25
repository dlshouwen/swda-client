<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="邮件平台类型">
					<el-select v-model="grid.query.manualQueryParameters.eq_email_platform_type" clearable placeholder="平台类型" style="width:200px">
						<el-option v-for="dict in appStore.dict.email_platform_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
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
					<el-button type="primary" @click="addEmailPlatform"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateEmailPlatform()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteEmailPlatform()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateEmailPlatform(scope.row.emailPlatformId)">编辑</el-button>
							<el-button link type="danger" @click="deleteEmailPlatform(scope.row.emailPlatformId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="emailPlatformId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="编码" prop="emailPlatformCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="名称" prop="emailPlatformName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="平台类型" prop="emailPlatformType" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.email_platform_type[scope.row.emailPlatformType].style">{{appStore.dict.email_platform_type[scope.row.emailPlatformType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" align="center" sortable show-overflow-tooltip width="120" >
						<template #default="scope">
							<el-tag :type="appStore.dict.open_close[scope.row.status].style">{{appStore.dict.open_close[scope.row.status].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="分组" prop="groupName" width="120" align="center" sortable show-overflow-tooltip />
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
	<!-- add email platform -->
	<AddEmailPlatform ref="addEmailPlatformRef" @callback="search"></AddEmailPlatform>
	<!-- update email platform -->
	<UpdateEmailPlatform ref="updateEmailPlatformRef" @callback="search"></UpdateEmailPlatform>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddEmailPlatform from './AddEmailPlatform.vue'
import UpdateEmailPlatform from './UpdateEmailPlatform.vue'

// import apis
import { $getEmailPlatformPageResult, $deleteEmailPlatform } from '@/api/bms/platform/emailPlatform' 

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
	// get email platform page result
	$getEmailPlatformPageResult(grid.query).then(handler=>{
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

// add email platform ref
const addEmailPlatformRef = ref()

/**
 * add email platform
 */
const addEmailPlatform = ()=>{
	// add email platform init
	addEmailPlatformRef.value.init();
}

// update email platform ref
const updateEmailPlatformRef = ref()

/**
 * update email platform
 */
const updateEmailPlatform = (emailPlatformId)=>{
	// no email platform id
	if(!emailPlatformId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// set email platform id
		emailPlatformId = grid.selects[0].emailPlatformId
	}
	// update email platform init
	updateEmailPlatformRef.value.init(emailPlatformId);
}

/**
 * delete email platform
 */
const deleteEmailPlatform = (emailPlatformId)=>{
	// defined email platform ids
	let emailPlatformIds = []
	// no email platform id
	if(!emailPlatformId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// set email platform id
		emailPlatformIds = grid.selects.map(select=>select.emailPlatformId)
	}else{
		// push email platform id
		emailPlatformIds.push(emailPlatformId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete email platform
		$deleteEmailPlatform(emailPlatformIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>