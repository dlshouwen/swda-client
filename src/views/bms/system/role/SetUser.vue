<template>
	<!-- container -->
	<div class="container">
		<!-- search -->
		<div class="panel search-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="search">查询面板</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="default" :underline="false" icon="search" @click.stop="load" divider>查询 (Q)</sw-link>
					<sw-link class="link-layout" type="warning" :underline="false" icon="refresh-left" @click.stop="reset">重置 (R)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div class="search">
					<label>用户编号：</label>
					<span><el-input v-model="search.eq_user_id" placeholder="请输入用户编号"></el-input></span>
					<label>用户编码：</label>
					<span><el-input v-model="search.lk_user_code" placeholder="请输入用户编码"></el-input></span>
					<label>用户名称：</label>
					<span><el-input v-model="search.lk_user_name" placeholder="请输入用户名称"></el-input></span>
					<label style="flex-basis:42px;">启用：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_is_enable" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.zero_one" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label style="flex-basis:42px;">性别：</label>
					<span style="flex-basis:60px;">
						<el-select v-model="search.eq_sex" placeholder="">
							<el-option key="" label="" value=""></el-option>
							<el-option v-for="(value, key) in dataStore.dict.sex" :key="key" :label="value" :value="key"></el-option>
						</el-select>
					</span>
					<label>辅助查询：</label>
					<span style="flex:1;"><el-input style="width:100%;" v-model="search.lk_assist_search" placeholder="请输入辅助查询"></el-input></span>
				</div>
			</div>
		</div>
		<!-- datas -->
		<div class="panel data-panel">
			<div class="panel-header">
				<div class="panel-title">
					<el-link icon="user">配置用户</el-link>
				</div>
				<div class="panel-btns">
					<sw-link class="link-layout" type="success" :underline="false" icon="check" @click.stop="setRoleUser();" permission="bms:system:role:set_user">配置用户 (S)</sw-link>
				</div>
			</div>
			<div class="panel-body">
				<div id="grid_container" class="grid-container" ref="gridContainer">
					<!-- grid -->
					<sw-grid ref="userGrid" id="user_list" title="用户列表" url="/bms/system/role/set_user/list" row-key="userId" :params="params" :search="search" :height="height"
						@row-dblclick="row=>{updateUser(row.userId)}" @selection-change="selection=>{selectUsers=selection}" @grid-completed="gridCompleted">
						<sw-column type="selection" key="userId" width="28" :fast="false" :advance="false" :export="false" :print="false"></sw-column>
						<sw-column id="organName" label="所属机构" width="140" fast="lk" info></sw-column>
						<sw-column id="userId" label="用户编号" width="100" data-type="number" fast="eq"></sw-column>
						<sw-column id="userCode" label="用户编码" width="100" fast="lk"></sw-column>
						<sw-column id="userName" label="用户名称" width="100" fast="lk"></sw-column>
						<sw-column id="passwordExpireTime" label="过期时间" width="100" data-type="date" otype="string" oformat="yyyy-MM-dd" format="yyyy-MM-dd" fast="range"></sw-column>
						<sw-column id="isEnable" label="启用" width="60" :dict="dataStore.dict.zero_one" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="sex" label="性别" width="60" :dict="dataStore.dict.sex" fast="eq" fast-type="radio"></sw-column>
						<sw-column id="cardId" label="证件号" width="140" fast="lk"></sw-column>
						<sw-column id="phone" label="联系电话" width="90" fast="lk"></sw-column>
						<sw-column id="email" label="电子邮箱" width="160" fast="lk"></sw-column>
						<sw-column id="address" label="联系地址" width="180" fast="lk"></sw-column>
						<sw-column id="remark" label="备注" width="120" fast="lk"></sw-column>
						<sw-column id="creatorName" label="创建人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="createTime" label="创建时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
						<sw-column id="editorName" label="编辑人" width="80" data-type="number" fast="lk" info></sw-column>
						<sw-column id="editTime" label="编辑时间" width="120" data-type="date" otype="string" oformat="yyyy-MM-dd hh:mm:ss" format="yyyy-MM-dd hh:mm" fast="range"></sw-column>
					</sw-grid>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
// import vue: ref & reactive & to refs & watch & next tick & on mounted
import { ref, reactive, toRefs, watch, nextTick, onMounted } from 'vue'

// import requests: set role user
import { $setRoleUser } from '@/assets/config/api';

// import element plus: message, message box
import { ElMessage, ElMessageBox } from 'element-plus'

// import key
import key from 'keymaster';

// import tool
import * as tool from '@/assets/utils/tool';

// import store: data
import { useDataStore } from '@/store/data'
// get store: data
const dataStore = useDataStore();

// const state
const state = reactive({
	// height
	height: 480,
	// params
	params: {roleId: props.roleId},
	// search
	search: { eq_user_id: '', lk_user_code: '', lk_user_name: '', eq_is_enable: '', eq_sex: '', lk_assist_search: '' },
	// show
	selectUsers: [],
});

// to refs
const { height, params, search, selectUsers } = toRefs(state);

// props
const props = defineProps(['roleId']);

// ref
const userGrid = ref();
const gridContainer = ref();

/**
 * reset
 */
const reset = () => {
	state.search = { eq_user_id: '', lk_user_code: '', lk_user_name: '', eq_is_enable: '', eq_sex: '', lk_assist_search: '' };
}

/**
 * load
 */
const load = () => {
	userGrid.value.load();
}

/**
 * grid completed
 */
const gridCompleted = () => {
	// next tick
	nextTick(()=>{
		// set select users is empty
		state.selectUsers = [];
		// clear selection
		userGrid.value.clearSelection();
		// set selection
		userGrid.value.datas.exhibit.forEach(data=>{ userGrid.value.toggleRowSelection(data, data.info.checked=='1'); });
	});
}

/**
 * set role user
 */
const setRoleUser = () => {
	// confirm
	ElMessageBox.confirm('确定配置用户角色信息吗？', '警告').then(()=>{
		// get insert user ids
		let insertUserIds = state.selectUsers.map(data=>data.userId).join(',');
		// get delete user ids
		let deleteUserIds = userGrid.value.datas.origin.map(data=>data.userId).join(',');
		// set role user
		$setRoleUser({roleId:props.roleId, insertUserIds:insertUserIds, deleteUserIds:deleteUserIds}).then(handler=>{
			// success
			if(handler.data.result){
				// message
				ElMessage.success(handler.data.message);
				// load
				load();
			}
		});
	}).catch(()=>{});
}

// watch
watch(()=>state.search, ()=>{ load() }, {deep: true}) 
watch(()=>props.roleId, (value)=>{
	state.params.roleId = value
	load()
}, {deep: true}) 

// load data
onMounted(()=>{
	load();
})

// hotkey
key('alt+q', ()=>{ load();return false; });
key('alt+r', ()=>{ reset();return false; });
key('alt+s', ()=>{ setRoleUser();return false; });
</script>