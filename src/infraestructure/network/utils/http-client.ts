export const httpClient = $fetch.create({
  baseURL: useRuntimeConfig().public.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})
