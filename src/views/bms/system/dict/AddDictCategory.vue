<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="plus">新增字典类型</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="dictCategoryForm" :model="dictCategory" label-width="100px">
					<!-- items -->
					<sw-form-item type="text" prop="dictCategoryId" v-model="dictCategory.dictCategoryId" label="字典类型编号" valid="r|english_number|l-le200" :valid-unique="{code:'dict_category.id.add', args:[]}"></sw-form-item>
					<sw-form-item type="text" prop="dictCategoryName" v-model="dictCategory.dictCategoryName" label="字典类型名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="dictCategory.sort" label="排序码" valid="r|integer"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="addDictCategory" permission="bms:system:dict:dict_category:add">保存 (S)</sw-button>
						<sw-button type="warning" :underline="false" icon="refresh-left" @click="reset">重置 (R)</sw-button>
					</sw-form-item>
				</sw-form>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get dict category data, add dict category
import { $getDictCategoryData, $addDictCategory } from '@/assets/config/api';

// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

// import key
import key from 'keymaster';

// import tool
import * as tool from '@/assets/utils/tool';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// const state
const state = reactive({
	// dict category
	dictCategory: { info:{} }
});

// to refs
const { dictCategory } = toRefs(state);

// ref
const dictCategoryForm = ref()

/**
 * reset
 */
const reset = () => {
	// get dict category data
	getDictCategoryData();
}

/**
 * get dict category data
 */
const getDictCategoryData = () => {
	// get dict category data
	$getDictCategoryData({dictCategoryId:null}).then(handler=>{
		// set dict category
		state.dictCategory = handler.data.data.dictCategory;
	});
}

/**
 * add dict category
 */
const addDictCategory = () => {
	// valid
	dictCategoryForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定新增字典类型信息？', '提示').then(()=>{
				// add dict category
				$addDictCategory(state.dictCategory).then(handler=>{
					// success
					if(handler.data.result){
						// message
						ElMessage.success(handler.data.message);
						// reset
						reset();
					}
				});
			}).catch(()=>{});
		}
	});
}

// reset
reset();

// hotkey
key('alt+s', ()=>{ addDictCategory();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>