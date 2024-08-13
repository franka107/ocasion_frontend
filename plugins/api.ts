export default defineNuxtPlugin((nuxtApp) => {
    const { apiUrl } = useRuntimeConfig().public
    const { session, user, clear } = useUserSession()
    console.log("user", apiUrl);
    
    const api = $fetch.create({
      baseURL: String(apiUrl),
      onRequest({ request, options, error }) {
        if (user.value?.token) {
          const headers = options.headers ||= {}
          if (Array.isArray(headers)) {
            headers.push(['Authorization', `Bearer ${user.value?.token}`])
          } else if (headers instanceof Headers) {
            headers.set('Authorization', `Bearer ${user.value?.token}`)
          } else {
            headers.Authorization = `Bearer ${user.value?.token}`
          }
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await nuxtApp.runWithContext(() => navigateTo('/login'))
        }
      }
    })
  
    // Expose to useNuxtApp().$api
    return {
      provide: {
        api
      }
    }
  })
  