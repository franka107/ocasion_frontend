import type { Row } from '@tanstack/vue-table'
import { debounce } from 'lodash-es'
import { z } from 'zod'
import type { ExtendedSortingState } from '~/design-system/ui/berlin-table/types'

export interface QueryStateOptions {
  history?: 'push' | 'replace'
  debounceMs?: number
  clearOnDefault?: boolean
  scroll?: boolean
  shallow?: boolean
}

export interface Parser<T> {
  parse: (value: string) => T
  serialize: (value: T) => string
  withDefault: (defaultValue: T) => Parser<T>
  withOptions: (options: QueryStateOptions) => Parser<T>
}

function createParser<T>(config: {
  parse: (value: string) => T
  serialize: (value: T) => string
  eq?: (a: T, b: T) => boolean
}): Parser<T> {
  return {
    ...config,
    withDefault(defaultValue: T) {
      return {
        ...this,
        parse: (value: string) => {
          try {
            return value ? this.parse(value) : defaultValue
          } catch {
            return defaultValue
          }
        },
      }
    },
    withOptions(options: QueryStateOptions) {
      return this
    },
  }
}
export const parseAsInteger = createParser<number>({
  parse: (value) => parseInt(value, 10),
  serialize: (value) => value.toString(),
})

export const parseAsString = createParser<string>({
  parse: (value) => value,
  serialize: (value) => value,
})

export const parseAsArrayOf = <T>(itemParser: Parser<T>) =>
  createParser<T[]>({
    parse: (value) =>
      JSON.parse(value).map((item: string) => itemParser.parse(item)),
    serialize: (value) =>
      JSON.stringify(value.map((item) => itemParser.serialize(item))),
  })

export const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

export const getSortingStateParser = <TData>(
  originalRow?: Row<TData>['original'],
) => {
  const validKeys = originalRow ? new Set(Object.keys(originalRow)) : null

  return createParser<ExtendedSortingState<TData>>({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value)
        const result = z.array(sortingItemSchema).safeParse(parsed)

        if (!result.success) return []

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return []
        }

        return result.data as ExtendedSortingState<TData>
      } catch {
        return []
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (item, index) =>
          item.id === b[index]?.id && item.desc === b[index]?.desc,
      ),
  })
}

export function useQueryState<T>(key: string, parser: Parser<T>) {
  const route = useRoute()
  const router = useRouter()

  const value = ref<T>(
    route.query[key]
      ? parser.parse(route.query[key] as string)
      : parser.parse(''),
  )

  const updateUrl = debounce((newValue: T) => {
    const query = { ...route.query }
    query[key] = parser.serialize(newValue)

    router.replace({
      query,
      path: route.path,
    })
  }, 300)

  watch(value, (newValue) => updateUrl(newValue))

  return value
}

export function useQueryStates<T extends Record<string, Parser<any>>>(
  parsers: T,
): {
  [K in keyof T]: Ref<ReturnType<T[K]['parse']>>
} {
  const route = useRoute()
  const router = useRouter()

  // Create refs for each parser
  const values = Object.keys(parsers).reduce(
    (acc, key) => {
      const parser = parsers[key]
      acc[key] = ref(
        route.query[key]
          ? parser.parse(route.query[key] as string)
          : parser.parse(''),
      )
      return acc
    },
    {} as Record<string, Ref<any>>,
  )

  // Watch all refs and update URL
  const updateUrl = debounce(() => {
    const query = { ...route.query }

    Object.keys(parsers).forEach((key) => {
      const parser = parsers[key]
      query[key] = parser.serialize(values[key].value)
    })

    router.replace({
      query,
      path: route.path,
    })
  }, 300)

  // Watch all values
  Object.values(values).forEach((value) => {
    watch(value, () => updateUrl())
  })

  return values as { [K in keyof T]: Ref<ReturnType<T[K]['parse']>> }
}
