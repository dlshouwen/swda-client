<template>
	<!-- form -->
	<el-form ref="formRef" label-width="100px" :model="params">
		<!-- for each columns -->
		<template v-for="(column, index) in columns">
			<!-- dict -->
			<template v-if="column.fast&&column.dict">
				<!-- range -->
				<template v-if="column.fast=='range'">
					<el-form-item :label="column.label">
						<el-col :span="11">
							<el-select v-model="params['ge_'+column.prop]">
								<el-option :label="$t('table.fast.all')" value=""></el-option>
								<el-option v-if="typeof column.dict==='object'" v-for="(value, key) in column.dict" :key="key" :label="value" :value="key"></el-option>
								<el-option v-if="typeof column.dict==='array'" v-for="dict in column.dict" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
								<el-option v-if="typeof column.dict==='string'" v-for="dict in appStore.dict[column.dict].datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
							</el-select>
						</el-col>
						<el-col class="line" :span="2">{{t('table.fast.to')}}</el-col>
						<el-col :span="11">
							<el-select v-model="params['le_'+column.prop]">
								<el-option :label="$t('table.fast.all')" value=""></el-option>
								<el-option v-if="typeof column.dict==='object'" v-for="(value, key) in column.dict" :key="key" :label="value" :value="key"></el-option>
								<el-option v-if="typeof column.dict==='array'" v-for="dict in column.dict" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
								<el-option v-if="typeof column.dict==='string'" v-for="dict in appStore.dict[column.dict].datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
							</el-select>
						</el-col>
					</el-form-item>
				</template>
				<!-- not range -->
				<template v-if="column.fast!='range'">
					<el-form-item :label="column.label">
						<template v-if="column.fastType=='select'">
							<el-select v-model="params[column.fast+'_'+column.prop]">
								<el-option :label="$t('table.fast.all')" value=""></el-option>
								<el-option v-if="typeof column.dict==='object'" v-for="(value, key) in column.dict" :key="key" :label="value" :value="key"></el-option>
								<el-option v-if="typeof column.dict==='array'" v-for="dict in column.dict" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
								<el-option v-if="typeof column.dict==='string'" v-for="dict in appStore.dict[column.dict].datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
							</el-select>
						</template>
						<template v-else>
							<el-radio-group v-model="params[column.fast+'_'+column.prop]">
								<el-radio-button label="" key="" value="">{{t('table.fast.all')}}</el-radio-button>
								<el-radio-button v-if="typeof column.dict==='object'" v-for="(value, key) in column.dict" :key="key" :label="value" :value="dict.value"></el-radio-button>
								<el-radio-button v-if="typeof column.dict==='array'" v-for="dict in column.dict" :key="dict.value" :label="dict.label" :value="dict.value"></el-radio-button>
								<el-radio-button v-if="typeof column.dict==='string'" v-for="dict in appStore.dict[column.dict].datas" :key="dict.value" :label="dict.label" :value="dict.value"></el-radio-button>
							</el-radio-group>
						</template>
					</el-form-item>
				</template>
			</template>
			<!-- not dict -->
			<template v-if="column.fast&&!column.dict">
				<!-- date -->
				<template v-if="column.dataType=='date'">
					<!-- range -->
					<template v-if="column.fast=='range'">
						<el-form-item :label="column.label">
							<el-col :span="11">
								<el-date-picker v-model="params['ge_'+column.prop]" type="datetime" :value-format="datePattern(column.format)" :format="datePattern(column.format)" style="width:100%;"></el-date-picker>
							</el-col>
							<el-col class="line" :span="2">{{t('table.fast.to')}}</el-col>
							<el-col :span="11">
								<el-date-picker v-model="params['le_'+column.prop]" type="datetime" :value-format="datePattern(column.format)" :format="datePattern(column.format)" style="width:100%;"></el-date-picker>
							</el-col>
						</el-form-item>
					</template>
					<!-- not range -->
					<template v-if="column.fast!='range'">
						<el-form-item :label="column.label">
							<el-date-picker v-model="params[column.fast+'_'+column.prop]" type="datetime" :value-format="datePattern(column.format)" :format="datePattern(column.format)"></el-date-picker>
						</el-form-item>
					</template>
				</template>
				<!-- not date -->
				<template v-if="column.dataType!='date'">
					<!-- range -->
					<template v-if="column.fast=='range'">
						<el-form-item :label="column.label">
							<el-col :span="11">
								<el-input v-model="params['ge_'+column.prop]"></el-input>
							</el-col>
							<el-col class="line" :span="2">{{t('table.fast.to')}}</el-col>
							<el-col :span="11">
								<el-input v-model="params['le_'+column.prop]"></el-input>
							</el-col>
						</el-form-item>
					</template>
					<!-- not range -->
					<template v-if="column.fast!='range'">
						<el-form-item :label="column.label">
							<el-input v-model="params[column.fast+'_'+column.prop]"></el-input>
						</el-form-item>
					</template>
				</template>
			</template>
		</template>
		<!-- operations -->
		<el-form-item>
			<el-button type="warning" @click="reset"><sw-icon :icon="$t('table.fast.buttons.reset.icon')"></sw-icon>{{t('table.fast.buttons.reset.text')}}</el-button>
			<el-button type="success" @click="fastQuery"><sw-icon :icon="$t('table.fast.buttons.query.icon')"></sw-icon>{{t('table.fast.buttons.query.text')}}</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
// import vue elements
import { ref, reactive } from 'vue'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// props
const props = defineProps(['columns', 'params'])

// const params
const params = reactive({})

// copy params
Object.assign(params, props.params)

// import vue i18n
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

/**
 * reset
 */
const reset = () => {
	// reset params
	Object.assign(params, props.params)
}

// const emit
const emit = defineEmits(['callback'])

/**
 * fast query
 */
const fastQuery = () => {
	// callback
	emit('callback', params)
}

/**
 * date pattern
 */
const datePattern = (format) => (format?format.replace(new RegExp('y', 'gm'), 'Y').replace(new RegExp('d', 'gm'), 'D').replace(new RegExp('h', 'gm'), 'H'):null)
</script>

<style scoped>
.line{text-align:center;}
</style>