<template>
	<!-- container -->
	<el-container>
		<!-- header -->
		<el-header height="32px">
			<Header :toggleAside="toggleAside" :isAsideshow="show.aside"></Header>
		</el-header>
		<!-- container -->
		<el-container>
			<!-- aside -->
			<el-aside width="200px" v-show="show.aside">
				<Sidebar></Sidebar>
			</el-aside>
			<!-- main -->
			<el-main class="main-container">
				<!-- tab -->
				<div class="tab-container">
					<Tab></Tab>
				</div>
				<!-- page-->
				<div class="page-container">
					<router-view v-slot="{ Component }">
						<keep-alive>
							<component :is="Component" />
						</keep-alive>
					</router-view>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
// import vue: reactive & to refs
import { reactive, toRefs } from 'vue'

// import components: header & sidebar & tab
import Header from '@/views/core/layout/Header';
import Sidebar from '@/views/core/layout/Sidebar';
import Tab from '@/views/core/layout/Tab';

// state
const state = reactive({
	// show
	show: { aside: true }
});

// to refs
const { show } = toRefs(state);

/**
 * toggle aside
 * @param status
 */
const toggleAside = (status) => {
	// set aside status
	state.show.aside = status;
}
</script>

<style scoped>
/** container */
.el-container {padding: 0;margin: 0;height: 100%;}
/** header */
.el-header{padding:0;height:32px;}
/** main */
.el-main{padding:0;}

/** main container */
.main-container{display:flex;flex-direction: column;}
/** tab container */
.tab-container{flex-basis: 28px;}
/** page container */
.page-container{flex:1;}
</style>