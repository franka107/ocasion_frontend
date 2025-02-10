import type { ColumnSort } from '@tanstack/vue-table'
import type { DefineComponent } from 'vue'
import type { DataTableConfig } from './berlin-data-table'

export type StringKeyOf<TData> = Extract<keyof TData, string>

export interface Option {
  label: string
  value: string
  icon?: DefineComponent<{ class?: string }>
  count?: number
}

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>
  label: string
  placeholder?: string
  options?: Option[]
}
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: StringKeyOf<TData>
}
export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]
export type ColumnType = DataTableConfig['columnTypes'][number]

export interface DataTableAdvancedFilterField<TData>
  extends DataTableFilterField<TData> {
  type: ColumnType
}
