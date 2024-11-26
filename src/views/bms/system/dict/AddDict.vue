<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="plus">新增字典</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="dictForm" :model="dict">
					<!-- items -->
					<sw-form-item type="text" prop="dictId" v-model="dict.dictId" label="字典编号" valid="r|english_number|l-le200" :valid-unique="{code:'dict.id.add', args:[dictCategoryId]}"></sw-form-item>
					<sw-form-item type="text" prop="dictKey" v-model="dict.dictKey" label="字典键" valid="r|english_number|l-le200" :valid-unique="{code:'dict.key.add', args:[dictCategoryId]}"></sw-form-item>
					<sw-form-item type="text" prop="dictValue" v-model="dict.dictValue" label="字典值" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="dict.sort" label="排序码" valid="r|integer"></sw-form-item>
					<!-- operation -->
					<sw-form-item>
						<sw-button type="success" :underline="false" icon="circle-check" @click="addDict" permission="bms:system:dict:dict:add">保存 (S)</sw-button>
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

// import requests: get dict data, add dict
import { $getDictData, $addDict } from '@/assets/config/api';

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
	// dict
	dict: { info:{} }
});

// to refs
const { dict } = toRefs(state);

// ref
const dictForm = ref()

// props
const props = defineProps(['dictCategoryId'])

/**
 * reset
 */
const reset = () => {
	// get dict data
	getDictData();
}

/**
 * get dict data
 */
const getDictData = () => {
	// get dict data
	$getDictData({dictCategoryId:props.dictCategoryId, dictId:null}).then(handler=>{
		// set dict
		state.dict = handler.data.data.dict;
	});
}

/**
 * add dict
 */
const addDict = () => {
	// valid
	dictForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定新增字典信息？', '提示').then(()=>{
				// add dict
				$addDict(state.dict).then(handler=>{
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
key('alt+s', ()=>{ addDict();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>