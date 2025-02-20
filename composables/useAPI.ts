import type { UseFetchOptions, FetchResult } from 'nuxt/app'

export async function useAPI<T>(
  url: string | (() => string),
  options: Omit<UseFetchOptions<T>, 'default'> & { default: () => T | Ref<T> },
  debug: boolean = false,
) {
  const fetch = await useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api as any,
  })

  return fetch
}
