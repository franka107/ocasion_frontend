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

  console.log(`-------------------------`)
  console.log(`fetch-url   : ${url}`)
  console.log(`debug: ${debug}`)

  if (debug) {
    console.log(`fetch-status: ${fetch.status.value}`)
    console.log(`fetch-value : ${JSON.stringify(fetch.data.value, null, 2)}`)
    console.log(`-------------------------`)
  }

  return fetch
}
