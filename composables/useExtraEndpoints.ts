const CARS_BASE_URL = '/shared-kernel/car'
export const useExtraEndpoints = () => {
  const brands = ref<Array<{ id: string; name: string }>>([])
  const models = ref<Array<{ id: string; name: string }>>([])

  const fetchBrands = async () => {
    try {
      const { data } = await useAPI(`${CARS_BASE_URL}/get-car-brands`, {
        default: () => [],
      })
      brands.value = data.value
    } catch (error) {
      console.error('Error al cargar los departamentos:', error)
    }
  }

  const fetchModels = async (brandId: string) => {
    try {
      const { data } = await useAPI(`${CARS_BASE_URL}/get-car-models`, {
        query: {
          filterOptions: JSON.stringify([
            { field: 'carBrand.id', type: 'equal', value: brandId },
          ]),
        },
        default: () => [],
      })
      models.value = data.value
    } catch (error) {
      console.error(
        `Error al cargar las provincias del departamento ${brandId}:`,
        error,
      )
    }
  }

  return {
    fetchModels,
    fetchBrands,
    brands,
    models,
  }
}

