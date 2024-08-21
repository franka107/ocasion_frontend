<script setup lang="ts">
import Navbar from './Navbar.vue';
const props = defineProps<{
	title:string
}>()
</script>

<template>
	<div>
      <Navbar :title="props.title"  />
      <div class="container pt-4 pb-8 px-4 sm:px-8">
				<slot/>
			</div>
    </div>
</template>