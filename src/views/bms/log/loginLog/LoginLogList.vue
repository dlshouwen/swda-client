<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="登录类型">
					<el-select v-model="grid.query.manualQueryParameters.eq_login_type" clearable placeholder="登录类型" style="width:100px">
						<el-option v-for="dict in appStore.dict.login_type.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="登录状态">
					<el-select v-model="grid.query.manualQueryParameters.eq_login_status" clearable placeholder="登录状态" style="width:100px">
						<el-option v-for="dict in appStore.dict.login_status.datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="登录时间">
					<el-date-picker v-model="loginTimeRange" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="到" start-placeholder="开始时间" end-placeholder="结束时间" />
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
					<el-button type="info" @click="viewLoginLog()"><sw-icon icon="file-text"></sw-icon>查看</el-button>
					<el-button type="danger" @click="deleteLoginLog()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="info" @click="viewLoginLog(scope.row.loginLogId)">查看</el-button>
							<el-button link type="danger" @click="deleteLoginLog(scope.row.loginLogId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="loginLogId" width="80" align="center" sortable show-overflow-tooltip />
					<el-table-column label="IP" prop="ip" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="类型" prop="loginType" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.login_type[scope.row.loginType].style">{{appStore.dict.login_type[scope.row.loginType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="状态" prop="loginStatus" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.login_status[scope.row.loginStatus].style">{{appStore.dict.login_status[scope.row.loginStatus].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="登录时间" prop="loginTime" width="180" align="center" sortable show-overflow-tooltip />
					<el-table-column label="消息" prop="loginMessage" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="用户" prop="realName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="机构" prop="organName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="登出" prop="isLogout" width="80" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.zero_one[scope.row.isLogout].style">{{appStore.dict.zero_one[scope.row.isLogout].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="登出状态" prop="logoutType" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag v-if="scope.row.logoutType!==null" :type="appStore.dict.logout_type[scope.row.logoutType].style">{{appStore.dict.logout_type[scope.row.logoutType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="登出时间" prop="logoutTime" width="180" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
			<!-- pagination -->
			<el-row class="panel-pagination">
				<el-pagination v-model:current-page="grid.query.page.current" v-model:page-size="grid.query.page.size" :page-sizes="grid.option.sizes"
					:layout="grid.option.layout" :total="grid.total" @size-change="search" @current-change="search" />
			</el-row>
		</el-card>
	</el-container>
	<!-- view login log -->
	<ViewLoginLog ref="viewLoginLogRef"></ViewLoginLog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, watch } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import ViewLoginLog from './ViewLoginLog.vue'

// import apis
import { $getLoginLogPageResult, $deleteLoginLog } from '@/api/bms/log/loginLog' 

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

// const login time range
const loginTimeRange = ref()

// watch login time range
watch(loginTimeRange, async ()=>{
	grid.query.manualQueryParameters.ge_login_time = loginTimeRange.value[0]
	grid.query.manualQueryParameters.le_login_time = loginTimeRange.value[1]
	console.log(grid.query.manualQueryParameters)
})

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
	// get login log page result
	$getLoginLogPageResult(grid.query).then(handler=>{
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

// view login log ref
const viewLoginLogRef = ref()

/**
 * view login log
 */
const viewLoginLog = (loginLogId)=>{
	// no login log id
	if(!loginLogId){
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
		// set login log id
		loginLogId = grid.selects[0].loginLogId
	}
	// view login log init
	viewLoginLogRef.value.init(loginLogId);
}

/**
 * delete login log
 */
const deleteLoginLog = (loginLogId)=>{
	// defined login log ids
	let loginLogIds = []
	// no login log id
	if(!loginLogId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个邮件平台。', type: 'warning' })
			// return
			return
		}
		// set login log id
		loginLogIds = grid.selects.map(select=>select.loginLogId)
	}else{
		// push login log id
		loginLogIds.push(loginLogId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete login log
		$deleteLoginLog(loginLogIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>