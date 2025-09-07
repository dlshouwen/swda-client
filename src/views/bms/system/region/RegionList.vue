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
				<sw-button type="primary" icon="search" @click="test('redis')">测试 Redis 缓存</sw-button>
			</template>
			<!-- form -->
			<el-form :model="search" :inline="true">
				<sw-input v-model="search.eq_regionId" label="区域编号" clearable style="width:130px" />
				<sw-input v-model="search.lk_regionName" label="区域名称" clearable style="width:130px" />
				<sw-select v-model="search.eq_isOpen" label="启用" dict="zero_one" clearable style="width:100px" />
			</el-form>
		</sw-panel>
		<!-- data panel -->
		<sw-panel icon="location" title="任务列表" flex>
			<!-- operation -->
			<template #operation>
				<sw-button authority="bms:system:region:add" type="primary" icon="plus" label="新增" @click="addRegion" />
				<sw-button authority="bms:system:region:update" type="warning" icon="edit" label="编辑" @click="updateRegion()" />
				<sw-button authority="bms:system:region:delete" type="danger" icon="delete" label="删除" @click="deleteRegion()" />
			</template>
			<!-- grid -->
			<sw-table ref="gridRef" url="/bms/system/region/list" row-key="regionId" tree lazy :search="search" :tree-top-value="0">
				<sw-table-column type="selection" width="55" element />
				<sw-table-column prop="regionName" label="区域名称" />
				<sw-table-column label="操作" width="120" align="center">
					<template #default="scope">
						<el-button link type="warning" @click="updateRegion(scope.row.regionId)">编辑</el-button>
						<el-button link type="danger" @click="deleteRegion(scope.row.regionId, scope.row.preRegionId)">删除</el-button>
					</template>
				</sw-table-column>
				<sw-table-column label="编号" prop="regionId" width="120" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="全名" prop="regionFullName" width="120" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="拼音" prop="regionNamePinyin" width="90" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="全拼" prop="regionNameFullPinyin" width="90" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="邮政编码" prop="postalCode" width="120" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="排序" prop="sort" width="90" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="备注" prop="remark" width="180" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
			</sw-table>
		</sw-panel>
	</sw-container>
	<!-- add region -->
	<AddRegion ref="addRegionRef" @callback="updateRegionChildren"></AddRegion>
	<!-- update region -->
	<UpdateRegion ref="updateRegionRef" @callback="updateRegionChildren"></UpdateRegion>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddRegion from './AddRegion.vue'
import UpdateRegion from './UpdateRegion.vue'

// import request
import request from '@/utils/request'

// import apis
import { $deleteRegion } from '@/api/bms/system/region'

// const grid ref
const gridRef = ref(null)

// const search
const search = ref({})

/**
 * test
 * @param type
 */
const test = async (type: string)=>{
	// get data
	let { data } = await request.post('/bms/system/region/test/'+type)
	// console
	console.log(data)
}

/**
 * reset
 */
const reset = ()=>{
	// reset
	search.value = {}
}

/**
 * load
 */
const load = ()=>{
	// load
	gridRef.value.load()
}

/**
 * update region children
 * @param regionId
 */
const updateRegionChildren = (regionId)=>{
	// update tree node
	gridRef.value.updateTreeNode(regionId)
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
const updateRegion = (regionId:number)=>{
	// no region id
	if(!regionId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个区域。')
			// return
			return
		}
		// select more then 1
		if(selects.length>1){
			// warning
			ElMessage.warning('只能选择一个区域。')
			// return
			return
		}
		// set region id
		regionId = selects[0].regionId
	}
	// update region init
	updateRegionRef.value.init(regionId);
}

/**
 * delete region
* @param regionId
* @param preRegionId
 */
const deleteRegion = async (regionId, preRegionId)=>{
	// no region id
	if(!regionId){
		// get selects
		let selects = gridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个区域。')
			// return
			return
		}
		// no more than 1
		if(selects.length>1){
			// warning
			ElMessage.warning('只能选择一个区域。')
			// return
			return
		}
		// set region id
		regionId = selects[0].regionId
	}
	// confirm
	await ElMessageBox.confirm('确认删除吗？', '提示', { type: 'warning' })
	// delete region
	await $deleteRegion(regionId)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: () => { updateRegionChildren(preRegionId) }})
}
</script>