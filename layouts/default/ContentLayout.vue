<script setup lang="ts">
import Navbar from './Navbar.vue';
const props = defineProps<{
	title:string
	customClass?: string
	showArrow?: boolean;
}>()
</script>

<template>
	<div>
      <Navbar :title="props.title" :showArrow="props.showArrow" />
      <div :class="['container pt-4 pb-8 px-4 sm:px-8', props.customClass]">
				<slot/>
			</div>
    </div>
</template>