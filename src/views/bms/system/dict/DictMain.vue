<template>
	<!-- row -->
	<el-row style="height:100%">
		<!-- dict category -->
		<el-col :span="12" style="height:100%"><DictCategoryList></DictCategoryList></el-col>
		<!-- dict -->
		<el-col :span="12" style="height:100%"><DictList :dictCategoryId="dictCategoryId"></DictList></el-col>
	</el-row>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted & provide
import { ref, reactive, toRefs, watch, nextTick, onMounted, provide } from 'vue'

// import components: dict category list & dict list
import DictCategoryList from '@/views/bms/system/dict/DictCategoryList';
import DictList from '@/views/bms/system/dict/DictList';


// const state
const state = reactive({
	// dict category id
	dictCategoryId: '',
});

// refs
const { dictCategoryId } = toRefs(state)

/**
 * set dict category id
 * @param dictCategoryId
 */
const setDictCategoryId = (dictCategoryId) => {
	state.dictCategoryId = dictCategoryId;
}

// provide
provide('setDictCategoryId', setDictCategoryId)
</script>