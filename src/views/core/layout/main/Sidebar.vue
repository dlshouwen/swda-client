<template>
	<el-menu default-active="2" class="el-menu-vertical-demo">
		<el-sub-menu v-for="menu in menus" :index="menu.path">
			<template #title>
				<el-icon><location /></el-icon>
				<span>{{menu.name}}</span>
			</template>
			<el-menu-item-group>
				<el-menu-item v-for="children in menu.children" :index="children.path" @click="menuClick(children)">{{children.name}}</el-menu-item>
			</el-menu-item-group>
		</el-sub-menu>
	</el-menu>
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