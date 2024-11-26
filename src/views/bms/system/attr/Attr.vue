<template>
	<!-- container -->
	<div class="container">
		<!-- tabs -->
		<el-tabs v-model="tab.active">
			<!-- tab -->
			<el-tab-pane v-for="(tab, key) in tab.datas" :key="key" :name="key" :style="{maxHeight:height+'px',overflow:'auto'}">
				<!-- tab label -->
				<template #label><span><el-link icon="setting"> {{tab}}</el-link></span></template>
				<!-- form -->
				<el-form :ref="(el)=>setFormRef(el, key)" :model="data[key]" label-width="168px" :status-icon="true" :inline-message="true">
					<!-- for each attrs -->
					<template v-for="(attr, index) in attrs">
						<!-- string / number -->
						<template v-if="attr.attrType==key&&(attr.dataType=='1'||attr.dataType=='2')">
							<el-form-item :label="attr.attrName" :prop="attr.attrId" :rules="{ valid:attr.valid, label:attr.attrName, type:'input', validator: validator, trigger: 'change' }">
								<el-input v-model="data[key][attr.attrId]" style="width:480px;"></el-input>
							</el-form-item>
							<el-form-item><span class="description"><el-link icon="warning" :underline="false"> {{attr.remark}}</el-link></span></el-form-item>
						</template>
						<!-- date -->
						<template v-if="attr.attrType==key&&attr.dataType=='3'">
							<el-form-item :label="attr.attrName" :prop="attr.id" :rules="{ valid:attr.valid, label:attr.attrName, type:'input', validator: validator, trigger: 'change' }">
								<el-date-picker v-model="attr.content" type="datetime" :format="attr.format"></el-date-picker>
							</el-form-item>
							<el-form-item><span class="description"><el-link icon="warning" :underline="false"> {{attr.remark}}</el-link></span></el-form-item>
						</template>
						<!-- single -->
						<template v-if="attr.attrType==key&&attr.dataType=='4'">
							<el-form-item :label="attr.attrName" :prop="attr.id" :rules="{ valid:attr.valid, label:attr.attrName, type:'input', validator: validator, trigger: 'change' }">
								<el-radio-group v-model="attr.content">
									<el-radio v-for="(value, key) in JSON.parse(attr.options)" border :key="key" :label="key">{{value}}</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item><span class="description"><el-link icon="warning" :underline="false"> {{attr.remark}}</el-link></span></el-form-item>
						</template>
						<!-- mutipal -->
						<template v-if="attr.attrType==key&&attr.dataType=='5'">
							<el-form-item :label="attr.attrName" :prop="attr.id" :rules="{ valid:attr.valid, label:attr.attrName, type:'input', validator: validator, trigger: 'change' }">
								<el-checkbox-group v-model="attr.content">
									<el-checkbox-button v-for="(value, key) in JSON.parse(attr.options)"  :key="key" :label="key" :name="attr.attrId"></el-checkbox-button>
								</el-checkbox-group>
							</el-form-item>
							<el-form-item><span class="description"><el-link icon="warning" :underline="false"> {{attr.remark}}</el-link></span></el-form-item>
						</template>
					</template>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<!-- operation -->
		<div class="operation-container">
			<sw-button type="success" :underline="false" icon="circle-check" @click="saveAttr" permission="bms:system:attr:save">保存 (s)</sw-button>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: get attr list, save attr
import { $getAttrList, $saveAttr } from '@/assets/config/api';

// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

// import key
import key from 'keymaster';

// import tool
import * as tool from '@/assets/utils/tool';

//import store: data
import { useDataStore } from '@/store/data'
//get store: data
const dataStore = useDataStore();

// const state
const state = reactive({
	// height
	height: 600,
	// attrs
	attrs:[],
	// data
	data: {},
	// tab
	tab: {
		// datas
		datas:dataStore.dict.attr_type,
		// active ( first )
		active:Object.keys(dataStore.dict.attr_type)[0]
	}
});

// to refs
const { height, attrs, data, tab } = toRefs(state);

// ref form
const formRefs = []
const setFormRef = (el, key) => {
	if (el) {
		formRefs[key] = el
	}
}

/**
 * resize
 */
const resize = () => {
	state.height = document.documentElement.clientHeight-130;
}

/**
 * validator
 * @prarm rule
 * @prarm value
 * @prarm callback
 * @prarm obj
 */
const validator = (rule, value, callback, obj) => {
	tool.validation(rule, value, callback, null, {style:'default'});
}

/**
 * get attr list
 */
const getAttrList = () => {
	// get attr list
	$getAttrList().then(handler=>{
		// success
		if(handler.data.result){
			// set datas
			state.attrs = handler.data.data.attrList;
			// set attr
			state.attrs.forEach(attr=>{
				if(!state.data[attr.attrType]){
					state.data[attr.attrType] = {};
				}
				state.data[attr.attrType][attr.attrId] = attr.content;
			});
		}
	});
}

/**
 * save attr
 */
const saveAttr = () => {
	// validate
	let results = [];
	for (let key in dataStore.dict.attr_type) {
		results.push(formRefs[key].validate());
	}
	Promise.all(results).then(()=>{
		// confirm
		ElMessageBox.confirm('确定保存参数数据吗？', '警告').then(()=>{
			// set attrs
			state.attrs.forEach(attr=>{
				attr.content = state.data[attr.attrType][attr.attrId];
			});
			// save attr
			$saveAttr(state.attrs).then(handler=>{
				// success
				if(handler.data.result){
					// message
					ElMessage.success(handler.data.message);
				}
			});
		}).catch(()=>{});
	}).catch(()=>{});
}

// get attr list
getAttrList();

// set height
window.onresize = resize;
nextTick(resize);

// hotkey
key('alt+s', ()=>{ saveAttr();return false; });
</script>

<style scoped>
/** description */
.description .el-link{color:#999;}
.description .el-link /deep/ i.el-icon{margin-right:6px;}

/** operation container */
.operation-container{background:white;margin:0 4px;padding:4px;padding-left:178px;}
</style>