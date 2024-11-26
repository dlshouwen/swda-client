<template>
	<!-- container -->
	<div class="container">
		<!-- panel -->
		<div class="panel data-panel">
			<!-- panel body -->
			<div class="panel-body">
				<!-- form -->
				<el-form ref="fastQueryForm" label-width="100px" :model="fastQueryParams" :status-icon="true" :inline-message="true">
					<!-- for each columns -->
					<template v-for="(column, index) in columns">
						<!-- dict -->
						<template v-if="column.fast&&column.dict">
							<!-- range -->
							<template v-if="column.fast=='range'">
								<el-form-item :label="column.label">
									<el-col :span="11">
										<el-select v-model="fastQueryParams['ge_'+column.id]">
											<el-option :label="language.fast.all" value=""></el-option>
											<el-option v-for="(value, key) in column.dict" :key="key" :label="value" :value="key"></el-option>
										</el-select>
									</el-col>
									<el-col class="line" :span="2">{{language.fast.to}}</el-col>
									<el-col :span="11">
										<el-select v-model="fastQueryParams['le_'+column.id]">
											<el-option :label="language.fast.all" value=""></el-option>
											<el-option v-for="(value, key) in column.dict" :key="key" :label="value" :value="key"></el-option>
										</el-select>
									</el-col>
								</el-form-item>
							</template>
							<!-- not range -->
							<template v-if="column.fast!='range'">
								<el-form-item :label="column.label">
									<template v-if="column.fastType=='select'">
										<el-select v-model="fastQueryParams[column.fast+'_'+column.id]">
											<el-option :label="language.fast.all" value=""></el-option>
											<el-option v-for="(value, key) in column.dict" :key="key" :label="value" :value="key"></el-option>
										</el-select>
									</template>
									<template v-else>
										<el-radio-group v-model="fastQueryParams[column.fast+'_'+column.id]">
											<el-radio border label="" key="" value="">{{language.fast.all}}</el-radio>
											<el-radio v-for="(value, key) in column.dict" border :key="key" :label="key">{{value}}</el-radio>
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
											<el-date-picker v-model="fastQueryParams['ge_'+column.id]" type="datetime" :value-format="datePattern(column.format)" :format="datePattern(column.format)"></el-date-picker>
										</el-col>
										<el-col class="line" :span="2">{{language.fast.to}}</el-col>
										<el-col :span="11">
											<el-date-picker v-model="fastQueryParams['le_'+column.id]" type="datetime" :value-format="datePattern(column.format)" :format="datePattern(column.format)"></el-date-picker>
										</el-col>
									</el-form-item>
								</template>
								<!-- not range -->
								<template v-if="column.fast!='range'">
									<el-form-item :label="column.label">
										<el-date-picker v-model="fastQueryParams[column.fast+'_'+column.id]" type="datetime" :value-format="datePattern(column.format)" :format="datePattern(column.format)"></el-date-picker>
									</el-form-item>
								</template>
							</template>
							<!-- not date -->
							<template v-if="column.dataType!='date'">
								<!-- range -->
								<template v-if="column.fast=='range'">
									<el-form-item :label="column.label">
										<el-col :span="11">
											<el-input v-model="fastQueryParams['ge_'+column.id]"></el-input>
										</el-col>
										<el-col class="line" :span="2">{{language.fast.to}}</el-col>
										<el-col :span="11">
											<el-input v-model="fastQueryParams['le_'+column.id]"></el-input>
										</el-col>
									</el-form-item>
								</template>
								<!-- not range -->
								<template v-if="column.fast!='range'">
									<el-form-item :label="column.label">
										<el-input v-model="fastQueryParams[column.fast+'_'+column.id]"></el-input>
									</el-form-item>
								</template>
							</template>
						</template>
					</template>
					<!-- operations -->
					<el-form-item style="margin-bottom:0;margin-top:8px;">
						<el-button type="success" :underline="false" :icon="language.fast.buttons.query.icon" @click="fastQuery">{{language.fast.buttons.query.text}}</el-button>
						<el-button type="warning" :underline="false" :icon="language.fast.buttons.reset.icon" @click="reset">{{language.fast.buttons.reset.text}}</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & inject
import { ref, reactive, toRefs, inject } from 'vue'

// props
const props = defineProps(['language', 'columns', 'params'])

// const state
const state = reactive({
	// fast query params
	fastQueryParams: {}
});

// to refs
const { fastQueryParams } = toRefs(state);

// inject
const _fastQuery = inject('fastQuery');

/**
 * reset
 */
const reset = () => {
	// for each columns
	props.columns.forEach(column=>{
		// if fast
		if(column.fast){
			// range
			if(column.fast=='range'){
				// greate than equals
				{
					const key = 'ge_'+column.id
					state.fastQueryParams[key] = props.params[key]?props.params[key]:''
				}
				// less than equals
				{
					const key = 'le_'+column.id
					state.fastQueryParams[key] = props.params[key]?props.params[key]:''
				}
			}else{
				// other
				const key = column.fast+'_'+column.id;
				state.fastQueryParams[key] = props.params[key]?props.params[key]:''
			}
		}
	});
}

/**
 * fast query
 */
const fastQuery = () => {
	_fastQuery(state.fastQueryParams);
}

/**
 * date pattern
 */
const datePattern = (format) => (format?format.replace(new RegExp('y', 'gm'), 'Y').replace(new RegExp('d', 'gm'), 'D').replace(new RegExp('h', 'gm'), 'H'):null)

// reset
reset();
</script>

<style scoped>
/** form item */
.el-form-item{margin-bottom:4px;}

/** date editor */
.el-date-editor.el-input, .el-date-editor.el-input__inner{width:100%;}

/** input */
.el-input__prefix{left:0;}
.el-input--prefix .el-input__inner{padding-left:25px;}
.el-input--suffix .el-input__inner{padding-right:25px;}

/** line */
.line{text-align:center;color:#888;}
</style>