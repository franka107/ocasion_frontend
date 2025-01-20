<template>
    <ContentLayout showArrow title="Estado de cuenta participante">
      <TransactionPaticipantDetails />
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <h2 class="pt-6 text-[#262F45] font-[700] text-[18px]">Historial de transacciones</h2>
          <CustomTable
            :data="transactionsData"
            :header="transactionsParticipantHeader"
            :search="transactionsParticipantSearch"
            @on-sort="onSort"
            show-more-button
            @on-search="onSearch"
          >
          <template #action-button>
                <Button
                variant="default"
                @click="handleExport"
                >
                <CustomIcons name="Download" class="ml-auto" />
                Exportar
                </Button>
          </template>           
          <template #livelihood="{ row }">
              <div class="flex items-center justify-center">
                <component
                    :is="row.sustentationFile?.path ? 'a' : 'span'"
                    :href="row.sustentationFile?.path || undefined"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-center"
                    >
                    <CustomIcons v-if="row.sustentationFile?.path" name="Doc-Loupe" />
                    <span v-else>-</span>
                </component>
              </div>
          </template>
          <template #voucher="{ row }">
              <div class="flex items-center justify-center">
                <component
                    :is="row.voucherGeneratedFile?.path ? 'a' : 'span'"
                    :href="row.voucherGeneratedFile?.path || undefined"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-center"
                    >
                    <CustomIcons v-if="row.voucherGeneratedFile?.path" name="Doc-Loupe" />
                    <span v-else>-</span>
                </component>
              </div>
          </template>
          <template #status="{ row }">
              <CustomChip
              :text="transactionsStatus.get(row.status)?.name || ''"
              :variant="transactionsStatus.get(row.status)?.color as any"
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
    transactionsStatus,
    transactionsParticipantHeader,
    transactionsParticipantSearch,
  } from '~/constants/reports'
  import ContentLayout from '~/layouts/default/ContentLayout.vue' 
  import TransactionPaticipantDetails from '~/components/reports/transactions/TransactionPaticipantDetails.vue'
  import { TransactionHistoryMotive, transactionHistoryMotiveMap, type TransactionHistoryListItem } from '~/types/TransactionHistory'
  import type { IDataResponse } from '~/types/Common'
  import dayjs from 'dayjs'
  const route = useRoute();
  const filterOptionsRaw = ref([
    { field: 'wallet.user.id', type: 'equal', value: route.params.id || ''},
  ]);
  const {
    page,
    onSort,
    onSearch,
    filterOptions,
    sortOptions,
    handleExport
  } = useTransactionParticipant()
  const BASE_TRANS_URL = '/finance/transaction-history-management'

  const { data, refresh } = await useAPI<IDataResponse<TransactionHistoryListItem>>(() => `${BASE_TRANS_URL}/view-transaction-histories-paginated-participant`, {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
      userId: route.params.id || '',
    },
  } as any)

  const transactionsData = computed(() =>
    data.value?.data.map((item: TransactionHistoryListItem) => ({
      ...item,
      dateOfOperation: dayjs(item.createdAt).format('YYYY-MM-DD'),
      typeOfOperation: transactionHistoryMotiveMap[item.motive as TransactionHistoryMotive].label,
    })),
  )
  
  </script>
  