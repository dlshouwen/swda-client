<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- row -->
		<el-row style="flex:1;">
			<!-- dict type container -->
			<el-col :span="12" style="display:flex;flex-direction:column;">
				<!-- search container -->
				<el-card class="panel">
					<el-form :model="dictTypeGrid.query.manualQueryParameters" :inline="true">
						<el-form-item label="字典类型">
							<el-input v-model="dictTypeGrid.query.manualQueryParameters.lk_dict_type" placeholder="请输入字典类型" clearable style="width:130px" />
						</el-form-item>
						<el-form-item>
							<el-button type="warning" @click="reset('dictType')"><sw-icon icon="redo"></sw-icon>重置</el-button>
							<el-button type="primary" @click="search('dictType')"><sw-icon icon="search"></sw-icon>查询</el-button>
						</el-form-item>
					</el-form>
				</el-card>
				<!-- grid container -->
				<el-card class="panel panel-auto">
					<!-- operate -->
					<el-row class="panel-operate">
						<el-col class="left" :span="6">
							<el-button type="default" @click="search('dictType')"><sw-icon icon="sync"></sw-icon>刷新</el-button>
						</el-col>
						<el-col class="right" :span="18">
							<el-button type="primary" @click="addDictType"><sw-icon icon="plus"></sw-icon>新增</el-button>
							<el-button type="warning" @click="updateDictType()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
							<el-button type="danger" @click="deleteDictType()"><sw-icon icon="delete"></sw-icon>删除</el-button>
						</el-col>
					</el-row>
					<!-- grid -->
					<el-row ref="dictTypeGridContainerRef" class="panel-grid">
						<el-table ref="dictTypeGridRef" :data="dictTypeGrid.datas" highlight-current-row border stripe :height="dictTypeGrid.option.height" @current-change="dictTypeCurrentChange" @selection-change="dictTypeGridSelectionChange">
							<el-table-column type="selection" align="center" width="55" />
							<el-table-column label="操作" width="120" align="center">
								<template #default="scope">
									<el-button link type="warning" @click="updateDictType(scope.row.dictTypeId)">编辑</el-button>
									<el-button link type="danger" @click="deleteDictType(scope.row.dictTypeId)">删除</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="dictTypeName" label="名称" align="center" sortable show-overflow-tooltip width="120" />
							<el-table-column prop="dictType" label="类型" align="center" sortable show-overflow-tooltip width="160" />
							<el-table-column prop="sort" label="排序" align="center" sortable show-overflow-tooltip width="80" />
						</el-table>
					</el-row>
					<!-- pagination -->
					<el-row class="panel-pagination">
						<el-pagination v-model:current-page="dictTypeGrid.query.page.current" v-model:page-size="dictTypeGrid.query.page.size" :page-sizes="dictTypeGrid.option.sizes"
							:layout="dictTypeGrid.option.layout" :total="dictTypeGrid.total" @size-change="search('dictType')" @current-change="search(dictType)" />
					</el-row>
				</el-card>
			</el-col>
			<el-col :span="12" style="display:flex;flex-direction:column;">
				<!-- search container -->
				<el-card class="panel">
					<el-form :model="dictGrid.query.manualQueryParameters" :inline="true">
						<el-form-item label="字典名称">
							<el-input v-model="dictGrid.query.manualQueryParameters.lk_dict_name" placeholder="请输入字典名称" clearable style="width:130px" />
						</el-form-item>
						<el-form-item>
							<el-button type="warning" @click="reset('dict')"><sw-icon icon="redo"></sw-icon>重置</el-button>
							<el-button type="primary" @click="search('dict')"><sw-icon icon="search"></sw-icon>查询</el-button>
						</el-form-item>
					</el-form>
				</el-card>
				<!-- grid container -->
				<el-card class="panel panel-auto">
					<!-- operate -->
					<el-row class="panel-operate">
						<el-col class="left" :span="6">
							<el-button type="default" @click="search('dict')"><sw-icon icon="sync"></sw-icon>刷新</el-button>
						</el-col>
						<el-col class="right" :span="18">
							<el-button type="primary" @click="addDict"><sw-icon icon="plus"></sw-icon>新增</el-button>
							<el-button type="warning" @click="updateDict()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
							<el-button type="danger" @click="deleteDict()"><sw-icon icon="delete"></sw-icon>删除</el-button>
						</el-col>
					</el-row>
					<!-- grid -->
					<el-row ref="dictGridContainerRef" class="panel-grid">
						<el-table ref="dictGridRef" :data="dictGrid.datas" border stripe :height="dictGrid.option.height" @selection-change="dictGridSelectionChange">
							<el-table-column type="selection" align="center" width="55" />
							<el-table-column label="操作" width="120" align="center">
								<template #default="scope">
									<el-button link type="warning" @click="updateDict(scope.row.dictId)">编辑</el-button>
									<el-button link type="danger" @click="deleteDict(scope.row.dictId)">删除</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="dictName" label="名称" align="center" sortable show-overflow-tooltip width="120" />
							<el-table-column prop="dictLabel" label="标签" align="center" sortable show-overflow-tooltip width="120" />
							<el-table-column prop="dictValue" label="值" align="center" sortable show-overflow-tooltip width="100" />
							<el-table-column prop="dictStyle" label="样式" align="center" sortable show-overflow-tooltip width="100">
								<template #default="scope">
									<el-tag :type="scope.row.dictStyle">{{scope.row.dictStyle}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="sort" label="排序" align="center" sortable show-overflow-tooltip width="80" />
						</el-table>
					</el-row>
					<!-- pagination -->
					<el-row class="panel-pagination">
						<el-pagination v-model:current-page="dictGrid.query.page.current" v-model:page-size="dictGrid.query.page.size" :page-sizes="dictGrid.option.sizes"
							:layout="dictGrid.option.layout" :total="dictGrid.total" @size-change="search('dict')" @current-change="search(dict)" />
					</el-row>
				</el-card>
			</el-col>
		</el-row>
	</el-container>
	<!-- add dict type -->
	<AddDictType ref="addDictTypeRef" @callback="search('dictType')"></AddDictType>
	<!-- update dict type -->
	<UpdateDictType ref="updateDictTypeRef" @callback="search('dictType')"></UpdateDictType>
	<!-- add dict -->
	<AddDict ref="addDictRef" @callback="search('dict')"></AddDict>
	<!-- update dict -->
	<AddDict ref="updateDictRef" @callback="search('dict')"></AddDict>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import apis
import { $getDictTypePageResult, $deleteDictType } from '@/api/bms/system/dictType' 
import { $getDictPageResult, $deleteDict } from '@/api/bms/system/dict' 

// import stores
import { useAppStore } from '@/stores/app'

// import components
import AddDictType from './AddDictType.vue'
import UpdateDictType from './UpdateDictType.vue'
import AddDict from './AddDict.vue'
import UpdateDict from './UpdateDict.vue'

// get stores
const appStore = useAppStore()

// dict type ref
const dictTypeGridContainerRef = ref(null)
const dictTypeGridRef = ref(null)
const addDictTypeRef = ref()
const updateDictTypeRef = ref()

// dict ref
const dictGridContainerRef = ref(null)
const dictGridRef = ref(null)
const addDictRef = ref()
const updateDictRef = ref()

// const dict type grid
const dictTypeGrid = reactive({
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

// const dict grid
const dictGrid = reactive({
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
	search('dictType')
	// resize height
	dictTypeGrid.option.height = dictTypeGridContainerRef.value.$el.clientHeight+ 'px'
	dictGrid.option.height = dictGridContainerRef.value.$el.clientHeight+ 'px'
	// resize
    window.onresize = () => {
		// resize height
        dictTypeGrid.option.height = dictTypeGridContainerRef.value.$el.clientHeight+ 'px'
		dictGrid.option.height = dictGridContainerRef.value.$el.clientHeight+ 'px'
    }
})

/**
 * reset
 */
const reset = (type)=>{
	// reset
	if(type==='dictType') dictTypeGrid.query.manualQueryParameters = {}
	if(type==='dict') dictGrid.query.manualQueryParameters = {}
}

/**
 * search
 */
const search = (type)=>{
	// dict type
	if(type==='dictType'){
		// get dict type page result
		$getDictTypePageResult(dictTypeGrid.query).then(handler=>{
			// set total
			dictTypeGrid.total = handler.data.total
			// set datas
			dictTypeGrid.datas = handler.data.datas
		})
	}
	// dict
	if(type==='dict'){
		// is has current dict type
		if(!currentDictType.value){
			// warning
			ElMessage.warning('请选择一个字典类型')
			// set total
			dictGrid.total = 0
			// set datas
			dictGrid.datas = []
			// return
			return
		}
		// get dict page result
		$getDictPageResult(currentDictType.value.dictType, dictGrid.query).then(handler=>{
			// set total
			dictGrid.total = handler.data.total
			// set datas
			dictGrid.datas = handler.data.datas
		})
	}
}

// const current dict type
const currentDictType = ref()

/**
 * dict type current change
 * @params dictType
 */
const dictTypeCurrentChange = (dictType)=>{
	// set current dict type
	currentDictType.value = dictType
	// search
	search('dict')
}

/**
 * dict type grid selection change
 */
const dictTypeGridSelectionChange = (datas)=>{
	// set select
	dictTypeGrid.selects = datas
}

/**
 * dict grid selection change
 */
const dictGridSelectionChange = (datas)=>{
	// set select
	dictGrid.selects = datas
}

/**
 * add dict type
 */
const addDictType = ()=>{
	// add dict type init
	addDictTypeRef.value.init();
}

/**
 * add dict
 */
const addDict = ()=>{
	// is has current dict type
	if(!currentDictType.value){
		// warning
		ElMessage.warning('请选择一个字典类型')
		// return
		return
	}
	// add dict init
	addDictRef.value.init(currentDictType.value.dictType);
}

/**
 * update dict type
 */
const updateDictType = (dictTypeId)=>{
	// no dict type id
	if(!dictTypeId){
		// no select
		if(dictTypeGrid.selects==null||dictTypeGrid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个字典类型。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(dictTypeGrid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个字典类型。', type: 'warning' })
			// return
			return
		}
		// set dict type id
		dictTypeId = dictTypeGrid.selects[0].dictTypeId
	}
	// update dict type init
	updateDictTypeRef.value.init(dictTypeId);
}

/**
 * update dict
 */
const updateDict = (dictId)=>{
	// is has current dict type
	if(!currentDictType.value){
		// warning
		ElMessage.warning('请选择一个字典类型')
		// return
		return
	}
	// no dict id
	if(!dictId){
		// no select
		if(dictGrid.selects==null||dictGrid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个字典类型。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(dictGrid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个字典类型。', type: 'warning' })
			// return
			return
		}
		// set dict id
		dictId = dictGrid.selects[0].dictId
	}
	// update dict type
	updateDictRef.value.init(currentDictType.value.dictType, dictId);
}

/**
 * delete dict type
 */
const deleteDictType = (dictTypeId)=>{
	// defined dict type ids
	let dictTypeIds = []
	// no dict type id
	if(!dictTypeId){
		// no select
		if(dictTypeGrid.selects==null||dictTypeGrid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个字典类型。', type: 'warning' })
			// return
			return
		}
		// set dict type id
		dictTypeIds = dictTypeGrid.selects.map(select=>select.dictTypeId)
	}else{
		// push dict type id
		dictTypeIds.push(dictTypeId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete dict type
		$deleteDictType(dictTypeIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search('dictType')
			}})
		})
	})
}

/**
 * delete dict
 */
const deleteDict = (dictId)=>{
	// defined dict ids
	let dictIds = []
	// no dict id
	if(!dictId){
		// no select
		if(dictGrid.selects==null||dictGrid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个字典。', type: 'warning' })
			// return
			return
		}
		// set dict id
		dictIds = dictGrid.selects.map(select=>select.dictId)
	}else{
		// push dict id
		dictIds.push(dictId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete dict
		$deleteDict(dictIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search('dict')
			}})
		})
	})
}
</script>