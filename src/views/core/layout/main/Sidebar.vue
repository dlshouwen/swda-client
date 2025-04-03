<template>
	<div class="container">
		<el-menu>
			<el-sub-menu v-for="menu in menus" :index="menu.path">
				<template #title>
					<sw-icon :icon="menu.icon"></sw-icon>
					<span>{{menu.name}}</span>
				</template>
				<el-menu-item v-for="children in menu.children" :index="children.path" @click="menuClick(children)"><sw-icon :icon="children.icon"></sw-icon>{{children.name}}</el-menu-item>
			</el-sub-menu>
		</el-menu>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'

const appStore = useAppStore()
const userStore = useUserStore()

const router = useRouter()

const menus = computed(()=>userStore.menuList.filter((menu)=>menu.systemId===userStore.systemId))

const menuClick = (menu) => {
	router.push(menu.path)
}

</script>

<style lang="scss" scoped>
.container{

	background:#263238;
	
	.el-menu{
		
		background:#263238;border:0;width:100%;padding:1rem 0;
		
		::v-deep(.el-sub-menu__title) {
			
			padding-left:1.5rem;height:3rem;line-height:3rem;color:white;font-size:1rem;
			
			.sw-icon{margin-right:0.5rem;}
			
			&:hover{background:none;color:#ddd;}
		
		}
		
		::v-deep(.el-menu-item) {
			
			background:#263238;color:white;height:3rem;line-height:3rem;
				
			.sw-icon{margin-right:0.5rem;}
			
			&:hover{background:#263238;color:#ddd;}
			
			&.is-active{background:#2494f2;}
			
		}
		
	}

}
</style>