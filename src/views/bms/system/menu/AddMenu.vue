<template>
	<el-dialog v-model="visible" title="新增菜单" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="menu" :rules="rules" label-width="120px" @keyup.enter="addMenu">
			<el-form-item prop="systemId" label="所属系统">
				<el-select v-model="menu.systemId" placeholder="所属系统" style="width:100%">
					<el-option v-for="system in systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId" @change="getMenuList"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="preMenuId" label="上级菜单">
				<el-cascader v-model="selectPreMenuData" :options="menuList" :props="selectMenuProps" placeholder="所属菜单" clearable checkStrictly style="width:100%" />
			</el-form-item>
			<el-form-item prop="menuId" label="菜单编号">
				<el-input v-model="menu.menuId" placeholder="请输入菜单编号"></el-input>
			</el-form-item>
			<el-form-item prop="menuCode" label="菜单编码">
				<el-input v-model="menu.menuCode" placeholder="请输入菜单编码"></el-input>
			</el-form-item>
			<el-form-item prop="menuName" label="菜单名称">
				<el-input v-model="menu.menuName" placeholder="请输入菜单名称"></el-input>
			</el-form-item>
			<el-form-item prop="menuType" label="菜单类型">
				<el-radio-group v-model="menu.menuType">
					<el-radio-button v-for="item in appStore.dict.menu_type.datas" :label="item.label" :value="item.value" />
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="authority" label="权限值">
				<el-input v-model="menu.authority" placeholder="请输入权限值"></el-input>
			</el-form-item>
			<el-form-item prop="path" label="路径">
				<el-input v-model="menu.path" placeholder="请输入路径"></el-input>
			</el-form-item>
			<el-form-item prop="component" label="组件">
				<el-input v-model="menu.component" placeholder="请输入组件"></el-input>
			</el-form-item>
			<el-form-item prop="icon" label="图标">
				<el-input v-model="menu.icon" placeholder="请输入图标"></el-input>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="menu.assistSearch" placeholder="请输入辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="menu.sort" :min="0" placeholder="请输入排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="menu.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="addMenu"><sw-icon icon="save"></sw-icon>保存</el-button>
				<el-divider direction="vertical" />
				<el-button type="danger" @click="close"><sw-icon icon="close"></sw-icon>关闭</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, watch } from 'vue'

// import element plus elements
import { ElMessage } from 'element-plus'

// import use i18n
import { useI18n } from 'vue-i18n'

// import apis
import { $getMenuList, $addMenu } from '@/api/bms/system/menu'
import { $getSystemList } from '@/api/bms/system/system'

// import validator
import { validator } from '@/utils/validator'
 
// import stores
import { useAppStore } from '@/stores/app'

// const emit
const emit = defineEmits(['callback'])

// get i18n
const { t } = useI18n()

// get stores
const appStore = useAppStore()

// const visible
const visible = ref(false)

// const form ref
const formRef = ref()

// const menu
const menu = reactive({
	menuId: '',
	preMenuId: '',
	systemId: '',
	menuCode: '',
	menuName: '',
	menuType: '',
	authority: '',
	path: '',
	component: '',
	icon: '',
	assistSearch: '',
	sort: 0,
	remark: '',
})

// const rules
const rules = ref({
	menuId: [{ label:'菜单编号', valid:'r|double|l-le20', unique: { code:'bms.system.menu.menu_id.add', args:[] }, lang:t, validator:validator, trigger:'blur' }],
	preMenuId: [{ label:'上级菜单编号', valid:'r|double|l-le20', lang:t, validator:validator, trigger:'blur' }],
	systemId: [{ label:'系统编号', valid:'r|double|l-le20', lang:t, validator:validator, trigger:'blur' }],
	menuCode: [{ label:'菜单编码', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	menuName: [{ label:'菜单名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	menuType: [{ label:'菜单类型', valid:'r|l-le2', lang:t, validator:validator, trigger:'blur' }],
	authority: [{ label:'权限值', valid:'r|l-le200', lang:t, validator:validator, trigger:'blur' }],
	path: [{ label:'路径', valid:'l-le800', lang:t, validator:validator, trigger:'blur' }],
	component: [{ label:'组件', valid:'l-le800', lang:t, validator:validator, trigger:'blur' }],
	icon: [{ label:'图标', valid:'r|l-le40', lang:t, validator:validator, trigger:'blur' }],
	assistSearch: [{ label:'辅助查询', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
})

// const system list
const systemList = ref()

// const menu list
const menuList = ref()

// const select menu props
const selectMenuProps = { label: 'menuName', value: 'menuId', checkStrictly: true }

// const select pre menu data
const selectPreMenuData = ref([])

// watch select pre menu data
watch(selectPreMenuData, ()=>{
	// set pre menu id
	if(!selectPreMenuData.value || selectPreMenuData.value.length==0){
		menu.preMenuId = menu.systemId
	}else{
		menu.preMenuId = selectPreMenuData.value[selectPreMenuData.value.length-1]
	}
})

/**
 * init
 */
const init = ()=>{
	// reset data
	reset()
	// set visible
	visible.value = true
}

/**
 * reset
 */
const reset = ()=>{
	// get system list
	getSystemList()
	// has form ref
	if (formRef.value) {
		// reset
		formRef.value.resetFields()
	}
}

/**
 * get system list
 */
const getSystemList = async () => {
	// get system list
	let handler = await $getSystemList()
	// set system datas
	systemList.value = handler.data
	// set first
	menu.systemId = systemList.value[0].systemId
	// get menu list
	getMenuList()
}

/**
 * get menu list
 */
const getMenuList = ()=>{
	// get menu list
	$getMenuList(menu.systemId).then(handler=>{
		// set menu list
		menuList.value = handler.data
		// set pre menu id
		menu.preMenuId = menu.systemId
	})
}

/**
 * select menu change
 */
const getselectMenuChange = (value) => {
	// set pre menu id
	menu.preMenuId = value[value.length-1]
}

/**
 * add menu
 */
const addMenu = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// add menu
		$addMenu(menu).then(()=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// set visible
				visible.value = false
				// callback
				emit('callback')
			}})
		})
	})
}

/**
 * close
 */
const close = ()=>{
	// set visible
	visible.value = false
}

// expose
defineExpose({ init })
</script>