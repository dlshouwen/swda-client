<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- row -->
		<el-row style="flex:1;">
			<!-- dict type container -->
			<el-col :span="12" style="display:flex;flex-direction:column;">
				<!-- search panel -->
				<sw-panel icon="search">
					<!-- title -->
					<template #title>查询面板</template>
					<!-- operation -->
					<template #operation>
						<sw-button type="warning" icon="redo" @click="reset('dictType')">重置</sw-button>
						<sw-button type="primary" icon="search" @click="load('dictType')">查询</sw-button>
					</template>
					<!-- form -->
					<el-form :model="dictTypeSearch" :inline="true">
						<sw-input v-model="dictTypeSearch.lk_dict_type" label="字典类型" clearable style="width:130px" />
					</el-form>
				</sw-panel>
				<!-- data panel -->
				<sw-panel icon="detail" flex>
					<!-- title -->
					<template #title>字典类型列表</template>
					<!-- operation -->
					<template #operation>
						<sw-button authority="bms:system:dict_type:add" type="primary" icon="plus" @click="addDictType">新增</sw-button>
						<sw-button authority="bms:system:dict_type:update" type="warning" icon="edit" @click="updateDictType()">编辑</sw-button>
						<sw-button authority="bms:system:dict_type:delete" type="danger" icon="delete" @click="deleteDictType()">删除</sw-button>
					</template>
					<!-- grid -->
					<sw-table ref="dictTypeGridRef" url="/bms/system/dict_type/page" row-key="dictTypeId" :search="dictTypeSearch" @currentChange="dictTypeCurrentChange">
						<sw-table-column type="selection" width="55" element />
						<sw-table-column label="操作" width="210" element>
							<template #default="scope">
								<sw-link authority="bms:system:dict_type:update" type="warning" divider @click="updateDictType(scope.row.dictTypeId)">编辑</sw-link>
								<sw-link authority="bms:system:dict_type:delete" type="danger" @click="deleteDictType(scope.row.dictTypeId)">删除</sw-link>
							</template>
						</sw-table-column>
						<sw-table-column data-type="string" prop="dictTypeName" label="字典类型名称" width="120" fast="lk" />
						<sw-table-column data-type="string" prop="dictType" label="字典类型" width="120" fast="lk" />
						<sw-table-column data-type="number" prop="sort" label="排序码" width="120" fast="eq" />
					</sw-table>
				</sw-panel>
			</el-col>
			<el-col :span="12" style="display:flex;flex-direction:column;">
				<!-- search panel -->
				<sw-panel icon="search">
					<!-- title -->
					<template #title>查询面板</template>
					<!-- operation -->
					<template #operation>
						<sw-button type="warning" icon="redo" @click="reset('dict')">重置</sw-button>
						<sw-button type="primary" icon="search" @click="load('dict')">查询</sw-button>
					</template>
					<!-- form -->
					<el-form :model="dictSearch" :inline="true">
						<sw-input v-model="dictSearch.lk_dict_name" label="字典名称" clearable style="width:130px" />
					</el-form>
				</sw-panel>
				<!-- data panel -->
				<sw-panel icon="detail" flex>
					<!-- title -->
					<template #title>字典列表</template>
					<!-- operation -->
					<template #operation>
						<sw-button authority="bms:system:dict:add" type="primary" icon="plus" @click="addDict">新增</sw-button>
						<sw-button authority="bms:system:dict:update" type="warning" icon="edit" @click="updateDict()">编辑</sw-button>
						<sw-button authority="bms:system:dict:delete" type="danger" icon="delete" @click="deleteDict()">删除</sw-button>
					</template>
					<!-- grid -->
					<sw-table ref="dictGridRef" :url="`/bms/system/dict/page/${currentDictType?currentDictType.dictType:'-'}`" row-key="dictId" :search="dictSearch">
						<sw-table-column type="selection" width="55" element />
						<sw-table-column label="操作" width="210" element>
							<template #default="scope">
								<sw-link authority="bms:system:dict:update" type="warning" divider @click="updateDict(scope.row.dictId)">编辑</sw-link>
								<sw-link authority="bms:system:dict:delete" type="danger" @click="deleteDict(scope.row.dictId)">删除</sw-link>
							</template>
						</sw-table-column>
						<sw-table-column data-type="string" prop="dictName" label="字典名称" width="120" fast="lk" />
						<sw-table-column data-type="string" prop="dictLabel" label="字典标签" width="120" fast="lk" />
						<sw-table-column data-type="string" prop="dictValue" label="字典值" width="120" fast="lk" />
						<sw-table-column data-type="string" prop="dictStyle" label="字典样式" width="120" fast="lk"	>
							<template #default="scope">
								<el-tag :type="scope.row.dictStyle">{{scope.row.dictStyle}}</el-tag>
							</template>
						</sw-table-column>
						<sw-table-column data-type="number" prop="sort" label="排序码" width="120" fast="eq" />
					</sw-table>
				</sw-panel>
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
import { ref, reactive, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import apis
import { $deleteDictType } from '@/api/bms/system/dictType' 
import { $deleteDict } from '@/api/bms/system/dict' 

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
const dictTypeGridRef = ref()
const addDictTypeRef = ref()
const updateDictTypeRef = ref()

// dict ref
const dictGridRef = ref()
const addDictRef = ref()
const updateDictRef = ref()

// search
const dictTypeSearch = ref({})
const dictSearch = ref({})

// const current dict type
const currentDictType = ref()

/**
 * reset
 */
const reset = (type)=>{
	// reset
	if(type==='dictType') dictTypeSearch.value = {}
	if(type==='dict') dictSearch.value = {}
}

/**
 * load
 */
const load = (type)=>{
	// dict type
	if(type==='dictType'){
		// dict type load
		dictTypeGridRef.value.load()
	}
	// dict
	if(type==='dict'){
		// is has current dict type
		if(!currentDictType.value){
			// warning
			ElMessage.warning('请选择一个字典类型。')
			// return
			return
		}
		// dict load
		dictGridRef.value.load()
	}
}

/**
 * dict type current change
 * @params dictType
 */
const dictTypeCurrentChange = (dictType)=>{
	// set current dict type
	currentDictType.value = dictType
	// load
	nextTick(()=>{
		load('dict')
	})
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
		// get selects
		let selects = dictTypeGridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个字典类型。')
			// return
			return
		}
		// select more then 1
		if(selects.length>1){
			// warning
			ElMessage.warning('只能选择一个字典类型。')
			// return
			return
		}
		// set dict type id
		dictTypeId = selects[0].dictTypeId
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
		ElMessage.warning('请选择一个字典类型。')
		// return
		return
	}
	// no dict id
	if(!dictId){
		// get selects
		let selects = dictGridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个字典。')
			// return
			return
		}
		// select more then 1
		if(selects.length>1){
			// warning
			ElMessage.warning('只能选择一个字典。')
			// return
			return
		}
		// set dict id
		dictId = selects[0].dictId
	}
	// update dict type
	updateDictRef.value.init(currentDictType.value.dictType, dictId);
}

/**
 * delete dict type
 */
const deleteDictType = async (dictTypeId)=>{
	// defined dict type ids
	let dictTypeIds = []
	// no dict type id
	if(!dictTypeId){
		// get selects
		let selects = dictTypeGridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个字典类型。')
			// return
			return
		}
		// set dict type id
		dictTypeIds = selects.map(select=>select.dictTypeId)
	}else{
		// push dict type id
		dictTypeIds.push(dictTypeId)
	}
	// confirm
	await ElMessageBox.confirm('确认删除吗？', '提示', { type: 'warning' })
	// delete dict type
	await $deleteDictType(dictTypeIds)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: () => { load('dictType') } })
}

/**
 * delete dict
 */
const deleteDict = async (dictId)=>{
	// defined dict ids
	let dictIds = []
	// no dict id
	if(!dictId){
		// get selects
		let selects = dictGridRef.value.getSelectionRows()
		// no select
		if(selects==null||selects.length<=0){
			// warning
			ElMessage.warning('至少选择一个字典。')
			// return
			return
		}
		// set dict id
		dictIds = selects.map(select=>select.dictId)
	}else{
		// push dict id
		dictIds.push(dictId)
	}
	// confirm
	await ElMessageBox.confirm('确认删除吗？', '提示', { type: 'warning' })
	// delete dict
	await $deleteDict(dictIds)
	// message
	ElMessage.success({ message: '操作成功', duration: 500, onClose: () => { load('dict') } })
}
</script>