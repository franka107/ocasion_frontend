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

const EVENT_BASE_URL = '/event-management'

export function useEventManagementAPI() {
  const pendingActivities = ref({
    eventsInDebate: 0,
    pendingDepositReviewOffers: 0,
    pendingDeliveryOffers: 0,
  })

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
      // Filtrar opciones para la API
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

      const { data, error: apiError }: any = await useAPI(
        `${EVENT_BASE_URL}/get-monthly-events?${params.toString()}`,
        {
          method: 'GET',
          default: () => ({ labels: [], datasets: [] }),
        },
      )

      if (data.value && Array.isArray(data.value.datasets)) {
        monthlyEvents.value = {
          labels: data.value.labels,
          datasets: data.value.datasets.map((dataset: any) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        }
        console.log(
          'Datos mensuales cargados:',
          JSON.parse(JSON.stringify(data.value)),
        )
      } else {
        error.value =
          'Datos de eventos mensuales no disponibles o mal formateados.'
        console.error('Datos de eventos mensuales no disponibles:', data.value)
      }

      if (apiError) {
        error.value = apiError
      }

      return { data, error: apiError }
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
    monthlyEvents,
    isLoading,
    error,
    getMonthlyEvents,
  }
}
