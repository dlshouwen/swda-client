<template>
	<div v-if="icon" class="sw-icon">
		<svg :class="`${className}`" :style="`color:${color};width: ${size};height: ${size}`" aria-hidden="true">
			<use :xlink:href="iconName" />
		</svg>
	</div>
</template>

<script setup lang="ts" name="SwIcon">
// import vue elements
import { computed } from 'vue'

// defined props
const props = defineProps({
	icon: {
		type: String,
		default: ''
	},
	color: {
		type: String,
		default: ''
	},
	className: {
		type: String,
		default: ''
	},
	size: {
		type: String,
		default: ''
	}
})

// computed icon name
const iconName = computed(() => `#icon-${props.icon.replace('icon-', '')}`)
</script>

<style lang="scss" scoped>
/** sw-icon */
.sw-icon {

	display: inline-block;
	
	/** svg */
	svg {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
		flex-shrink: 0;
	}

}
</style>
