<template>
	<!-- container -->
	<div class="sw-container" v-bind="$attrs">
		<slot></slot>
	</div>
</template>

<script setup name="SwContainer">
// cancel inherit attrs
defineOptions({ inheritAttrs: false })
</script>

<style lang="scss" scope>
.sw-container{
	display:flex;flex-direction:column;height:100%;width:100%;padding:3px;
}
</style>