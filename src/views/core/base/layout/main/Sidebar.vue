<template>
	<!-- sidebar -->
	<el-scrollbar :class="`sidebar ${appStore.size}`">
		<!-- menu -->
		<el-menu :default-active="router.currentRoute.value.path" mode="vertical" :collapse-transition="false" 
			:collapse="appStore.theme.sidebar.collapse" :unique-opened="appStore.theme.sidebar.unique">
			<!-- sub menu -->
			<el-sub-menu v-for="menu in menus" :index="menu.path" class="sidebar-menu">
				<!-- menu title -->
				<template #title>
					<!-- icon -->
					<sw-icon :icon="menu.icon"></sw-icon>
					<!-- name -->
					<span>{{menu.name}}</span>
				</template>
				<!-- menu items -->
				<el-menu-item :class="`sidebar-menu-item ${appStore.size}`" v-for="children in menu.children" :index="children.path" @click="router.push(children.path)"><sw-icon :icon="children.icon"></sw-icon>{{children.name}}</el-menu-item>
			</el-sub-menu>
		</el-menu>
	</el-scrollbar>
</template>

<script setup lang="ts">
// import vue element
import { computed } from 'vue'

// import vue router
import { useRouter } from 'vue-router'

// import stores
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

// get router
const router = useRouter()

// get stores
const appStore = useAppStore()
const userStore = useUserStore()

// get show menus from user store filter system
const menus = computed(()=>userStore.menuList.filter((menu)=>menu.systemId===userStore.systemId))
</script>

<style lang="scss" scoped>

/** normal */
.sidebar{
	
	background:#263238;
	padding:12px 0;

	::v-deep(.el-menu){
		
		background:#263238;
		border:0;
		width:100%;

		.sw-icon{
			font-size:16px;
			margin-right:14px;
		}
		
		.el-sub-menu__title {
			
			display:flex;
			flex-direction:row;
			align-items:center;
			background:#263238;
			padding-left:18px;
			height:48px;
			font-size:14px;
			color:white;
			border:0;
			
			&:hover{
				background:none;
				color:#ddd;
			}
		
		}
		
		.el-menu-item {

			display:flex;
			flex-direction:row;
			align-items:center;
			background:#263238;
			height:48px;
			font-size:14px;
			color:white;
			border:0;
				
			&:hover{
				background:#263238;
				color:#ddd;
			}
			
			&.is-active{
				background:var(--el-color-primary);
				color:white;
			}
			
		}
		
	}

}

.sidebar-menu-item{

	.sw-icon{
		font-size:16px;
		margin-right:14px;
	}
	
}

/** large */
.sidebar.large{
	
	padding:18px 0;

	::v-deep(.el-menu){
		
		.sw-icon{
			font-size:18px;
			margin-right:16px;
		}
		
		.el-sub-menu__title {
			padding-left:20px;
			height:56px;
			font-size:16px;
		}
		
		.el-menu-item {
			height:56px;
			font-size:16px;
		}
		
	}

}

.sidebar-menu-item.large{

	.sw-icon{
		font-size:18px;
		margin-right:16px;
	}
	
}

/** small */
.sidebar.small{
	
	padding:12px 0;

	::v-deep(.el-menu){
		
		.sw-icon{
			font-size:14px;
			margin-right:12px;
		}
		
		.el-sub-menu__title {
			padding-left:14px;
			height:40px;
			font-size:12px;
		}
		
		.el-menu-item {
			height:40px;
			font-size:12px;
		}
		
	}

}

.sidebar-menu-item.small{

	.sw-icon{
		font-size:14px;
		margin-right:12px;
	}
	
}

</style>