<template>
	<!-- container -->
	<el-container :class="`container ${appStore.size}`">
		<!-- aside -->
		<el-aside :class="`aside-container ${appStore.sidebar?'':'collapsed'}`">
			<!-- logo -->
			<Logo class="logo"></Logo>
			<!-- sidebar -->
			<Sidebar class="sidebar"></Sidebar>
		</el-aside>
		<!-- index -->
		<el-container class="index-container">
			<!-- header -->
			<Header class="header"></Header>
			<!-- tab -->
			<Tab class="tab"></Tab>
			<!-- main -->
			<Main class="main"></Main>
		</el-container>
	</el-container>
</template>

<script setup lang="ts">
// import components
import Logo from '@/views/core/base/layout/main/Logo.vue'
import Sidebar from '@/views/core/base/layout/main/Sidebar.vue'
import Header from '@/views/core/base/layout/main/Header.vue'
import Tab from '@/views/core/base/layout/main/Tab.vue'
import Main from '@/views/core/base/layout/main/Main.vue'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()
</script>

<style lang="scss" scoped>

/** normal */
.container{

	height:100%;
	display:flex;
	flex-direction:row;
	user-select:none;
	
	.aside-container{

		width:240px;
		display:flex;
		flex-direction:column;

		.logo{
			height:56px;
		}

		&.collapsed{
			width:56px;
		}
		
	}
	
	.index-container{
		
		display:flex;
		flex-direction:column;
		
		.header{
			height:56px;
			user-select:none;
		}

		.main{
			flex:1;
		}
		
	}

}

/** large */
.container.large{
	
	.aside-container{
		
		width:280px;

		.logo{
			height:64px;
		}

		&.collapsed{
			width:64px;
		}
		
	}

	.index-container{
		
		.header{
			height:64px;
		}
		
	}
	
}

/** small */
.container.small{
	
	.aside-container{
		
		width:200px;

		.logo{
			height:48px;
		}

		&.collapsed{
			width:48px;
		}
		
	}

	.index-container{
		
		.header{
			height:48px;
		}
		
	}
	
}

</style>