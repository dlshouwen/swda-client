<template>
	<el-dialog v-model="visible" title="编辑菜单" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="menu" :rules="rules" label-width="120px" @keyup.enter="updateMenu">
			<sw-select-system v-model="menu.systemId" prop="systemId" label="上级菜单" clearable checkStrictly />
			<sw-select-menu v-model="selectPreMenuData" :systemId="menu.systemId" prop="preMenuId" label="上级菜单" clearable checkStrictly />
			<el-form-item prop="menuId" label="菜单编号">
				<el-input v-model="menu.menuId" placeholder="请输入菜单编号" disabled></el-input>
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
				<el-button type="success" @click="updateMenu"><sw-icon icon="save"></sw-icon>保存</el-button>
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
import { $getMenuList, $getMenuData, $updateMenu } from '@/api/bms/system/menu'
import { $getSystemList } from '@/api/bms/system/system'

// import tools
import { searchCascaderId } from '@/utils/tools'

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
	preMenuId: 0,
	systemId: 0,
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
const init = async (menuId:number)=>{
	// get menu data
	await getMenuData(menuId)
	// get system list
	await getSystemList()
	// set select pre menu data
	selectPreMenuData.value = searchCascaderId(menuList.value, menu.preMenuId, menu.systemId, 'menuId', 'preMenuId', 'menuId')
	// set visible
	visible.value = true
}

/**
 * get menu data
 * @param menuId
 */
const getMenuData = async (menuId:number)=>{
	// get menu data
	let handler = await $getMenuData(menuId)
	// set menu data
	Object.assign(menu, handler.data)
}

/**
 * reset
 */
const reset = async ()=>{
	// has form ref
	if (formRef.value) {
		// reset
		formRef.value.resetFields()
	}
}

/**
 * system change
 * @param systemId
 */
const systemChange = () => {
	// get menu list
	getMenuList()
}

/**
 * get system list
 */
const getSystemList = async () => {
	// get system list
	let handler = await $getSystemList()
	// set system datas
	systemList.value = handler.data
	// get menu list
	await getMenuList()
}

/**
 * get menu list
 */
const getMenuList = async ()=>{
	// get menu list
	let handler = await $getMenuList(menu.systemId)
	// set menu list
	menuList.value = handler.data
}

/**
 * update menu
 */
const updateMenu = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// update menu
		$updateMenu(menu).then(()=>{
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