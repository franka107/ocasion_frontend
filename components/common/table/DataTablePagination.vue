<template>
  <div class="flex items-center mt-4 justify-between px-2">
    <div class="flex-1 text-sm">
      <div class="flex text-sm font-medium">
        <p class="my-auto pr-2">Total de registros</p>
        <div
          class="p-1 w-8 justify-center text-center border rounded border-[$e8def8] bg-white"
        >
          {{ table.getRowCount() }}
        </div>
      </div>
      <!-- {{ table.getFilteredSelectedRowModel().rows.length }} de
      {{ table.getFilteredRowModel().rows.length }} fila(s) seleccionadas. -->
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Filas por página</p>
        <Select
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="table.setPageSize"
        >
          <SelectTrigger
            class="p-1 w-[60px] justify-center text-center border rounded border-[$e8def8] bg-white"
          >
            <SelectValue
              :placeholder="`${table.getState().pagination.pageSize}`"
            />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in [10, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div
        class="flex w-[100px] items-center justify-center text-sm font-medium"
      >
        Página {{ table.getState().pagination.pageIndex + 1 }} de
        {{ table.getPageCount() }}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="h-8 w-8 p-1 justify-center text-center border rounded border-[$e8def8] bg-white"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <span class="sr-only">Ir a la primera página</span>
          <DoubleArrowLeftIcon class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-1 justify-center text-center border rounded border-[$e8def8] bg-white"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <span class="sr-only">Ir a la página anterior</span>
          <ChevronLeftIcon class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-1 justify-center text-center border rounded border-[$e8def8] bg-white"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <span class="sr-only">Ir a la página siguiente</span>
          <ChevronRightIcon class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="h-8 w-8 p-1 justify-center text-center border rounded border-[$e8def8] bg-white"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <span class="sr-only">Ir a la última página</span>
          <DoubleArrowRightIcon class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-icons/vue'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}
defineProps<DataTablePaginationProps<any>>()
</script>
