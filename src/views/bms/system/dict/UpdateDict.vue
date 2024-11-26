<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel header -->
			<div class="panel-header">
				<!-- panel title -->
				<div class="panel-title">
					<el-link icon="edit">编辑字典</el-link>
				</div>
			</div>
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<sw-form ref="dictForm" :model="dict">
					<!-- items -->
					<sw-form-item type="text" prop="dictId" v-model="dict.dictId" label="字典编号" disabled></sw-form-item>
					<sw-form-item type="text" prop="dictKey" v-model="dict.dictKey" label="字典键" valid="r|english_number|l-le200" :valid-unique="{code:'dict.key.update', args:[dictId, dictCategoryId]}"></sw-form-item>
					<sw-form-item type="text" prop="dictValue" v-model="dict.dictValue" label="字典值" valid="r|l-le400"></sw-form-item>
					<sw-form-item type="text" prop="sort" v-model="dict.sort" label="排序码" valid="r|integer"></sw-form-item>
					<!-- operation -->
					<sw-form-item style="margin-bottom:0;">
						<sw-button type="success" :underline="false" icon="circle-check" @click="updateDict" permission="bms:system:dict:dict:update">保存 (S)</sw-button>
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

// import requests: get dict data, update dict
import { $getDictData, $updateDict } from '@/assets/config/api';

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

// props
const props = defineProps(['dictCategoryId', 'dictId'])

// ref
const dictForm = ref()

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
	$getDictData({dictCategoryId:props.dictCategoryId, dictId:props.dictId}).then(handler=>{
		// set dict
		state.dict = handler.data.data.dict;
	});
}

/**
 * update dict
 */
const updateDict = () => {
	// valid
	dictForm.value.validate((valid)=>{
		if(valid){
			// confirm
			ElMessageBox.confirm('确定更新字典信息？', '提示').then(()=>{
				// update dict
				$updateDict(state.dict).then(handler=>{
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
watch(()=>props.dictId, ()=>{ reset() }, {deep: true}) 

// reset
reset();

// hotkey
key('alt+s', ()=>{ updateDict();return false; });
key('alt+r', ()=>{ reset();return false; });
</script>
