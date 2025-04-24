<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- grid container -->
		<el-card class="panel panel-auto">
			<!-- operate -->
			<el-row class="panel-operate">
				<el-col class="left" :span="12">
					<el-button type="default" @click="updateRegionChildren(110000)"><sw-icon icon="sync"></sw-icon>重新加载</el-button>
				</el-col>
				<el-col class="right" :span="12">
					<el-button type="primary" @click="addRegion"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateRegion()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteRegion()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" row-key="regionId" :load="load" lazy border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column prop="regionName" label="区域名称" sortable show-overflow-tooltip width="200" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updateRegion(scope.row.regionId)">编辑</el-button>
							<el-button link type="danger" @click="deleteRegion(scope.row.regionId, scope.row.preRegionId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="regionId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="类型" prop="regionType" width="90" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.region_type[scope.row.regionType].style">{{appStore.dict.region_type[scope.row.regionType].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="全名" prop="regionFullName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="拼音" prop="regionNamePinyin" width="90" align="center" sortable show-overflow-tooltip />
					<el-table-column label="全拼" prop="regionNameFullPinyin" width="90" align="center" sortable show-overflow-tooltip />
					<el-table-column label="邮政编码" prop="postalCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="启用" prop="isOpen" width="90" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.zero_one[scope.row.isOpen].style">{{appStore.dict.zero_one[scope.row.isOpen].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="热门" prop="isHot" width="90" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.zero_one[scope.row.isOpen].style">{{appStore.dict.zero_one[scope.row.isOpen].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="sort" width="90" align="center" sortable show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" width="180" align="center" sortable show-overflow-tooltip />
					<el-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
		</el-card>
	</el-container>
	<!-- add region -->
	<AddRegion ref="addRegionRef" @callback="updateRegionChildren"></AddRegion>
	<!-- update region -->
	<UpdateRegion ref="updateRegionRef" @callback="updateRegionChildren"></UpdateRegion>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddRegion from './AddRegion.vue'
import UpdateRegion from './UpdateRegion.vue'

// import apis
import { $getRegionList, $deleteRegion } from '@/api/bms/system/region' 

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
	// init
	init()
	// resize height
	grid.option.height = gridContainerRef.value.$el.clientHeight+ 'px'
	// resize
    window.onresize = () => {
		// resize height
        grid.option.height = gridContainerRef.value.$el.clientHeight + 'px'
    }
})

/**
 * init
 */
const init = ()=>{
	// get region list
	$getRegionList(0).then(handler=>{
		// set datas
		grid.datas = handler.data
	})
}

/**
 * load
 */
const load = (row, node, resolve)=>{
	// get region list
	$getRegionList(row.regionId).then(handler=>{
		// resolve data
		resolve(handler.data)
	})
}

/**
 * update region children
 * @param regionId
 */
const updateRegionChildren = (regionId)=>{
	// get region list
	$getRegionList(regionId).then(handler=>{
		// update key children
		gridRef.value.updateKeyChildren(regionId, handler.data)
	})
}

/**
 * grid selection change
 */
const gridSelectionChange = (datas)=>{
	// set select
	grid.selects = datas
}

// add region ref
const addRegionRef = ref()

/**
 * add region
 */
const addRegion = ()=>{
	// add region init
	addRegionRef.value.init();
}

// update region ref
const updateRegionRef = ref()

/**
 * update region
 */
const updateRegion = (regionId)=>{
	// no region id
	if(!regionId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个用户。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个用户。', type: 'warning' })
			// return
			return
		}
		// set region id
		regionId = grid.selects[0].regionId
	}
	// update region init
	updateRegionRef.value.init(regionId);
}

/**
 * delete region
* @param regionId
* @param preRegionId
 */
const deleteRegion = (regionId, preRegionId)=>{
	// no region id
	if(!regionId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个区域。', type: 'warning' })
			// return
			return
		}
		// no more than 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个区域。', type: 'warning' })
			// return
			return
		}
		// set region id
		regionId = grid.selects[0].regionId
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete region
		$deleteRegion(regionId).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// update region children
				updateRegionChildren(preRegionId)
			}})
		})
	})
}
</script>