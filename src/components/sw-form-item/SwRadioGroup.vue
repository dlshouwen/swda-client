<template>
	<el-form-item :prop="props.prop" :label="props.label" v-bind="props.formItemProps"
		:rules="{ label:props.label, type:props.validType, valid:props.valid, unique:props.validUnique, lang:t, validator:validator, trigger:props.validTrigger }">
		<el-radio-group v-model="model" v-bind="$attrs" :placeholder="props.placeholder?props.placeholder:('请选择'+props.label)">
			<template v-if="props.dict">
				<el-radio-button v-if="typeof props.dict==='object'" v-for="(value, key) in options" :key="key" :label="key" :value="value" />
				<el-radio-button v-if="typeof props.dict==='array'" v-for="dict in appStore.dict" :key="dict.value" :label="dict.label" :value="dict.value" />
				<el-radio-button v-if="typeof props.dict==='string'" v-for="dict in appStore.dict[props.dict].datas" :key="dict.value" :label="dict.label" :value="dict.value" />
			</template>
			<slot v-else></slot>
		</el-radio-group>
	</el-form-item>
</template>

<script lang="ts" name="SwRadioGroup" setup>
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
	// prop
	prop: { required:false, type:String, default: ()=>'' },
	// label
	label: { required:false, type:String, default: ()=>'' },
	// dict
	dict: { required:false, type:[Array, Object, String], default: ()=>'' },
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