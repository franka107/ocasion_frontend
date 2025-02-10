<script setup lang="tsx">
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import BerlinTable from '~/design-system/ui/berlin-table/BasicBerlinTable.vue'

type Person = {
  id: string
  commonName: string
  amount: number
}

const data = ref<Person[]>([
  { id: '1', commonName: 'John', amount: 300 },
  { id: '2', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '3', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '4', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '5', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '6', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '7', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '8', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '9', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '10', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '11', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '12', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
  { id: '13', commonName: 'Jaaaaaaaaaaaaaaaaaaane', amount: 200 },
])

const columnHelper = createColumnHelper<Person>()

const columns: ColumnDef<Person, any>[] = [
  columnHelper.accessor('id', {
    cell: (info) => <span>Hola</span>,
    header: () => 'id',
  }),
  columnHelper.accessor('commonName', {
    cell: (info) => info.getValue(),
    header: () => 'Nombre',
  }),
  columnHelper.accessor('amount', {
    cell: (info) => info.getValue(),
    header: () => <span>Monto</span>,
  }),
]
</script>

<template>
  <div class="bg-white border border-blue p-6">
    <BerlinTable :data="data" :columns="columns" />
  </div>
</template>
