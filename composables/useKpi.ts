import { ref } from 'vue'
import type { KpiPlatformParamsDto } from '~/types/Kpi'

const EVENT_BASE_URL = '/event-management'

export function useKpi() {
  const totalBrands = ref(0)
  const offersTotalAmount = ref(0)

  const monthlyTopGoods = ref<EventChartData>({
    labels: [],
    datasets: [],
  })
  const monthlyAverageOffers = ref({
    labels: [],
    datasets: [],
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getMonthlyAverageOffers = async (params: KpiPlatformParamsDto) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await useAPI(
        `${EVENT_BASE_URL}/get-monthly-average-offers`,
        {
          method: 'POST',
          body: params,
          default: () => ({
            offersTotalAmount: 0,
            chart: {
              labels: [],
              datasets: [],
            },
          }),
        },
      )

      // Extraer los datos de la respuesta
      const { data, error: apiError } = response

      // Log para ver la respuesta
      console.log('Respuesta de la API:', data)

      const rawData = data?.value || data

      if (rawData && rawData.chart) {
        // Actualizar los valores usando .value para las referencias reactivas
        offersTotalAmount.value = rawData.offersTotalAmount
        monthlyAverageOffers.value = {
          labels: rawData.chart.labels,
          datasets: rawData.chart.datasets,
        }
      } else {
        error.value =
          'Datos de eventos mensuales no disponibles o mal formateados.'
      }

      if (apiError) {
        error.value = apiError
      }
      if (
        rawData &&
        rawData.chart &&
        rawData.chart.labels?.length > 0 &&
        rawData.chart.datasets?.length > 0
      ) {
        totalBrands.value = rawData.totalBrands || 0
        monthlyTopGoods.value = {
          labels: rawData.chart.labels,
          datasets: rawData.chart.datasets.map((dataset: EventDataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        }
      } else {
        error.value =
          'Los datos del gráfico están vacíos o no se encontraron eventos.'
        console.error('Datos del gráfico no encontrados:', rawData)
      }

      return { data: rawData, error: apiError }
    } catch (e) {
      error.value = 'Error al obtener eventos mensuales'
      console.error('Error al obtener eventos mensuales:', e)
      return { data: null, error: e }
    } finally {
      isLoading.value = false
    }
  }

  const getMonthlyTopGoods = async (params: KpiPlatformParamsDto) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await useAPI(`${EVENT_BASE_URL}/get-monthly-top-goods`, {
        method: 'POST',
        body: params,
        default: () => ({
          totalBrands: 0,
          chart: {
            labels: [],
            datasets: [],
          },
        }),
      })

      // Extraer los datos de la respuesta
      const { data, error: apiError } = response

      // Log para ver la respuesta
      console.log('Respuesta de la API:', data)

      const rawData = data?.value || data

      if (rawData && rawData.chart) {
        // Actualizar los valores usando .value para las referencias reactivas
        totalBrands.value = rawData.totalBrands
        monthlyTopGoods.value = {
          labels: rawData.chart.labels,
          datasets: rawData.chart.datasets.map((dataset: EventDataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        }
      } else {
        error.value =
          'Datos de eventos mensuales no disponibles o mal formateados.'
      }

      if (apiError) {
        error.value = apiError
      }
      if (
        rawData &&
        rawData.chart &&
        rawData.chart.labels?.length > 0 &&
        rawData.chart.datasets?.length > 0
      ) {
        totalBrands.value = rawData.totalBrands || 0
        monthlyTopGoods.value = {
          labels: rawData.chart.labels,
          datasets: rawData.chart.datasets.map((dataset: EventDataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        }
      } else {
        error.value =
          'Los datos del gráfico están vacíos o no se encontraron eventos.'
        console.error('Datos del gráfico no encontrados:', rawData)
      }

      return { data: rawData, error: apiError }
    } catch (e) {
      error.value = 'Error al obtener eventos mensuales'
      console.error('Error al obtener eventos mensuales:', e)
      return { data: null, error: e }
    } finally {
      isLoading.value = false
    }
  }
  // Obtener las actividades pendientes

  return {
    totalBrands,
    monthlyTopGoods,
    getMonthlyTopGoods,
    getMonthlyAverageOffers,
    monthlyAverageOffers,
    offersTotalAmount,
    isLoading,
    error,
  }
}
