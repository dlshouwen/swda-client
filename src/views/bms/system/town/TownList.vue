<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="所属区域">
					<el-cascader :props="selectRegionProps" placeholder="所属区域" clearable @change="selectRegionChange" style="width:200px" />
				</el-form-item>
				<el-form-item label="街道编号">
					<el-input v-model="grid.query.manualQueryParameters.eq_town_id" placeholder="请输入街道编号" clearable style="width:130px" />
				</el-form-item>
				<el-form-item label="街道名称">
					<el-input v-model="grid.query.manualQueryParameters.lk_townname" placeholder="请输入街道名称" clearable style="width:130px" />
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
					<el-button type="primary" @click="addTown"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updateTown()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deleteTown()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<sw-table ref="gridRef" url="/bms/system/town/page" row-key="townId" border stripe @selection-change="gridSelectionChange">
				<sw-table-column type="selection" align="center" width="55" />
				<sw-table-column label="操作" width="120" align="center">
					<template #default="scope">
						<sw-button link type="warning" @click="updateTown(scope.row.townId)">编辑</sw-button>
						<sw-button link type="danger" @click="deleteTown(scope.row.townId)">删除</sw-button>
					</template>
				</sw-table-column>
				<sw-table-column label="所属区域" align="center">
					<sw-table-column label="省" prop="provinceName" width="100" align="center" sortable show-overflow-tooltip />
					<sw-table-column label="市" prop="cityName" width="100" align="center" sortable show-overflow-tooltip />
					<sw-table-column label="区" prop="countyName" width="100" align="center" sortable show-overflow-tooltip />
				</sw-table-column>
				<sw-table-column label="基础信息" align="center">
					<sw-table-column label="街道编号" prop="townId" width="120" align="center" sortable show-overflow-tooltip />
					<sw-table-column label="街道名称" prop="townName" width="120" align="center" sortable show-overflow-tooltip />
					<sw-table-column label="街道全名" prop="townFullName" width="200" align="center" sortable show-overflow-tooltip />
				</sw-table-column>
				<sw-table-column label="街道名称拼音" prop="townNamePinyin" width="140" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="街道名称全拼" prop="townNameFullPinyin" width="140" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="邮政编码" prop="postalCode" width="120" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="排序" prop="sort" width="90" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="备注" prop="remark" width="120" align="center" sortable show-overflow-tooltip />
				<sw-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
			</sw-table>
		</el-card>
	</el-container>
	<!-- add town -->
	<AddTown ref="addTownRef" @callback="search"></AddTown>
	<!-- update town -->
	<UpdateTown ref="updateTownRef" @callback="search"></UpdateTown>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddTown from './AddTown.vue'
import UpdateTown from './UpdateTown.vue'

// import apis
import { $getTownPageResult, $deleteTown } from '@/api/bms/system/town' 
import { $getRegionList } from '@/api/bms/system/region' 

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
})

// const select region props
const selectRegionProps = {
	lazy: true,
	label: 'regionName',
	value: 'regionId',
	leaf: 'leaf',
	checkStrictly: true,
	lazyLoad(node, resolve) {
		// get region list
		$getRegionList(node.level==0?0:node.value).then(handler=>{
			handler.data.forEach(data=>{data.leaf=!data.hasChildren})
			// resolve
			resolve(handler.data)
		})
	}
}

/**
 * select region change
 */
const selectRegionChange = (value) => {
	// set query
	grid.query.manualQueryParameters.eq_province_id = value.length>0?value[0]:''
	grid.query.manualQueryParameters.eq_city_id = value.length>1?value[1]:''
	grid.query.manualQueryParameters.eq_county_id = value.length>2?value[2]:''
}

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
	// get town page result
	$getTownPageResult(grid.query).then(handler=>{
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

// add town ref
const addTownRef = ref()

/**
 * add town
 */
const addTown = ()=>{
	// add town init
	addTownRef.value.init();
}

// update town ref
const updateTownRef = ref()

/**
 * update town
 */
const updateTown = (townId)=>{
	// no town id
	if(!townId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个街道。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个街道。', type: 'warning' })
			// return
			return
		}
		// set town id
		townId = grid.selects[0].townId
	}
	// update town init
	updateTownRef.value.init(townId);
}

/**
 * delete town
 */
const deleteTown = (townId)=>{
	// defined town ids
	let townIds = []
	// no town id
	if(!townId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个街道。', type: 'warning' })
			// return
			return
		}
		// set town id
		townIds = grid.selects.map(select=>select.townId)
	}else{
		// push town id
		townIds.push(townId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete town
		$deleteTown(townIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>