<template>
	<el-form-item :prop="props.prop" :label="props.label" v-bind="props.formItemProps"
		:rules="{ label:props.label, type:props.validType, valid:props.valid, unique:props.validUnique, lang:t, validator:validator, trigger:props.validTrigger }">
		<el-cascader v-model="model" v-bind="$attrs" :props="props.props" :options="menuList" :checkStrictly="props.checkStrictly"
			:placeholder="props.placeholder?props.placeholder:('请选择'+props.label)" style="width:100%" />
	</el-form-item>
</template>

<script lang="ts" name="SwSelectMenu" setup>
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue elements
import { ref } from 'vue'

// import apis
import { $getMenuList } from '@/api/bms/system/menu'

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
	// system id
	systemId: { required:false, type:Number, default: ()=>0 },
	// props
	props: { required:false, type:Object, default: ()=>({ label: 'menuName', value: 'menuId', checkStrictly: true }) },
	// check strictly
	checkStrictly: { required:false, type:Boolean, default: ()=>true },
	// valid
	valid: { required:false, type:String, default: ()=>'' },
	// valid type
	validType: { required:false, type:String, default: ()=>'' },
	// valid trigger
	validTrigger: { required:false, type:String, default: ()=>'change' },
	// valid unique
	validUnique: { required:false, type:Object, default: ()=>{} },
	// form item props
	formItemProps: { required:false, type:Object, default: ()=>{} },
})

// const menuList
const menuList = ref()

console.log(props.systemId)

// get menu list
$getMenuList(props.systemId).then(({ data })=>{
	// set menu list
	menuList.value = data
})
</script>