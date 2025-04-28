<template>
	<el-form-item :prop="props.prop" :label="props.label" v-bind="props.formItemProps"
		:rules="{ label:props.label, type:props.validType, valid:props.valid, unique:props.validUnique, lang:t, validator:validator, trigger:props.validTrigger }">
		<el-input-number v-if="props.type==='number'" v-model="model" v-bind="$attrs" :placeholder="props.placeholder?props.placeholder:('请输入'+props.label)" />
		<el-input v-else v-model="model" :type="props.type" v-bind="$attrs" :placeholder="props.placeholder?props.placeholder:('请输入'+props.label)" />
	</el-form-item>
</template>

<script lang="ts" name="SwInput" setup>
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue elements
import { ref, useAttrs } from 'vue'

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
	// type
	type: { required:false, type:String, default: ()=>'' },
	// prop
	prop: { required:false, type:String, default: ()=>'' },
	// label
	label: { required:false, type:String, default: ()=>'' },
	// placeholder
	placeholder: { required:false, type:String, default: ()=>'' },
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
</script>