<template>
	<!-- theme: vertical -->
	<Vertical v-if="appStore.theme.global.layout=='vertical'"></Vertical>
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
import Vertical from '@/views/core/base/layout/theme/Vertical.vue'
import Setting from '@/views/core/base/layout/main/Setting.vue'
import UserInfo from '@/views/core/base/profile/UserInfo.vue'
import ChangePassword from '@/views/core/base/profile/ChangePassword.vue'
import Auth from '@/views/core/base/profile/Auth.vue'

// import stores
import { useAppStore } from '@/stores/app'

// get stores
const appStore = useAppStore()
</script>