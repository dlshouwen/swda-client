<template>
	<el-form-item :prop="props.prop" :label="props.label" v-bind="props.formItemProps"
		:rules="{ label:props.label, type:props.validType, valid:props.valid, unique:validUnique, lang:t, validator:validator, trigger:props.validTrigger }">
		<el-select v-model="model" v-bind="$attrs" :placeholder="props.placeholder?props.placeholder:('请选择'+props.label)" >
			<el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId"></el-option>
		</el-select>
	</el-form-item>
</template>

<script lang="ts" name="SwSelectRole" setup>
// cancel inherit attrs
defineOptions({ inheritAttrs: false })

// import vue elements
import { ref, useAttrs } from 'vue'

// import apis
import { $getRoleList } from '@/api/bms/permission/role'

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

// const role list
const roleList = ref([])

// get role list
$getRoleList().then(({data}) => {
	// set role datas
	roleList.value = data
})
</script>