<template>
	<!-- container -->
	<el-container class="container" direction="vertical">
		<!-- search container -->
		<el-card class="panel">
			<el-form :model="grid.query.manualQueryParameters" :inline="true">
				<el-form-item label="岗位编号">
					<el-input v-model="grid.query.manualQueryParameters.eq_post_id" placeholder="请输入岗位编号" clearable style="width:130px" />
				</el-form-item>
				<el-form-item label="岗位名称">
					<el-input v-model="grid.query.manualQueryParameters.lk_postname" placeholder="请输入岗位名称" clearable style="width:130px" />
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click="reset"><sw-icon icon="redo"></sw-icon>重置</el-button>
					<el-button type="primary" @click="search"><sw-icon icon="search"></sw-icon>查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<!-- grid container -->
		<el-card class="panel panel-auto">
			<!-- operate -->
			<el-row class="panel-operate">
				<el-col class="left" :span="12">
					<el-button type="default" @click="search"><sw-icon icon="sync"></sw-icon>刷新</el-button>
				</el-col>
				<el-col class="right" :span="12">
					<el-button type="primary" @click="addPost"><sw-icon icon="plus"></sw-icon>新增</el-button>
					<el-button type="warning" @click="updatePost()"><sw-icon icon="edit"></sw-icon>编辑</el-button>
					<el-button type="danger" @click="deletePost()"><sw-icon icon="delete"></sw-icon>删除</el-button>
				</el-col>
			</el-row>
			<!-- grid -->
			<el-row ref="gridContainerRef" class="panel-grid">
				<el-table ref="gridRef" :data="grid.datas" border stripe :height="grid.option.height" @selection-change="gridSelectionChange">
					<el-table-column type="selection" align="center" width="55" />
					<el-table-column label="操作" width="120" align="center">
						<template #default="scope">
							<el-button link type="warning" @click="updatePost(scope.row.postId)">编辑</el-button>
							<el-button link type="danger" @click="deletePost(scope.row.postId)">删除</el-button>
						</template>
					</el-table-column>
					<el-table-column label="岗位编号" prop="postId" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="岗位编码" prop="postCode" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="岗位名称" prop="postName" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="状态" prop="status" width="120" align="center" sortable show-overflow-tooltip>
						<template #default="scope">
							<el-tag :type="appStore.dict.open_close[scope.row.status].style">{{appStore.dict.open_close[scope.row.status].label}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="排序" prop="sort" width="90" align="center" sortable show-overflow-tooltip />
					<el-table-column label="备注" prop="remark" width="120" align="center" sortable show-overflow-tooltip />
					<el-table-column label="创建时间" prop="createTime" width="180" align="center" sortable show-overflow-tooltip />
				</el-table>
			</el-row>
			<!-- pagination -->
			<el-row class="panel-pagination">
				<el-pagination v-model:current-page="grid.query.page.current" v-model:page-size="grid.query.page.size" :page-sizes="grid.option.sizes"
					:layout="grid.option.layout" :total="grid.total" @size-change="search" @current-change="search" />
			</el-row>
		</el-card>
	</el-container>
	<!-- add post -->
	<AddPost ref="addPostRef" @callback="search"></AddPost>
	<!-- update post -->
	<UpdatePost ref="updatePostRef" @callback="search"></UpdatePost>
</template>

<script setup lang="ts">
// import vue elements
import { ref, reactive, onMounted, nextTick } from 'vue'

// import element plus elements
import { ElMessage, ElMessageBox } from 'element-plus'

// import components
import AddPost from './AddPost.vue'
import UpdatePost from './UpdatePost.vue'

// import apis
import { $getPostPageResult, $deletePost } from '@/api/bms/permission/post' 
import { $getRegionList } from '@/api/bms/system/region' 

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()

// const grid container ref
const gridContainerRef = ref(null)

// const grid ref
const gridRef = ref(null)

// const grid
const grid = reactive({
	option: {
		height: '200px',
		sizes: [50, 100, 500, 1000],
		layout: 'total, sizes, prev, pager, next, jumper'
	},
	selects: [],
	total: 0,
	datas: [],
	query: {
		page: {
			size: 50,
			current: 1
		},
		manualQueryParameters: {},
		fastQueryParameters: {},
		advanceQueryConditions: [],
		advanceQuerySorts: [],
	}
});

// mounted
onMounted(() => {
	// search
	search()
	// resize height
	grid.option.height = gridContainerRef.value.$el.clientHeight+ 'px'
	// resize
    window.onresize = () => {
		// resize height
        grid.option.height = gridContainerRef.value.$el.clientHeight + 'px'
    }
})

/**
 * reset
 */
const reset = ()=>{
	// reset
	grid.query.manualQueryParameters = {}
}

/**
 * search
 */
const search = ()=>{
	// get post page result
	$getPostPageResult(grid.query).then(handler=>{
		// set total
		grid.total = handler.data.total
		// set datas
		grid.datas = handler.data.datas
	})
}

/**
 * grid selection change
 */
const gridSelectionChange = (datas)=>{
	// set select
	grid.selects = datas
}

// add post ref
const addPostRef = ref()

/**
 * add post
 */
const addPost = ()=>{
	// add post init
	addPostRef.value.init();
}

// update post ref
const updatePostRef = ref()

/**
 * update post
 */
const updatePost = (postId)=>{
	// no post id
	if(!postId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个岗位。', type: 'warning' })
			// return
			return
		}
		// select more then 1
		if(grid.selects.length>1){
			// warning
			ElMessage({ message: '只能选择一个岗位。', type: 'warning' })
			// return
			return
		}
		// set post id
		postId = grid.selects[0].postId
	}
	// update post init
	updatePostRef.value.init(postId);
}

/**
 * delete post
 */
const deletePost = (postId)=>{
	// defined post ids
	let postIds = []
	// no post id
	if(!postId){
		// no select
		if(grid.selects==null||grid.selects.length<=0){
			// warning
			ElMessage({ message: '至少选择一个岗位。', type: 'warning' })
			// return
			return
		}
		// set post id
		postIds = grid.selects.map(select=>select.postId)
	}else{
		// push post id
		postIds.push(postId)
	}
	// confirm
	ElMessageBox.confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
		// delete post
		$deletePost(postIds).then(handler=>{
			// message
			ElMessage.success({ message: '操作成功', duration: 500, onClose: () => {
				// search
				search()
			}})
		})
	})
}
</script>