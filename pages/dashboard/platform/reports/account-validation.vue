<template>
    <ContentLayout title="Reporte de validación de cuentas">
      <CustomSimpleCard
        title="Listado de validación de cuentas"
        class="mb-6"
        sub-title="Vizualización reportes de validación de  cuentas de los participantes"
      />
  
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="validationData"
            :header="validationHeader"
            :search="validationSearch"
            @on-sort="onSort"
            @on-search="onSearch"
            show-more-button
          >
          <template #action-button>
                <div class="flex">
                    <Button
                    variant="default"
                    @click="handleExport"
                    >
                    <CustomIcons name="Download" class="ml-auto" />
                    Exportar
                    </Button>
                </div>
            </template>
          <template #status="{ row }">
            <CustomChip
              :text="validationStatus.get(row.status)?.name || ''"
              :variant="validationStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
          </CustomTable>
        </div>
        <CustomPagination
          v-model:page="page"
          class="mt-5 mb-[19px]"
          :total="data.count"
          :limit="data.limit"
        />
      </div>
    </ContentLayout>
  </template>
  <script setup lang="ts">
  import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
  import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
  import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
  import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
  import {
    validationStatus,
    validationHeader,
    validationSearch,
  } from '~/constants/reports'
  import ContentLayout from '~/layouts/default/ContentLayout.vue'
  import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
  import { useAccountValidation } from '@/composables/useAccountValidation'
  import type { IAccountLItem } from '~/types/Account'
  import type { IDataResponse } from '~/types/Common'
  import dayjs from 'dayjs'

  const {
    page,
    onSort,
    onSearch,
    filterOptions,
    sortOptions,
    handleExport,
  } = useAccountValidation()
  const BASE_VAL_URL = '/finance/account-validation'
  const { data, refresh } = await useAPI<IDataResponse<IAccountLItem>>(() => `${BASE_VAL_URL}/view-paginated-account-validations`, {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any)

  const validationData = computed(() =>
  data.value?.data.map((item: IAccountLItem) => ({
    fullName: item.participant.commonName,
    document: `${item.participant.documentType} ${item.participant.documentIdentifier}`,
    ...item,
    createdAt: dayjs(item.createdAt).format('YYYY-MM-DD'),
  })),
)
  </script>
  