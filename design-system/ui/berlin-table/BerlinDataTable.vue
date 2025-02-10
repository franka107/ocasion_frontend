<script setup lang="ts">
import { FlexRender, type Table as TanstackTable } from '@tanstack/vue-table'

import Table from '../table/Table.vue'
import TableHeader from '../table/TableHeader.vue'
import TableRow from '../table/TableRow.vue'
import TableHead from '../table/TableHead.vue'
import TableBody from '../table/TableBody.vue'
import BerlinDataTablePagination from './BerlinDataTablePagination.vue'
import { getCommonPinningStyles } from './get-common-pinning-styles'

interface Props<TData> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   */
  floatingBar?: any

  class?: string
}

const props = withDefaults(defineProps<Props<any>>(), {
  floatingBar: null,
  class: '',
})
</script>

<template>
  <div :class="cn('w-full space-y-2.5 overflow-auto', props.class)">
    <slot />
    <div class="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in props.table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan"
              :style="getCommonPinningStyles({ column: header.column })"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="props.table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :style="getCommonPinningStyles({ column: cell.column })"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>
          <template v-else>
            <TableRow>
              <TableCell
                :colspan="props.table.getAllColumns().length"
                class="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex flex-col gap-2.5">
      <BerlinDataTablePagination :table="props.table" />
      <template
        v-if="props.table.getFilteredSelectedRowModel().rows.length > 0"
      >
        <component :is="props.floatingBar" />
      </template>
    </div>
  </div>
</template>
