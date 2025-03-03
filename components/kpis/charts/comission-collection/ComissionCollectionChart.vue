<script setup lang="ts">
import type { ChartOptions } from 'chart.js'
import { Bar, Line } from 'vue-chartjs'
import BerlinActivityCard from '~/design-system/berlin/cards/activity-card/BerlinActivityCard.vue'
import BerlinChart from '~/design-system/berlin/chart/BerlinChart.vue'
import BerlinLoader from '~/design-system/berlin/loader/BerlinLoader.vue'
import Card from '~/design-system/ui/card/Card.vue'
import Dialog from '~/design-system/ui/dialog/Dialog.vue'
import DialogContent from '~/design-system/ui/dialog/DialogContent.vue'
import DialogHeader from '~/design-system/ui/dialog/DialogHeader.vue'
import DialogClose from '~/design-system/ui/dialog/DialogClose.vue'
import BerlinZoomableCard from '~/design-system/berlin/cards/zoomable-card/BerlinZoomableCard.vue'
import BerlinChartLabel from '~/design-system/berlin/labels/chart-label/BerlinChartLabel.vue'

const props = defineProps<{
  organizationIds: string[]
  startDate: Date
  endDate: Date
}>()

const graphicsService = useGraphicsService()

const chartResponse = ref<ChartResponse | null>(null)

watchEffect(async () => {
  chartResponse.value = null
  if (!props.organizationIds.length || !props.startDate || !props.endDate)
    return

  const response = await graphicsService.viewComissionCollection({
    organizationIds: props.organizationIds,
    startDate: props.startDate,
    endDate: props.endDate,
  })

  chartResponse.value = response.data.value
})

const chartOptions = ref({
  maintainAspectRatio: true,
  responsive: true,
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
  },
  scales: {
    x: { title: { display: true, text: 'Mes' } },
    y: { title: { display: true, text: 'Monto (en miles)' } },
  },
})
// const chartOptions = ref({
//   responsive: true,
//   maintainAspectRatio: true,
//   scales: {
//     x: {
//       title: {
//         display: true,
//         text: 'Mes',
//       },
//     },
//     y1: {
//       type: 'linear',
//       position: 'left',
//       title: {
//         display: true,
//         text: 'Monto (en miles)',
//       },
//       ticks: {
//         callback: (value) => `${value.toFixed(2)}k`,
//       },
//     },
//     y2: {
//       type: 'linear',
//       position: 'right',
//       title: {
//         display: true,
//         text: 'Cantidad de Ofertas',
//       },
//       grid: {
//         drawOnChartArea: false,
//       },
//     },
//   },
//   plugins: {
//     legend: {
//       position: 'top',
//       labels: {
//         boxWidth: 16,
//         boxHeight: 10,
//       },
//     },
//     tooltip: {
//       enabled: true,
//       callbacks: {
//         label: (tooltipItem) => {
//           if (tooltipItem.dataset.yAxisID === 'y1') {
//             return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}k`
//           }
//           return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
//         },
//       },
//     },
//   },
// })
</script>

<template>
  <BerlinZoomableCard title="Valor promedio ofertas">
    <div v-if="chartResponse">
      <!-- <div class="flex mb-2 w-full flex-row-reverse justify-between"> -->
      <!--   <BerlinChartLabel -->
      <!--     v-if="chartResponse" -->
      <!--     title="Valor promedio total" -->
      <!--     :value="`${chartResponse.metadata.totalAverage}k`" -->
      <!--   /> -->
      <!-- </div> -->
      <Line
        v-if="chartResponse"
        :data="chartResponse.data"
        :options="chartOptions"
      />
    </div>
    <BerlinLoader v-else />
  </BerlinZoomableCard>
</template>
