// ChartMetric.vue
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
  <div v-if="metrics && metrics.length > 0" class="mt-2 text-xs flex flex-wrap gap-4 justify-end">
    <div v-for="(metric, index) in metrics" :key="index" class="flex items-center">
      <span class="font-medium">{{ metric.label }}:</span>
      <span class="ml-2 px-4 bg-gray-100 rounded-md">
        {{ metric.prefix }}{{ metric.value }}{{ metric.suffix }}
      </span>
    </div>
  </div>
</template>
