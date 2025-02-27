<script setup lang="ts">
import type { ChartOptions } from 'chart.js'
import { ref, computed, onMounted } from 'vue'
import { ExpandIcon } from 'lucide-vue-next' // Icono de expansión
import { Bar } from 'vue-chartjs'
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
const isDialogOpen = ref(false)

watchEffect(async () => {
  chartResponse.value = null
  if (!props.organizationIds.length || !props.startDate || !props.endDate)
    return

  const response = await graphicsService.viewEventsPerMonth({
    organizationIds: props.organizationIds,
    startDate: props.startDate,
    endDate: props.endDate,
  })

  chartResponse.value = response.data.value
})

const chartOptions = ref<ChartOptions<any>>({
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
      suggestedMax: (context) => {
        const maxValue = Math.max(
          ...context.chart.data.datasets.flatMap((d) => d.data),
        )
        return maxValue + 1
      },
      grid: {
        drawBorder: false,
      },
    },
    x: {
      stacked: true,
      grid: {
        display: true,
        drawBorder: false,
      },
    },
  },
  plugins: {
    tooltip: {
      enabled: true,
      position: 'nearest',
    },
    legend: {
      position: 'top',
      align: 'center',
      labels: {
        generateLabels: function (chart) {
          return chart.data.datasets.map((dataset, i) => {
            // Calcular la suma total del dataset
            const total = dataset.data.reduce((sum, value) => sum + value, 0)

            return {
              text: `${dataset.label} (${total})`, // Agregamos el total al nombre
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              lineWidth: 0,
              hidden: !chart.isDatasetVisible(i),
              datasetIndex: i,
            }
          })
        },
      },
    },
  },
})
</script>

<template>
  <BerlinZoomableCard title="Valor promedio ofertas">
    <div v-if="chartResponse">
      <div class="flex mb-2 w-full flex-row-reverse justify-between">
        <BerlinChartLabel
          v-if="chartResponse"
          title="Eventos por mes"
          :value="chartResponse.metadata.totalEvents"
        />
      </div>
      <Bar
        v-if="chartResponse"
        :data="chartResponse.data"
        :options="chartOptions"
      />
    </div>
    <BerlinLoader v-else />
  </BerlinZoomableCard>
</template>
