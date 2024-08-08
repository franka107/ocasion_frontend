<template>
  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable :data="orderData" :header="header" @onSort="onSort" @onSearch="onSearch">
        <template #actions="props">
          <div class="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                variant="ghost"
                size="sm"
                class="h-8 data-[state=open]:bg-accent"
                >
                  <CustomIcons name="VerticalDots" class="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="bg-primary text-white">
                <DropdownMenuItem @click="">
                  Suspender
                  <CustomIcons name="Forbidden" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="">
                  Activar
                  <CustomIcons name="Reload" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="">
                  Actualizar datos
                  <CustomIcons name="ArrowLeft" class="ml-auto" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #status="{ row }">
          <CustomChip :text="row.status === 'ACTIVE'? 'Activo': 'Suspendido'" :variant="row.status === 'ACTIVE'? 'default':'destructive'"></CustomChip>
        </template>
      </CustomTable>
    </div>
    <CustomPagination class="mt-5 mb-[19px]" :total="data.count" :limit="data.limit" v-model:page="page" />
  </div>
</template>
<script setup lang="ts">
import CustomTable from '@/components/ui/custom-table/CustomTable.vue';
import type { HeaderItem } from '@/components/ui/custom-table/CustomTable.vue';
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue';
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue';
import type { OrderItem } from '@/types/Order.ts';

const page = ref(1)
const filterOptions = ref('[]')
const sortOptions = ref('[]')

const onSort = (sortObject: { [key: string]: string }[]) => {
  console.log('sort', sortObject);
  sortOptions.value = JSON.stringify(sortObject)
}

const onSearch = (item: {[key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: 'rucNumber', type: 'like', value: item.rucNumber || '' },
    { field: 'name', type: 'like', value: item.name || '' },
    { field: 'status', type: 'equal', value: item.status || '' }
  ])
    console.log('searc', item)
}
const { data } : any = await useAPI('/organization-management/find-organizations', {
  query: {
    limit: 8,
    page,
    filterOptions,
    sortOptions
  },
} as any);

const orderData= computed(() => data.value.data.map((item: OrderItem) => ({
    "date": item.contractStartDate + ' - ' + item.contractEndDate,
    ...item
  })))
const header: HeaderItem[] = [{
    key: 'rucNumber',
    label: 'RUC',
    sortable: true,
    search: {
      type: 'text',
      placeholder: 'Buscar RUC',
      position: 1,
    }
  }, {
    key: 'name',
    label: 'Razón social',
    sortable: true,
    search: {
      type: 'text',
      placeholder: 'Buscar nombre de organización',
      position: 2,
    }
  }, {
    key: 'date',
    label: 'Fecha de inicio y fecha de fin del contrato',
  },{
    key: 'status',
    label: 'Estado',
    sortable: true,
    search: {
      type: 'select',
      placeholder: 'Filtrar por estado',
      items: [
        { text: 'Activo', value: 'ACTIVE' },
        { text: 'Suspendido', value: 'SUSPENDED' }
      ],
      position: 3,
    }
  },{
    key: 'representativeFullName',
    label: 'Usuario',
    sortable: true
  },{
    key: 'representativePhoneNumber',
    label: 'Número de administrador',
    sortable: true
  },{
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center'
  }]
</script>
