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
      external: function (context) {
        const tooltipEl = document.getElementById('chartjs-tooltip')
        if (!context.tooltip.opacity) {
          if (tooltipEl) {
            tooltipEl.style.opacity = '0'
          }
          return
        }

        const position = context.chart.canvas.getBoundingClientRect()
        if (!tooltipEl) {
          const newTooltip = document.createElement('div')
          newTooltip.id = 'chartjs-tooltip'
          newTooltip.style.background = 'rgba(0, 0, 0, 0.7)'
          newTooltip.style.borderRadius = '3px'
          newTooltip.style.color = 'white'
          newTooltip.style.padding = '6px'
          newTooltip.style.position = 'absolute'
          newTooltip.style.pointerEvents = 'none'
          document.body.appendChild(newTooltip)
        }

        const tooltipRoot = document.getElementById('chartjs-tooltip')
        if (tooltipRoot) {
          tooltipRoot.style.opacity = '0'
          tooltipRoot.style.left = position.left + context.tooltip.caretX + 'px'
          tooltipRoot.style.top = position.top + context.tooltip.caretY + 'px'
          tooltipRoot.style.transform = 'translate(-50%, -100%)'
          tooltipRoot.innerHTML = context.tooltip.body[0].lines[0]
        }
      },
    },
    legend: {
      position: 'top',
      align: 'center',
      labels: {
        boxWidth: 16,
        boxHeight: 10,
        padding: 8,
        usePointStyle: false,
      },
      onClick: function (e, legendItem, legend) {
        const chart = legend.chart
        const index = legendItem.datasetIndex

        // Si todos están ocultos o solo el actual está visible, mostrar todos
        const allHiddenOrOnlyCurrentVisible = chart.data.datasets.every(
          (dataset, i) => (i === index ? !dataset.hidden : dataset.hidden),
        )

        if (allHiddenOrOnlyCurrentVisible) {
          // Mostrar todos los datasets
          chart.data.datasets.forEach((dataset) => {
            dataset.hidden = false
          })
        } else {
          // Ocultar todos excepto el seleccionado
          chart.data.datasets.forEach((dataset, i) => {
            dataset.hidden = i !== index
          })
        }

        chart.update()
      },
      onHover: function (event, legendItem, legend) {
        const index = legendItem.datasetIndex
        const dataset = legend.chart.data.datasets[index]

        const mesesConDatos = dataset.data
          .map((valor, idx) => ({
            mes: legend.chart.data.labels[idx],
            valor,
            index: idx,
          }))
          .filter((item) => item.valor > 0)

        if (mesesConDatos.length > 0) {
          const tooltipContent = mesesConDatos.map((mes) => {
            return {
              label: `${legendItem.text} (${mes.mes}): ${mes.valor}`,
              datasetIndex: index,
              index: mes.index,
            }
          })

          const tooltip = legend.chart.tooltip
          tooltip.setActiveElements(
            [
              {
                datasetIndex: index,
                index: mesesConDatos[0].index,
              },
            ],
            {
              x: event.x,
              y: event.y,
            },
          )

          const tooltipModel = {
            dataPoints: tooltipContent,
            caretX: event.x,
            caretY: event.y - 10,
          }

          tooltip._active = tooltipModel.dataPoints
          tooltip.update(true)
          legend.chart.update()
        }
      },
      onLeave: function (event, legendItem, legend) {
        legend.chart.tooltip.setActiveElements([], {})
        legend.chart.update()
      },
    },
  },
})
</script>

<template>
  <BerlinZoomableCard title="Eventos por mes">
    <div v-if="chartResponse">
      <BerlinChartLabel
        v-if="chartResponse"
        title="Eventos por mes"
        :value="chartResponse.metadata.totalEvents"
      />
      <div class="flex w-full justify-between">
        <div></div>
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
