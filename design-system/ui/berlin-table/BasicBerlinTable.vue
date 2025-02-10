<script setup lang="tsx">
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
  type AccessorKeyColumnDef,
  type ColumnDef,
} from '@tanstack/vue-table'
import TableRow from '../table/TableRow.vue'
import TableHeader from '../table/TableHeader.vue'
import TableHead from '../table/TableHead.vue'
import TableBody from '../table/TableBody.vue'
import TableCell from '../table/TableCell.vue'
import Button from '../button/Button.vue'
import Table from '../table/Table.vue'

interface Props<T extends object> {
  columns: ColumnDef<T>[]
  data: T[]
}
// columns: ColumnDef<T>[]
const props = defineProps<Props<any>>() // Haciendo el componente genérico

const dataRef = ref(props.data)

const table = useVueTable({
  columns: props.columns,
  data: dataRef,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

watch(
  () => props.data,
  (newData) => {
    dataRef.value = newData
  },
)
</script>

<template>
  <div class="w-full">
    <div class="flex items-center py-4">
      <!-- <Input -->
      <!--   class="max-w-sm" -->
      <!--   placeholder="Filter emails..." -->
      <!--   :model-value="table.getColumn('email')?.getFilterValue() as string" -->
      <!--   @update:model-value="table.getColumn('email')?.setFilterValue($event)" -->
      <!-- /> -->
      <!-- <DropdownMenu> -->
      <!--   <DropdownMenuTrigger as-child> -->
      <!--     <Button variant="outline" class="ml-auto"> -->
      <!--       Columns <ChevronDownIcon class="ml-2 h-4 w-4" /> -->
      <!--     </Button> -->
      <!--   </DropdownMenuTrigger> -->
      <!--   <DropdownMenuContent align="end"> -->
      <!--     <DropdownMenuCheckboxItem -->
      <!--       v-for="column in table -->
      <!--         .getAllColumns() -->
      <!--         .filter((column) => column.getCanHide())" -->
      <!--       :key="column.id" -->
      <!--       class="capitalize" -->
      <!--       :checked="column.getIsVisible()" -->
      <!--       @update:checked=" -->
      <!--         (value) => { -->
      <!--           column.toggleVisibility(!!value) -->
      <!--         } -->
      <!--       " -->
      <!--     > -->
      <!--       {{ column.id }} -->
      <!--     </DropdownMenuCheckboxItem> -->
      <!--   </DropdownMenuContent> -->
      <!-- </DropdownMenu> -->
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
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

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No hay resultados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} de
        {{ table.getFilteredRowModel().rows.length }} registro(s) seleccionados.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Atrás
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Siguiente
        </Button>
      </div>
    </div>
  </div>
</template>
