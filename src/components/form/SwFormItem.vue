<template>
	<!-- el form item -->
	<el-form-item :label="label" :prop="prop" :rules="{ valid:valid, label:label, type:validType, validator:validator, password:password, unique:validUnique, trigger:validTrigger }" v-bind="formItemProps">
		<!-- span -->
		<span ref="spanRefrence" v-bind="spanProps">
			<!-- input / textarea / password -->
			<el-input ref="item" v-if="type=='text' || type=='textarea' || type=='password'" 
				:type="type"
				:value="modelValue" @input="updateValue"
				:show-password="type=='password'" :disabled="disabled" 
				:placeholder="placeholder?placeholder:('请填写'+label)"
				v-bind="{ ...$attrs, ...props, ...itemProps }">
			</el-input>
			<!-- number -->
			<el-input-number ref="item" v-if="type=='number'"
				:value="modelValue" @input="updateValue"
				:placeholder="placeholder"
				:disabled="disabled"
				v-bind="itemProps">
			</el-input-number>
			<!-- radio -->
			<el-radio-group ref="item" v-if="type=='radio'" 
				:value="modelValue" @change="updateValue"
				:placeholder="placeholder"
				:disabled="disabled"
				v-bind="{ ...$attrs, ...props, ...itemProps }">
				<el-radio v-for="(value, key) in options" border :key="key" :label="key">{{value}}</el-radio>
			</el-radio-group>
			<!-- radio button -->
			<!-- checkbox -->
			<!-- checkbox button -->
			<!-- select -->
			<el-select ref="item" v-if="type=='select'"
				:value="modelValue" @input="updateValue" 
				:placeholder="placeholder"
				:disabled="disabled"
				@change="$emit('change', $event);"
				v-bind="{ ...$attrs, ...props, ...itemProps }">
				<el-option v-for="(value, key) in options" border :key="key" :label="value" :value="key"></el-option>
			</el-select>
			<!-- cascader -->
			<el-cascader ref="item" v-if="type=='cascader'" 
				:value="modelValue" @change="updateValue" 
				:placeholder="placeholder"
				:disabled="disabled"
				v-bind="{ ...$attrs, ...props, ...itemProps }">
			</el-cascader>
			<!-- swich -->
			<!-- slider -->
			<!-- time -->
			<!-- date -->
			<!-- datetime -->
			<!-- <el-date-picker ref="item" v-if="type=='datetime'" 
				:model-value="modelValue" @change="updateValue" 
				:placeholder="placeholder"
				:disabled="disabled"
				v-bind="{ ...$attrs, ...props, ...itemProps }"> -->
			<el-date-picker ref="item" v-if="type=='datetime'" 
				v-model="datePickerData.data" @change="updateValue"
				:placeholder="placeholder"
				:disabled="disabled"
				v-bind="{ ...$attrs, ...itemProps }">
			</el-date-picker>
			<!-- rate -->
			<!-- color -->
			<!-- transfer -->
			<!-- slot -->
			<slot></slot>
		</span>
	</el-form-item>
</template>

<script setup>
// cancel inherit attrs
defineOptions({ inheritAttrs: false });

//import vue: ref & reactive & conputed & watch
import { ref, reactive, computed, watch } from 'vue'

// import tool
import * as tool from '@/assets/utils/tool';

//define props
const props = defineProps({
	// value
	modelValue: { default: '', required: false },
	// type: options: input / textarea / password / number / radio / radio-button / checkbox / checkbox-button / select / cascader / swich / slider / time / date / datetime / rate / color / transfer
	type: { default: 'slot', type: String, required: false },
	// placeholder
	placeholder: { default: '', type: String, required: false },
	// label
	label: { default: '', type: String, required: false },
	// prop
	prop: { default: '', type: String, required: false },
	// disabled
	disabled: { default: false, type: Boolean, required: false },
	// valid
	valid: { default: '', type: String, required: false },
	// valid type
	validType: { default: 'input', type: String, required: false },
	// valid trigger
	validTrigger: { default: 'change', type: String, required: false },
	// valid unique
	validUnique: { default: null, required: false },
	// password
	password: { default: null, required: false },
	// items
	items: { default: null, required: false },
	// item-key
	itemKey: { default: null, type: String, required: false },
	// item-value
	itemValue: { default: null, type: String, required: false },
	// form item props
	formItemProps: {default: null, type: Object, required: false },
	// span props
	spanProps: {default: null, type: Object, required: false },
	// item props
	itemProps: {default: {}, type: Object, required: false },
})

// data picker data
const datePickerData = reactive({
	data: ''
});

// emit
let emit = defineEmits(["update:modelValue"]);

// watch
watch(()=>props.modelValue, (value)=>{
	if(props.type=='datetime'){
		datePickerData.data = value
	}
}, {deep: true, immediate: true}) 

/**
 * update value
 * @param value
 */
const updateValue = (value) => {
	emit('update:modelValue', value);
};

// defined span refrence
const spanRefrence = ref()

// options
const options = computed(()=>{
	let datas = {};
	if(props.items){
		if(props.items.constructor===Array){
			props.items.forEach(item=>{
				datas[item[props.itemKey]] = item[props.itemValue];
			});
		}
		if(props.items.constructor===Object){
			datas = props.items;
		}
	}
	return datas;
})

/**
 * validator
 * @prarm rule
 * @prarm value
 * @prarm callback
 */
const validator = (rule, value, callback) => {
	tool.validation(rule, value, callback, spanRefrence.value);
}

/**
 * focus
 */
const focus = () => {
	item.focus();
}
</script>