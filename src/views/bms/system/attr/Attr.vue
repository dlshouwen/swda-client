<template>
	<!-- container -->
	<sw-container>
		<!-- tabs -->
		<el-tabs type="border-card">
			<!-- tab -->
			<el-tab-pane v-for="type in appStore.dict.attr_type.datas" :key="type.value" :label="type.label">
				<!-- scrollbar -->
				<el-scrollbar>
					<!-- form -->
					<el-form :ref="(el)=>setFormRef(el, type.value)" label-position="left" :model="data[type.value]" :rules="rule[type.value]" label-width="220px" style="max-width:720px" @keyup.enter="saveAttrList">
						<!-- for each attr -->
						<template v-for="attr in attrList">
							<!-- attr -->
							<template v-if="attr.isSpecial=='0'&&attr.attrType===type.value">
								<!-- element -->
								<el-space fill>
									<!-- remark -->
									<el-alert type="info" :closable="false"><p>{{attr.remark}}</p></el-alert>
									<!-- string -->
									<el-form-item v-if="attr.dataType=='1'" :prop="attr.attrId" :label="attr.attrName">
										<el-input v-model="data[type.value][attr.attrId]" :placeholder="attr.attrName"></el-input>
									</el-form-item>
									<!-- number -->
									<el-form-item v-if="attr.dataType=='2'" :prop="attr.attrId" :label="attr.attrName">
										<el-input-number v-model="data[type.value][attr.attrId]" :placeholder="attr.attrName"></el-input-number>
									</el-form-item>
									<!-- datetime -->
									<el-form-item v-if="attr.dataType=='3'" :prop="attr.attrId" :label="attr.attrName">
										<el-date-picker v-model="data[type.value][attr.attrId]" type="datetime" :format="attr.dataFormat" :placeholder="attr.attrName" />
									</el-form-item>
									<!-- select -->
									<el-form-item v-if="attr.dataType=='4'" :prop="attr.attrId" :label="attr.attrName">
										<el-radio-group v-model="data[type.value][attr.attrId]">
											<el-radio-button v-for="(label, value) in JSON.parse(attr.options)" :label="label" :value="value" />
										</el-radio-group>
									</el-form-item>
									<!-- multiple select -->
									<el-form-item v-if="attr.dataType=='5'" :prop="attr.attrId" :label="attr.attrName">
										<el-select v-model="data[type.value][attr.attrId]" multiple placeholder="Select">
											<el-option v-for="(label, value) in JSON.parse(attr.options)" :key="value" :label="label" :value="value" />
										</el-select>
									</el-form-item>
								</el-space>
							</template>
						</template>
						<!-- operation -->
						<el-form-item>
							<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
							<el-button type="success" @click="saveAttrList"><sw-icon icon="save"></sw-icon>保存</el-button>
						</el-form-item>
					</el-form>
				</el-scrollbar>
			</el-tab-pane>
		</el-tabs>
	</sw-container>
</template>

<style lang="scss">
/** tabs */
.el-tabs{
	
	height:100%;flex:1;
	
	.el-tabs__content{display:flex;}
}
</style>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import apis
import { $getAttrList, $saveAttrList } from '@/api/bms/system/attr'

// import stores
import { useAppStore } from '@/stores/app'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import use i18n
import { useI18n } from 'vue-i18n'

// import validator
import { validator } from '@/utils/validator'

// get stores
const appStore = useAppStore()

// get i18n
const { t } = useI18n()

// const attr list
const attrList = ref()

// const form ref
const formRef = reactive({})

const setFormRef = (el, type) => {
	if (el) {
		formRef[type] = el
	}
}

// const data
const data = reactive({})

// const rule
const rule = reactive({})

/**
 * get attr list
 */
const getAttrList = async ()=>{
	// get attr list
	let handler = await $getAttrList()
	// set attr list
	attrList.value = handler.data
	// reset
	reset()
}

/**
 * reset
 */
const reset = ()=>{
	// convert to data
	attrList.value.forEach((attr)=>{
		if(!data[attr.attrType]){
			data[attr.attrType] = {}
		}
		data[attr.attrType][attr.attrId] = attr.dataType=='5'?attr.content.split(','):attr.content
		if(!rule[attr.attrType]){
			rule[attr.attrType] = {}
		}
		rule[attr.attrType][attr.attrId] = [{ label:attr.attrName, valid:attr.valid, lang:t, validator:validator, trigger:'blur' }]
	})
}

// mounted
onMounted(() => {
	// get attr list
	getAttrList()
})

/**
 * save attr list
 */
const saveAttrList = () => {
	// validate
	let results = []
	appStore.dict.attr_type.datas.forEach(data=>{
		results.push(formRef[data.value].validate())
	})
	Promise.all(results).then(()=>{
		// confirm
		ElMessageBox.confirm('确定保存参数数据吗？', '警告').then(()=>{
			// set attr
			attrList.value.forEach(attr=>{
				let content = data[attr.attrType][attr.attrId];
				attr.content = attr.dataType=='5'?content.join(','):content
			})
			// save attr
			$saveAttrList(attrList.value).then(handler=>{
				// message
				ElMessage.success('保存成功！')
			})
		})
	})
}
</script>