<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import {
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsLeftIcon,
  ChevronsRight,
  ChevronsRightIcon,
} from 'lucide-vue-next'

import Select from '../select/Select.vue'
import SelectTrigger from '../select/SelectTrigger.vue'
import SelectValue from '../select/SelectValue.vue'
import SelectContent from '../select/SelectContent.vue'
import Button from '../button/Button.vue'

interface Props<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<Props<any>>(), {
  pageSizeOptions: () => [10, 20, 30, 40, 50],
})
</script>

<template>
  <div
    class="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8"
  >
    <div class="flex-1 whitespace-nowrap text-muted-foreground text-sm">
      {{ props.table.getFilteredSelectedRowModel().rows.length }} of
      {{ props.table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    <div
      class="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8"
    >
      <div class="flex items-center space-x-2">
        <p class="whitespace-nowrap font-medium text-sm">Rows per page</p>
        <Select
          :model-value="`${props.table.getState().pagination.pageSize}`"
          @update:model-value="
            (value) => props.table.setPageSize(Number(value))
          "
        >
          <SelectTrigger class="h-8 w-[4.5rem]">
            <SelectValue
              :placeholder="
                props.table.getState().pagination.pageSize.toString()
              "
            />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in props.pageSizeOptions"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex items-center justify-center font-medium text-sm">
        Page {{ props.table.getState().pagination.pageIndex + 1 }} of
        {{ props.table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          aria-label="Go to first page"
          variant="outline"
          class="hidden size-8 p-0 lg:flex"
          :disabled="!props.table.getCanPreviousPage()"
          @click="props.table.setPageIndex(0)"
        >
          <ChevronsLeftIcon class="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to previous page"
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="!props.table.getCanPreviousPage()"
          @click="props.table.previousPage()"
        >
          <ChevronLeftIcon class="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to next page"
          variant="outline"
          size="icon"
          class="size-8"
          :disabled="!props.table.getCanNextPage()"
          @click="props.table.nextPage()"
        >
          <ChevronRightIcon class="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to last page"
          variant="outline"
          size="icon"
          class="hidden size-8 lg:flex"
          :disabled="!props.table.getCanNextPage()"
          @click="props.table.setPageIndex(props.table.getPageCount() - 1)"
        >
          <ChevronsRightIcon class="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </div>
</template>
