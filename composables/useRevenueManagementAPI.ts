import { ref } from 'vue'

export interface RevenueDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
}

export interface RevenueChartData {
  labels: string[]
  datasets: RevenueDataset[]
}

export interface RevenueResponse {
  offersTotalAmount: number
  pendingToCollect: number
  chart: {
    labels: string[]
    datasets: RevenueDataset[]
  }
}

const EVENT_BASE_URL = '/event-management'

export function useRevenueManagementAPI() {
  const totalAmount = ref(0)
  const pendingAmount = ref(0)
  const monthlyRevenue = ref<RevenueChartData>({
    labels: [],
    datasets: [],
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getMonthlyRevenue = async (startDate: string, endDate: string) => {
    isLoading.value = true
    error.value = null

    try {
      const filterOptions = [
        {
          field: 'finishedAt',
          type: 'between',
          value: [startDate, endDate],
        },
      ]

      const params = new URLSearchParams({
        filterOptions: JSON.stringify(filterOptions),
      })

      const response = await useAPI(
        `${EVENT_BASE_URL}/get-monthly-revenue?${params.toString()}`,
        {
          method: 'GET',
          default: () => ({
            offersTotalAmount: 0,
            pendingToCollect: 0,
            chart: {
              labels: [],
              datasets: []
            }
          }),
        },
      )

      const { data, error: apiError } = response
      const rawData = data?.value || data

      if (rawData && rawData.chart) {
        // Actualizar los valores usando .value para las referencias reactivas
        totalAmount.value = rawData.offersTotalAmount
        pendingAmount.value = rawData.pendingToCollect
        monthlyRevenue.value = {
          labels: rawData.chart.labels,
          datasets: rawData.chart.datasets.map((dataset: RevenueDataset) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
            backgroundColor: dataset.backgroundColor,
          })),
        }
        console.log('Datos de ingresos cargados:', {
          totalAmount: totalAmount.value,
          pendingAmount: pendingAmount.value,
          monthlyRevenue: monthlyRevenue.value
        })
      } else {
        error.value = 'Datos de ingresos mensuales no disponibles o mal formateados.'
        console.error('Datos de ingresos mensuales no disponibles - Raw:', rawData)
      }

      if (apiError) {
        error.value = apiError
      }

      return { data: rawData, error: apiError }
    } catch (e) {
      error.value = 'Error al obtener ingresos mensuales'
      console.error('Error al obtener ingresos mensuales:', e)
      return { data: null, error: e }
    } finally {
      isLoading.value = false
    }
  }

  return {
    totalAmount,
    pendingAmount,
    monthlyRevenue,
    isLoading,
    error,
    getMonthlyRevenue,
  }
}
