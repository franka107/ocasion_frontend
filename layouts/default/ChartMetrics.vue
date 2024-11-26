
<script setup lang="ts">
interface Metric {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
}

interface Props {
  metrics?: Metric[];
}

defineProps<Props>();
</script>

<template>
  <div v-if="metrics && metrics.length > 0" class=" mr-4 mb-4 text-xs flex flex-wrap gap-6 justify-end">
    <div
      v-for="(metric, index) in metrics"
      :key="index"
      class="flex flex-col items-center text-center"
    >
      <span class="font-medium mr-6 text-gray-600">{{ metric.label }}</span>
      <span class="text-sm font-bold text-gray-900 ">
        {{ metric.prefix || '' }}{{ metric.value }}{{ metric.suffix || '' }}
      </span>
    </div>
  </div>
</template>
