<template>
	<el-dialog v-model="visible" title="编辑角色" :close-on-click-modal="false" draggable width="480px">
		<el-form ref="formRef" :model="role" :rules="rules" label-width="120px" @keyup.enter="updateRole">
			<el-form-item prop="roleCode" label="角色编码">
				<el-input v-model="role.roleCode" placeholder="请输入角色编码"></el-input>
			</el-form-item>
			<el-form-item prop="roleName" label="角色名称">
				<el-input v-model="role.roleName" placeholder="请输入角色名称"></el-input>
			</el-form-item>
			<el-form-item prop="systemIdList" label="所属系统">
				<el-select v-model="role.systemId" placeholder="所属系统" @change="systemChange">
					<el-option v-for="system in systemList" :key="system.systemId" :label="system.systemName" :value="system.systemId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="配置菜单权限">
				<el-card shadow="never" style="width:100%;">
					<el-scrollbar style="height:120px;">
						<el-tree ref="menuTreeRef" :props="{label:'menuName', value:'menuId'}" node-key="menuId" :default-checked-keys="menuCheckKeys" :data="menuList" show-checkbox />
					</el-scrollbar>
				</el-card>
			</el-form-item>
			<el-form-item prop="organId" label="所属机构">
				<el-tree-select v-model="role.organId" :data="organList" check-strictly :render-after-expand="false" />
			</el-form-item>
			<el-form-item prop="dataScope" label="数据范围">
				<el-select v-model="role.dataScope" placeholder="数据范围">
					<el-option v-for="item in appStore.dict.data_scope_type.datas" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="配置机构权限" v-if="role.dataScope==='5'">
				<el-card shadow="never" style="width:100%;">
					<el-scrollbar style="height:80px;">
						<el-tree ref="organTreeRef" :props="{label:'organName', value:'organId'}" node-key="organId" :default-checked-keys="organCheckKeys" :data="organList" show-checkbox />
					</el-scrollbar>
				</el-card>
			</el-form-item>
			<el-form-item prop="assistSearch" label="辅助查询">
				<el-input v-model="role.assistSearch" placeholder="辅助查询"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="排序码">
				<el-input-number v-model="role.sort" :min="0" placeholder="排序码"></el-input-number>
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="role.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="warning" @click="reset"><sw-icon icon="undo"></sw-icon>重置</el-button>
				<el-button type="success" @click="updateRole"><sw-icon icon="save"></sw-icon>保存</el-button>
				<el-divider direction="vertical" />
				<el-button type="danger" @click="close"><sw-icon icon="close"></sw-icon>关闭</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive } from 'vue'

// import element plus elements
import { ElMessage } from 'element-plus'

// import use i18n
import { useI18n } from 'vue-i18n'

// import apis
import { $getRoleData, $updateRole } from '@/api/bms/permission/role'
import { $getSystemList } from '@/api/bms/system/system'
import { $getMenuList } from '@/api/bms/system/menu'
import { $getOrganList } from '@/api/bms/permission/organ'

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

// const menu tree ref
const menuTreeRef = ref()

// const menu check keys
const menuCheckKeys = ref([])

// const organ tree ref
const organTreeRef = ref()

// const organ check keys
const organCheckKeys = ref([])

// const form ref
const formRef = ref()

// const organ list
const organList = ref()

// const system list
const systemList = ref()

// const menu list
const menuList = ref()

// const role
const role = reactive({
	roleId: '',
	systemId: '',
	organId: '',
	roleCode: '',
	roleName: '',
	dataScope: '',
	assistSearch: '',
	sort: 0,
	remark: '',
	menuIdList: [],
	organIdList: [],
})

// const rules
const rules = ref({
	systemId: [{ label:'系统编号', valid:'r|double|l-le20', lang:t, validator:validator, trigger:'blur' }],
	organId: [{ label:'机构编号', valid:'r|double|l-le20', lang:t, validator:validator, trigger:'blur' }],
	roleCode: [{ label:'角色编码', valid:'r|l-le200', unique:{ code:'bms.permission.role.role_code.update', args:[role.roleId] }, lang:t, validator:validator, trigger:'blur' }],
	roleName: [{ label:'角色名称', valid:'r|l-le400', lang:t, validator:validator, trigger:'blur' }],
	dataScope: [{ label:'数据范围', valid:'l-le2', lang:t, validator:validator, trigger:'blur' }],
	assistSearch: [{ label:'辅助查询', valid:'l-le400', lang:t, validator:validator, trigger:'blur' }],
	sort: [{ label:'排序码', valid:'r|integer|l-le11', lang:t, validator:validator, trigger:'blur' }],
	remark: [{ label:'备注', valid:'l-le200', lang:t, validator:validator, trigger:'blur' }],
})

/**
 * init
 */
const init = (roleId)=>{
	// set visible
	visible.value = true
	// get system list
	getSystemList()
	// get organ list
	getOrganList()
	// get role data
	getRoleData(roleId)
}

/**
 * get role data
 * @param roleId
 */
const getRoleData = async (roleId) => {
	// get role data
	let handler = await $getRoleData(roleId)
	// set role data
	Object.assign(role, handler.data)
	// set menu check keys
	menuCheckKeys.value = role.menuIdList
	// set organ check keys
	organCheckKeys.value = role.organIdList
	// load menu
	await systemChange()
}

/**
 * get system list
 */
const getSystemList = async () => {
	// get system list
	let handler = await $getSystemList()
	// set system datas
	systemList.value = handler.data
}

/**
 * system change
 */
const systemChange = async () => {
	// has system id
	if(role.systemId){
		// get menu list
		let handler = await $getMenuList(role.systemId)
		// set menu list
		menuList.value = handler.data
	}else{
		// clear
		menuList.value = []
	}
}

/**
 * get organ list
 */
const getOrganList = async () => {
	// get organ list
	let handler = await $getOrganList()
	// set organ datas
	organList.value = handler.data
}

/**
 * reset
 */
const reset = ()=>{
	// has form ref
	if (formRef.value) {
		// reset
		formRef.value.resetFields()
	}
}

/**
 * update role
 */
const updateRole = ()=>{
	// valid
	formRef.value.validate((valid:boolean)=>{
		// not valid
		if(!valid){
			return false
		}
		// set menu id list
		role.menuIdList = menuTreeRef.value?.getCheckedKeys()||[]
		// set organ id list
		role.organIdList = organTreeRef.value?.getCheckedKeys()||[]
		// update role
		$updateRole(role).then(()=>{
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