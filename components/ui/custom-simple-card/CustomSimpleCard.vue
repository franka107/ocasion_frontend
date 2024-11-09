<template>
	<div class="bg-white shadow-sm rounded-lg p-6">
		<h2 class="text-xl font-bold">{{ props.title }}</h2>
		<p class="text-gray-600">{{ props.subTitle }}</p>
	</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
	title: string,
	subTitle: string
}>()
</script>
