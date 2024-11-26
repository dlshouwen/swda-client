<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="edit">编辑字典类型</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="dictCategoryForm" :model="dictCategory" label-width="100px">
					<!-- items -->
					<sw-form-item type="text" prop="dictCategoryId" v-model="dictCategory.dictCategoryId" label="字典类型编号" disabled></sw-form-item>
					<sw-form-item type="text" prop="dictCategoryName" v-model="dictCategory.dictCategoryName" label="字典类型名称" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="dictCategory.sort" label="排序码" valid="r|integer"></sw-form-item>
					<!-- operation -->
					<sw-form-item style="margin-bottom:0;">
						<sw-button type="success" :underline="false" icon="circle-check" @click="updateDictCategory" permission="bms:system:dict:dict_category:update">保存 (S)</sw-button>
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

// import requests: get dict category data, update dict category
import { $getDictCategoryData, $updateDictCategory } from '@/assets/config/api';

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

// props
const props = defineProps(['dictCategoryId'])

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
	$getDictCategoryData({dictCategoryId:props.dictCategoryId}).then(handler=>{
		// set dict category
		state.dictCategory = handler.data.data.dictCategory;
	});
}

/**
 * update dict category
 */
const updateDictCategory = () => {
	// valid
	dictCategoryForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定更新字典类型信息？', '提示').then(()=>{
				// update dict category
				$updateDictCategory(state.dictCategory).then(handler=>{
					// success
					if(handler.data.result){
						// message
						ElMessage.success(handler.data.message);
					}
				});
			}).catch(()=>{});
		}
	});
}

// watch
watch(()=>props.dictCategoryId, ()=>{ reset() }, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ updateDictCategory();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>
