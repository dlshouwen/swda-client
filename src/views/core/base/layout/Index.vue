<template>
	<!-- container -->
	<el-container :class="`container ${appStore.size}`">
		<!-- aside -->
		<el-aside :class="`aside-container ${appStore.theme.sidebar.collapse?'collapsed':''}`">
			<!-- logo -->
			<Logo v-if="appStore.theme.logo" class="logo"></Logo>
			<!-- sidebar -->
			<Sidebar class="sidebar"></Sidebar>
		</el-aside>
		<!-- index -->
		<el-container class="index-container">
			<!-- header -->
			<Header class="header"></Header>
			<!-- tab -->
			<Tab v-if="appStore.theme.tab.enable" class="tab"></Tab>
			<!-- main -->
			<Main class="main"></Main>
		</el-container>
	</el-container>
	<!-- setting -->
	<Setting />
	<!-- profile -->
	<UserInfo />
	<ChangePassword />
	<Auth />
</template>

<script setup lang="ts">
// import vue elements
import { computed } from 'vue'

// import components
import Logo from '@/views/core/base/layout/main/Logo.vue'
import Sidebar from '@/views/core/base/layout/main/Sidebar.vue'
import Header from '@/views/core/base/layout/main/Header.vue'
import Tab from '@/views/core/base/layout/main/Tab.vue'
import Main from '@/views/core/base/layout/main/Main.vue'

// import components
import Setting from '@/views/core/base/layout/main/Setting.vue'
import UserInfo from '@/views/core/base/profile/UserInfo.vue'
import ChangePassword from '@/views/core/base/profile/ChangePassword.vue'
import Auth from '@/views/core/base/profile/Auth.vue'

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