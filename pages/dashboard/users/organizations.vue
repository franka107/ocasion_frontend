<template>
  <div class="w-full flex flex-col">
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable :data="data" :header="header">
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
                  <CustomIcons name="Forbidden" class="ml-auto text-muted-foreground/70" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="">
                  Activar
                  <CustomIcons name="Reload" class="ml-auto text-muted-foreground/70" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="">
                  Actualizar datos
                  <CustomIcons name="ArrowLeft" class="ml-auto text-muted-foreground/70" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #active="{ row }">
          <CustomChip :text="row.active? 'Activo': 'Suspendido'" :variant="row.active? 'default':'destructive'"></CustomChip>
        </template>
      </CustomTable>
    </div>
    <CustomPagination class="mt-5 mb-[19px]" />
  </div>
</template>
<script setup lang="ts">
import CustomTable from '@/components/ui/custom-table/CustomTable.vue';
import type { HeaderItem } from '@/components/ui/custom-table/CustomTable.vue';
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue';
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue';

const header: HeaderItem[] = [{
    key: 'ruc',
    label: 'RUC',
    sortable: true
  }, {
    key: 'name',
    label: 'Razón social',
    sortable: true
  }, {
    key: 'date',
    label: 'Fecha de inicio y fecha de fin del contrato',
    sortable: true
  },{
    key: 'active',
    label: 'Estado',
    sortable: true
  },{
    key: 'user',
    label: 'Usuario',
    sortable: true
  },{
    key: 'phone',
    label: 'Número de administrador',
    sortable: true
  },{
    key: 'actions',
    label: 'Acciones',
    sortable: false,
    align: 'center'
  }]
  const data = [
    { id: 1, name: 'Nombre de razón social', ruc: '1234567891021', date: '01/01/2021 - 01/01/2022', active: true, user: 'Admin. Organizacion', phone: '123456789' },
    { id: 2, name: 'Nombre de razón social', ruc: '1234567891021', date: '01/01/2021 - 01/01/2022', active: true, user: 'Admin. Organizacion', phone: '123456789' },
    { id: 3, name: 'Nombre de razón social', ruc: '1234567891021', date: '01/01/2021 - 01/01/2022', active: true, user: 'Admin. Organizacion', phone: '123456789' },
    { id: 4, name: 'Nombre de razón social', ruc: '1234567891021', date: '01/01/2021 - 01/01/2022', active: false, user: 'Admin. Organizacion', phone: '123456789' },
    { id: 5, name: 'Nombre de razón social', ruc: '1234567891021', date: '01/01/2021 - 01/01/2022', active: false, user: 'Admin. Organizacion', phone: '123456789' },
    { id: 6, name: 'Nombre de razón social', ruc: '1234567891021', date: '01/01/2021 - 01/01/2022', active: false, user: 'Admin. Organizacion', phone: '123456789' },
    ]
</script>
