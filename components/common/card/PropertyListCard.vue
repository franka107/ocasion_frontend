<template>
  <div class="bg-white rounded-xl p-6 mt-3 lg:mt-0">
    <h2 class="text-xl font-semibold text-primary text-center">
      {{ props.title }}
    </h2>
    <div class="flex mt-8 mx-2 justify-around flex-wrap gap-4">
      <div
        v-for="property in props.propertyList"
        class="flex-1 min-w-[120px] text-center"
      >
        <div class="text-[#64748B] text-sm">{{ property.label }}</div>
        <div class="text-primary text-4xl mt-2">
          {{ property.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
export interface Property {
  label: string;
  value: string;
}

interface Props {
  title: string;
  propertyList: Property[];
}
const props = defineProps<Props>();
</script>
