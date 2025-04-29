<template>
	<el-form-item :prop="props.prop" :label="props.label" v-bind="props.formItemProps"
		:rules="{ label:props.label, type:props.validType, valid:props.valid, unique:validUnique, lang:t, validator:validator, trigger:props.validTrigger }">
		<el-tree-select v-model="model" :data="organList" v-bind="$attrs" :defaultExpandAll="props.defaultExpandAll"
			:placeholder="props.placeholder?props.placeholder:('请选择'+props.label)" />
	</el-form-item>
</template>

<script lang="ts" name="SwSelectOrgan" setup>
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue elements
import { ref, useAttrs } from 'vue'

// import apis
import { $getOrganList } from '@/api/bms/permission/organ'

// import use i18n
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// import validator
import { validator } from '@/utils/validator'

// const model
const model = defineModel()

// const attrs
const attrs = useAttrs()

// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
// get store
const appStore = useAppStore()
const userStore = useUserStore()

// define props
const props = defineProps({
	// prop
	prop: { required:false, type:String, default: ()=>'' },
	// label
	label: { required:false, type:String, default: ()=>'' },
	// placeholder
	placeholder: { required:false, type:String, default: ()=>'' },
	// default expand all
	defaultExpandAll: { required:false, type:Boolean, default: ()=>true },
	// valid
	valid: { required:false, type:String, default: ()=>'' },
	// valid type
	validType: { required:false, type:String, default: ()=>'' },
	// valid trigger
	validTrigger: { required:false, type:String, default: ()=>'change' },
	// valid unique
	validUnique: { required:false, type:[String, Object], default: ()=>{} },
	// form item props
	formItemProps: { required:false, type:Object, default: ()=>{} },
})

// get valid unique
const validUnique = (typeof props.validUnique==='string')?{ code:props.validUnique }:props.validUnique

// const organ list
const organList = ref([])

// get organ list
$getOrganList().then(({data}) => {
	// set organ datas
	organList.value = data
})
</script>