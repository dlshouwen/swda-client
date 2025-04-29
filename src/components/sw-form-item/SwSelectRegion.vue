<template>
	<el-form-item :prop="props.prop" :label="props.label" v-bind="props.formItemProps"
		:rules="{ label:props.label, type:props.validType, valid:props.valid, unique:validUnique, lang:t, validator:validator, trigger:props.validTrigger }">
		<el-cascader v-model="model" v-bind="$attrs" :props="_props" :checkStrictly="props.checkStrictly"
			:placeholder="props.placeholder?props.placeholder:('请选择'+props.label)" style="width:100%" />
	</el-form-item>
</template>

<script lang="ts" name="SwSelectRegion" setup>
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue elements
import { ref } from 'vue'

// import apis
import { $getRegionList } from '@/api/bms/system/region'

// import use i18n
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// import validator
import { validator } from '@/utils/validator'

// const model
const model = defineModel()

// define props
const props = defineProps({
	// prop
	prop: { required:false, type:String, default: ()=>'' },
	// label
	label: { required:false, type:String, default: ()=>'' },
	// placeholder
	placeholder: { required:false, type:String, default: ()=>'' },
	// check strictly
	checkStrictly: { required:false, type:Boolean, default: ()=>true },
	// props
	props: { required:false, type:Object, default: ()=>null },
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

// const props
const _props = ref()

// has origin
if(props.props){
	// set origin props
	_props.value = props.props
}else{
	// set props
	_props.value = {
		lazy: true,
		label: 'regionName',
		value: 'regionId',
		leaf: 'leaf',
		lazyLoad(node: any, resolve: any) {
			// get region list
			$getRegionList(node.level==0?0:node.value).then(({ data })=>{
				// set leaf
				data.forEach((data:any)=>{data.leaf=!data.hasChildren})
				// resolve
				resolve(data)
			})
		}
	}
	
}
</script>