import { ref, computed } from 'vue'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
} from '@tanstack/vue-table'
import type { DataTableFilterField, ExtendedSortingState } from './types'
import {
  getSortingStateParser,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
  type Parser,
  type QueryStateOptions,
} from '~/composables/query-state/useQueryState'
import { useDebouncedCallback } from '~/composables/query-state/useDebouncedCallback'

interface UseBerlinTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {
  /**
   * Defines filter fields for the table. Supports both dynamic faceted filters and search filters.
   * - Faceted filters are rendered when `options` are provided for a filter field.
   * - Otherwise, search filters are rendered.
   *
   * The indie filter field `value` represents the corresponding column name in the database table.
   * @default []
   * @type { label: string, value: keyof TData, placeholder?: string, options?: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[] }[]
   * @example
   * ```ts
   * // Render a search filter
   * const filterFields = [
   *   { label: "Title", value: "title", placeholder: "Search titles" }
   * ];
   * // Render a faceted filter
   * const filterFields = [
   *   {
   *     label: "Status",
   *     value: "status",
   *     options: [
   *       { label: "Todo", value: "todo" },
   *       { label: "In Progress", value: "in-progress" },
   *     ]
   *   }
   * ];
   * ```
   */
  filterFields?: DataTableFilterField<TData>[]

  /**
   * Determines how query updates affect history.
   * `push` creates a new history entry; `replace` (default) updates the current entry.
   * @default "replace"
   */
  history?: 'push' | 'replace'

  /**
   * Indicates whether the page should scroll to the top when the URL changes.
   * @default false
   */
  scroll?: boolean

  /**
   * Shallow mode keeps query states client-side, avoiding server calls.
   * Setting to `false` triggers a network request with the updated querystring.
   * @default true
   */
  shallow?: boolean

  /**
   * Maximum time (ms) to wait between URL query string updates.
   * Helps with browser rate-limiting. Minimum effective value is 50ms.
   * @default 50
   */
  throttleMs?: number

  /**
   * Debounce time (ms) for filter updates to enhance performance during rapid input.
   * @default 300
   */
  debounceMs?: number

  /**
   * Clear URL query key-value pair when state is set to default.
   * Keep URL meaning consistent when defaults change.
   * @default false
   */
  clearOnDefault?: boolean

  /**
   * Enable notion like column filters.
   * Advanced filters and column filters cannot be used at the same time.
   * @default false
   * @type boolean
   */
  enableAdvancedFilter?: boolean

  initialState?: Omit<Partial<TableState>, 'sorting'> & {
    // Extend to make the sorting id typesafe
    sorting?: ExtendedSortingState<TData>
  }
}

export function useDataTable<TData>({
  pageCount = -1,
  filterFields = [],
  enableAdvancedFilter = false,
  history = 'replace',
  scroll = false,
  shallow = true,
  throttleMs = 50,
  debounceMs = 300,
  clearOnDefault = false,
  initialState,
  ...props
}: UseBerlinTableProps<TData>) {
  const queryStateOptions = computed<QueryStateOptions>(() => {
    return {
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
    }
  })
  const rowSelection = ref<RowSelectionState>(initialState?.rowSelection ?? {})

  const columnVisibility = ref<VisibilityState>(
    initialState?.columnVisibility ?? {},
  )

  const page = useQueryState(
    'page',
    parseAsInteger.withOptions(queryStateOptions.value).withDefault(1),
  )
  const perPage = useQueryState(
    'perPage',
    parseAsInteger
      .withOptions(queryStateOptions.value)
      .withDefault(initialState?.pagination?.pageSize ?? 10),
  )
  const sorting = useQueryState(
    'sort',
    getSortingStateParser<TData>()
      .withOptions(queryStateOptions.value)
      .withDefault(initialState?.sorting ?? []),
  )

  const filterParsers = computed(() => {
    return filterFields.reduce<
      Record<string, Parser<string> | Parser<string[]>>
    >((acc, field) => {
      if (field.options) {
        // Faceted filter
        acc[field.id] = parseAsArrayOf(parseAsString)
          .withOptions(queryStateOptions.value)
          .withDefault([])
      } else {
        // Search filter
        acc[field.id] = parseAsString
          .withOptions(queryStateOptions.value)
          .withDefault('')
      }
      return acc
    }, {})
  })

  const filterValues = useQueryStates(filterParsers.value)

  const debouncedSetFilterValues = useDebouncedCallback((filterUpdates) => {
    Object.assign(filterValues, filterUpdates)
  }, debounceMs)

  const pagination: PaginationState = {
    pageIndex: page.value - 1, // zero-based index -> one-based index
    pageSize: perPage.value,
  }

  function onPaginationChange(updaterOrValue: Updater<PaginationState>) {
    if (typeof updaterOrValue === 'function') {
      const newPagination = updaterOrValue(pagination)
      page.value = newPagination.pageIndex + 1
      perPage.value = newPagination.pageSize
    } else {
      page.value = updaterOrValue.pageIndex + 1
      perPage.value = updaterOrValue.pageSize
    }
  }
  // Sort
  function onSortingChange(updaterOrValue: Updater<SortingState>) {
    if (typeof updaterOrValue === 'function') {
      const newSorting = updaterOrValue(
        sorting.value,
      ) as ExtendedSortingState<TData>
      sorting.value = newSorting
    }
  }

  const initialColumnFilters = computed<ColumnFiltersState>(() => {
    return enableAdvancedFilter
      ? []
      : Object.entries(filterValues).reduce<ColumnFiltersState>(
          (filters, [key, value]) => {
            if (value.value !== null) {
              // Note: need to access .value since filterValues contains refs
              filters.push({
                id: key,
                value: Array.isArray(value.value) ? value.value : [value.value],
              })
            }
            return filters
          },
          [],
        )
  })

  const columnFilters = ref<ColumnFiltersState>(initialColumnFilters.value)

  // Compute searchable and filterable columns
  const { searchableColumns, filterableColumns } = computed(() => {
    return enableAdvancedFilter
      ? { searchableColumns: [], filterableColumns: [] }
      : {
          searchableColumns: filterFields.filter((field) => !field.options),
          filterableColumns: filterFields.filter((field) => field.options),
        }
  }).value

  // If you need to change columnFilters later:
  const setColumnFilters = (filters: ColumnFiltersState) => {
    columnFilters.value = filters
  }

  const onColumnFiltersChange = (
    updaterOrValue: Updater<ColumnFiltersState>,
  ) => {
    // Don't process filters if advanced filtering is enabled
    if (enableAdvancedFilter) return

    const updateFilters = (prev: ColumnFiltersState) => {
      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(prev)
          : updaterOrValue

      const filterUpdates = next.reduce<
        Record<string, string | string[] | null>
      >((acc, filter) => {
        if (searchableColumns.find((col) => col.id === filter.id)) {
          // For search filters, use the value directly
          acc[filter.id] = filter.value as string
        } else if (filterableColumns.find((col) => col.id === filter.id)) {
          // For faceted filters, use the array of values
          acc[filter.id] = filter.value as string[]
        }
        return acc
      }, {})

      // Handle removed filters
      for (const prevFilter of prev) {
        if (!next.some((filter) => filter.id === prevFilter.id)) {
          filterUpdates[prevFilter.id] = null
        }
      }

      // Reset page to 1 when filters change
      page.value = 1

      // Update filter values with debounce
      debouncedSetFilterValues(filterUpdates)

      return next
    }

    columnFilters.value = updateFilters(columnFilters.value)
  }
  const table = useVueTable({
    ...props,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting: sorting.value,
      columnVisibility: columnVisibility.value,
      rowSelection: rowSelection.value,
      columnFilters: enableAdvancedFilter ? [] : columnFilters.value,
    },
    enableRowSelection: true,
    onRowSelectionChange: (updateOrValue) => {
      rowSelection.value =
        typeof updateOrValue === 'function'
          ? updateOrValue(rowSelection.value)
          : updateOrValue
    },
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: (updaterOrValue) => {
      columnVisibility.value =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(columnVisibility.value)
          : updaterOrValue
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableAdvancedFilter
      ? undefined
      : getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: enableAdvancedFilter ? undefined : getFacetedRowModel(),
    getFacetedUniqueValues: enableAdvancedFilter
      ? undefined
      : getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return { table }
}
