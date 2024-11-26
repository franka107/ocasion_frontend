export const useAddress = () => {
  const states = ref<Array<{ id: string; name: string }>>([])
  const cities = ref<Array<{ id: string; name: string }>>([])
  const districts = ref<Array<{ id: string; name: string }>>([])

  const fetchStates = async () => {
    try {
      const { data } = await useAPI('/locations/states', {
        default: () => [],
      })
      states.value = data.value
    } catch (error) {
      console.error('Error al cargar los departamentos:', error)
    }
  }

  const fetchCities = async (stateId: string) => {
    try {
      const { data } = await useAPI(`/locations/states/${stateId}/cities`, {
        default: () => [],
      })
      cities.value = data.value
    } catch (error) {
      console.error(
        `Error al cargar las provincias del departamento ${stateId}:`,
        error,
      )
    }
  }

  const fetchDistricts = async (cityId: string) => {
    try {
      const { data } = await useAPI(`/locations/cities/${cityId}/districts`, {
        default: () => [],
      })
      districts.value = data.value
    } catch (error) {
      console.error('Error al cargar actividades económicas:', error)
    }
  }

  return {
    fetchCities,
    fetchDistricts,
    fetchStates,
    states,
    cities,
    districts,
  }
}

