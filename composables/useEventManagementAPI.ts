import { ref } from 'vue'

export interface EventDataset {
  label: string
  data: number[]
  backgroundColor: string
}

export interface EventChartData {
  labels: string[]
  datasets: EventDataset[]
}
export interface EventsResponse {
  totalEvents: number
  chart: {
    labels: string[]
    datasets: EventDataset[]
  }
}

const EVENT_BASE_URL = '/event-management'

export function useEventManagementAPI() {
  const pendingActivities = ref({
    eventsInDebate: 0,
    pendingDepositReviewOffers: 0,
    pendingDeliveryOffers: 0,
  })

  const totalEvents = ref(0)
  const monthlyEvents = ref<EventChartData>({
    labels: [],
    datasets: [],
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Obtener las actividades pendientes
  const getEventsPendingActivities = async () => {
    try {
      const { data, error }: any = await useAPI(
        `${EVENT_BASE_URL}/get-events-pending-activities`,
        {
          method: 'GET',
          default: () => {},
        },
      )

      if (data) {
        pendingActivities.value = data
        console.log('Actividades pendientes:', data)
      }

      return { data, error }
    } catch (error) {
      console.error('Error al obtener actividades:', error)
      return { data: null, error }
    }
  }

  // Obtener los eventos mensuales para llenar el gráfico
  const getMonthlyEvents = async (startDate: string, endDate: string) => {
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
        `${EVENT_BASE_URL}/get-monthly-events?${params.toString()}`,
        {
          method: 'GET',
          default: () => ({
            totalEvents: 0,
            chart: {
              labels: [],
              datasets: []
            }
          }),
        },
      )


      // Extraer los datos de la respuesta
        const { data, error: apiError } = response;

        // Log para ver la respuesta
        console.log('Respuesta de la API:', data);

        const rawData = data?.value || data;

      if (rawData && rawData.chart) {
        // Actualizar los valores usando .value para las referencias reactivas
        totalEvents.value = rawData.totalEvents
        monthlyEvents.value = {
          labels: rawData.chart.labels,
          datasets: rawData.chart.datasets.map((dataset: EventDataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        }
        console.log('Datos mensuales cargados:', {
          totalEvents: totalEvents.value,
          monthlyEvents: monthlyEvents.value
        })
        
      } else {
        error.value = 'Datos de eventos mensuales no disponibles o mal formateados.'
        console.error('Datos de eventos mensuales no disponibles - Raw:', rawData)
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
        totalEvents.value = rawData.totalEvents || 0
        monthlyEvents.value = {
          labels: rawData.chart.labels,
          datasets: rawData.chart.datasets.map((dataset: EventDataset) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        }
      } else {
        error.value = 'Los datos del gráfico están vacíos o no se encontraron eventos.'
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

  return {
    pendingActivities,
    getEventsPendingActivities,
    totalEvents,
    monthlyEvents,
    isLoading,
    error,
    getMonthlyEvents,
  }
}
