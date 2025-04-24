<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- grid container -->
		<el-card class="panel panel-auto">
			<!-- operate -->
			<el-row class="panel-operate">
				<el-col class="left" :span="12">
					<el-button type="default" @click="getOrganList"><sw-icon icon="sync"></sw-icon>重新加载</el-button>
				</el-col>
				<el-col class="right" :span="12">
					<el-button type="primary" @click="addOrgan"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateOrgan()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteOrgan()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" row-key="organId" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column prop="organName" label="机构名称" sortable show-overflow-tooltip width="200" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateOrgan(scope.row.organId)">编辑</el-button>
							<el-button link type="danger" @click="deleteOrgan(scope.row.organId, scope.row.preOrganId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="机构编码" prop="organCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="机构名称" prop="organName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="联系人" prop="contact" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="联系电话" prop="contactPhone" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="经度" prop="longitude" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="纬度" prop="latitude" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="所属省" prop="provinceName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="所属市" prop="cityName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="所属区" prop="countyName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="详细地址" prop="address" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="排序" prop="sort" width="90" align="center" sortable show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" width="180" align="left" header-align="center" sortable show-overflow-tooltip />
					<el-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
		</el-card>
	</el-container>
	<!-- add organ -->
	<AddOrgan ref="addOrganRef" @callback="getOrganList"></AddOrgan>
	<!-- update organ -->
	<UpdateOrgan ref="updateOrganRef" @callback="getOrganList"></UpdateOrgan>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddOrgan from './AddOrgan.vue'
import UpdateOrgan from './UpdateOrgan.vue'

// import apis
import { $getOrganList, $deleteOrgan } from '@/api/bms/permission/organ' 

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
	// get organ list
	getOrganList()
	// resize height
	grid.option.height = gridContainerRef.value.$el.clientHeight+ 'px'
	// resize
    window.onresize = () => {
		// resize height
        grid.option.height = gridContainerRef.value.$el.clientHeight + 'px'
    }
})

/**
 * get organ list
 */
const getOrganList = ()=>{
	// get organ list
	$getOrganList().then(handler=>{
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

// add organ ref
const addOrganRef = ref()

/**
 * add organ
 */
const addOrgan = ()=>{
	// add organ init
	addOrganRef.value.init();
}

// update organ ref
const updateOrganRef = ref()

/**
 * update organ
 */
const updateOrgan = (organId)=>{
	// no organ id
	if(!organId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个机构。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个机构。', type: 'warning' })
			// return
			return
		}
		// set organ id
		organId = grid.selects[0].organId
	}
	// update organ init
	updateOrganRef.value.init(organId);
}

/**
 * delete organ
* @param organId
 */
const deleteOrgan = (organId)=>{
	// no organ id
	if(!organId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个机构。', type: 'warning' })
			// return
			return
		}
		// no more than 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个机构。', type: 'warning' })
			// return
			return
		}
		// set organ id
		organId = grid.selects[0].organId
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete organ
		$deleteOrgan(organId).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// update organ children
				getOrganList()
			}})
		})
	})
}
</script>