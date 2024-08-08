export default defineEventHandler(async (event) => {
  const { apiUrl } = useRuntimeConfig(event)
  const body = await readBody(event)

  try {
      const organizations: any = await $fetch(apiUrl + '/organization-management/find-organizations', {
          method: 'POST',
          body,
          headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json'
          }
      })
      
      // Si necesitas manejar alguna sesión relacionada con organizaciones
      // Puedes agregar una función similar a `setUserSession` para organizaciones si es necesario
      
      return organizations
      
  } catch (error) {
      console.error("Error fetching organizations:", error);
      return { error: 'Failed to fetch organizations', details: error }
  }
})