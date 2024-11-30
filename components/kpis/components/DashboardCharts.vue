<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import Chart, { Legend, plugins } from 'chart.js/auto'
import { JsxEmit, transform } from 'typescript'
import { parse } from 'date-fns'
import ChartModal from './ChartModal.vue'
import type { FilterFormSchema } from './filter-form-schema'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import { useEventManagementAPI } from '~/composables/useEventManagementAPI'
import { useRevenueManagementAPI } from '~/composables/useRevenueManagementAPI'
import type { EventChartData } from '~/composables/useEventManagementAPI'
import ChartMetrics from '~/layouts/default/ChartMetrics.vue'
import type { KpiPlatformParamsDto } from '~/types/Kpi'
import { GlobalType } from '~/types/Common'

const {
  monthlyEvents,
  isLoading,
  error,
  getMonthlyEvents,
  pendingActivities,
  totalEvents,
  getEventsPendingActivities,
} = useEventManagementAPI()

const {
  getMonthlyTopGoods,
  monthlyTopGoods,
  getMonthlyAverageOffers,
  offersTotalAmount,
  monthlyAverageOffers,
} = useKpi()

const { monthlyRevenue, totalAmount, pendingAmount, getMonthlyRevenue } =
  useRevenueManagementAPI()
watch(monthlyRevenue, (newValue) => {})

const { globalType } = useUserSessionExtended()

const props = defineProps<{
  filterFormValues: FilterFormSchema
}>()

const getDateRange = () => {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 11)
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
}

// Variables para el modal
const isModalOpen = ref(false)
const selectedChartIndex = ref<number | null>(null)
const modalChartId = 'modal-chart'
let modalChart: Chart | null = null

interface ChartConfig {
  id: string
  title: string
  createConfig: (data: any) => Chart.ChartConfiguration
}
const chartConfigs: ChartConfig[] = [
  {
    id: 'eventsChart',
    title: 'Eventos por mes',
    createConfig: () => {
      return {
        type: 'bar',
        data: {
          labels: monthlyEvents.value.labels || [],
          datasets:
            monthlyEvents.value.datasets?.map((dataset) => ({
              ...dataset,
              stack: 'Stack 0',
            })) || [],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
                  //newTooltip.style.background = 'rgba(0, 0, 0, 0.7)'
                  newTooltip.style.borderRadius = '3px'
                  newTooltip.style.color = 'white'
                  newTooltip.style.padding = '6px'
                  newTooltip.style.position = 'absolute'
                  newTooltip.style.pointerEvents = 'none'
                  document.body.appendChild(newTooltip)
                }

                const tooltipRoot = document.getElementById('chartjs-tooltip')
                if (tooltipRoot) {
                  tooltipRoot.style.opacity = '1'
                  tooltipRoot.style.left =
                    position.left + context.tooltip.caretX + 'px'
                  tooltipRoot.style.top =
                    position.top + context.tooltip.caretY + 'px'
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
                  (dataset, i) =>
                    i === index ? !dataset.hidden : dataset.hidden,
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
               // legend.chart.tooltip.setActiveElements([], {})
                legend.chart.update()
              },
            },
          },
        },
      }
    },
  },
  ...(globalType === GlobalType.Organization
    ? [
        {
          id: 'amountChart',
          title: 'Monto recaudado por mes',
          createConfig: () => ({
            type: 'line',
            data: {
              labels: monthlyRevenue.value.labels || [],
              datasets:
                monthlyRevenue.value.datasets?.map((dataset) => ({
                  ...dataset,
                  stack: 'Stack 0',
                  borderColor: dataset.borderColor,
                  backgroundColor: dataset.backgroundColor,
                })) || [],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                    callback: function (value) {
                      return '$ ' + value
                    },
                  },
                },
              },
            },
          }),
        },

        {
          id: 'assetsChart',
          title: 'Top 5 sub tipo de bienes',
          // createConfig: () => ({
          //   type: 'bar',
          //   data: '',
          //   options: {
          //     indexAxis: 'y',
          //     responsive: true,
          //     maintainAspectRatio: false,
          //     scales: {
          //       x: {
          //         min: -60,
          //         max: 100,
          //         stacked: true,
          //       },
          //       y: {
          //         stacked: true,
          //       },
          //     },
          //   },
          // }),
          createConfig: () => ({
            type: 'line',
            data: {
              labels: monthlyTopGoods.value.labels || [],
              datasets:
                monthlyTopGoods.value.datasets?.map((dataset) => ({
                  ...dataset,
                  stack: 'Stack 0',
                  borderColor: dataset.borderColor,
                  backgroundColor: dataset.backgroundColor,
                })) || [],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                    callback: function (value) {
                      return '$ ' + value
                    },
                  },
                },
              },
            },
          }),
        },
      ]
    : []),

  {
    id: 'avgOffersChart',
    title: 'Valor promedio de ofertas',
    createConfig: () => ({
      type: 'line',
      data: {
        labels: monthlyAverageOffers.value.labels || [],
        datasets:
          monthlyAverageOffers.value.datasets?.map((dataset) => ({
            ...dataset,
            // stack: 'Stack 0',
            // borderColor: dataset.borderColor,
            // backgroundColor: dataset.backgroundColor,
          })) || [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          Legend: {
            position: 'botton',
            labels: {
              size: 10,
            },
            boxWidth: 12,
            padding: 8,
            wrap: true,
          },
        },
        scales: {
          y: {
            type: 'linear',
            position: 'left',
            min: 0,
            ticks: {
              callback: function (value) {
                return '$ ' + value
              },
            },
          },
          y1: {
            type: 'linear',
            position: 'right',
            min: 0,
            max: 60,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    }),
  },
]

// Funciones para el modal
const openChartModal = async (index: number) => {
  selectedChartIndex.value = index
  isModalOpen.value = true

  await nextTick()
  const ctx = document.getElementById(modalChartId) as HTMLCanvasElement
  if (ctx && selectedChartIndex.value !== null) {
    if (modalChart) {
      modalChart.destroy()
    }
    const config = chartConfigs[selectedChartIndex.value]
    modalChart = new Chart(ctx, config.createConfig(null))
  }
}

const closeModal = () => {
  isModalOpen.value = false
  if (modalChart) {
    modalChart.destroy()
    modalChart = null
  }
}
const updateCharts = () => {
  chartConfigs.forEach((config) => {
    const ctx = document.getElementById(config.id) as HTMLCanvasElement
    if (ctx) {
      const existingChart = Chart.getChart(ctx)
      if (existingChart) {
        existingChart.destroy()
      }

      // Determinar los datos a pasar según el gráfico
      let updatedConfig
      if (config.id === 'eventsChart') {
        updatedConfig = config.createConfig({
          datasets: monthlyEvents.value.datasets,
          labels: monthlyEvents.value.labels,
        })
      } else if (config.id === 'amountChart') {
        updatedConfig = config.createConfig({
          datasets: monthlyRevenue.value.datasets,
          labels: monthlyRevenue.value.labels,
        })
      } else {
        updatedConfig = config.createConfig(null)
      }

      // Crear el gráfico con la configuración actualizada
      new Chart(ctx, updatedConfig)
    }
  })
}
watch(
  [totalEvents, monthlyEvents],
  () => {
    updateCharts()
  },
  { immediate: true },
)

const kpiPlatformParamsDto = computed(() => {
  const formatString = 'yyyy-MM-dd'
  console.log('filterFormValues:', JSON.stringify(props.filterFormValues))
  const transformed: KpiPlatformParamsDto = {
    startDate: parse(
      props.filterFormValues.rangeStart,
      formatString,
      new Date(),
    ),
    endDate: parse(props.filterFormValues.rangeEnd, formatString, new Date()),
    organizationIds: props.filterFormValues.organizations,
  }
  return transformed
})

watch(
  kpiPlatformParamsDto,
  async () => {
    const kpis = [
      getEventsPendingActivities(),
      getMonthlyEvents(kpiPlatformParamsDto.value),
      getMonthlyAverageOffers(kpiPlatformParamsDto.value),
    ]
    if (globalType === GlobalType.Organization) {
      kpis.push(getMonthlyRevenue(kpiPlatformParamsDto.value))
      kpis.push(getMonthlyTopGoods(kpiPlatformParamsDto.value))
    }
    await Promise.all(kpis)
    updateCharts()
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    const kpis = [
      getEventsPendingActivities(),
      getMonthlyEvents(kpiPlatformParamsDto.value),
      getMonthlyAverageOffers(kpiPlatformParamsDto.value),
    ]
    if (globalType === GlobalType.Organization) {
      kpis.push(getMonthlyRevenue(kpiPlatformParamsDto.value))
      kpis.push(getMonthlyTopGoods(kpiPlatformParamsDto.value))
    }
    await Promise.all(kpis)
    updateCharts()
  } catch (e) {
    console.error('Error loading initial data:', e)
  }
})

const getMetricsForChart = (index: number) => {
  switch (index) {
    case 0:
      return totalEvents !== undefined
        ? [
            {
              label: 'Total de eventos',
              value: totalEvents,
            },
          ]
        : undefined
    case 1:
      return [
        {
          label: 'Monto total',
          value: offersTotalAmount.value.toFixed(2),
          prefix: '$ ',
        },
        {
          label: 'Monto pendiente',
          value: pendingAmount,
          prefix: '$ ',
        },
      ]
    default:
      return undefined
  }
}
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      v-for="(config, index) in chartConfigs"
      :key="config.id"
      class="bg-white shadow rounded-lg p-4"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">{{ config.title }}</h2>
        <button @click="openChartModal(index)">
          <CustomIcons name="icon-vector" class="w-4 h-4" />
        </button>
      </div>
      <ChartMetrics :metrics="getMetricsForChart(index)" />

      <div class="w-full h-64 sm:h-80">
        <canvas :id="config.id"></canvas>
      </div>
    </div>
  </div>

  <ChartModal
    :is-open="isModalOpen"
    :title="
      selectedChartIndex !== null ? chartConfigs[selectedChartIndex].title : ''
    "
    :modal-chart-id="modalChartId"
    :chart-metrics="
      selectedChartIndex !== null
        ? getMetricsForChart(selectedChartIndex)
        : undefined
    "
    @close="closeModal"
  />
</template>
