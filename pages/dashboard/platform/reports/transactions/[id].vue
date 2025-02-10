<template>
  <ContentLayout show-arrow title="Estado de cuenta participante">
    <TransactionPaticipantDetails />
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 pb-6 bg-white flex-grow mb-auto">
        <h2 class="pt-6 text-[#262F45] font-[700] text-[18px]">
          Historial de transacciones
        </h2>
        <CustomTable
          :data="transactionsData"
          :header="transactionsParticipantHeader"
          :search="transactionsParticipantSearch"
          show-more-button
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #action-button>
            <Button variant="default" @click="handleExport">
              <CustomIcons name="Download" class="ml-auto" />
              Exportar
            </Button>
          </template>

          <template #livelihood="{ row }">
            <div class="flex items-center justify-center">
              <FileLabel :value="row.rechargeRequest?.sustentationFile" />
            </div>
          </template>

          <template #voucher="{ row }">
            <FileLabel :value="row.voucherGeneratedFile" />
          </template>

          <template #amount="{ row }">
            <MoneyLabel :amount="row.amount" />
          </template>
          <template #operationId="{ row }">
            <TextLabel
              :value="
                row.retireRequest
                  ? row.retireRequest?.id
                  : row.rechargeRequest?.id
              "
            />
          </template>
          <template #createdAt="{ row }">
            <DateLabel :value="row.createdAt" />
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
import dayjs from 'dayjs'
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
import {
  TransactionHistoryMotive,
  transactionHistoryMotiveMap,
  type TransactionHistoryListItem,
} from '~/types/TransactionHistory'
import type { IDataResponse } from '~/types/Common'
import TextLabel from '~/design-system/ui/text-label/TextLabel.vue'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'
import FileLabel from '~/design-system/ui/file-label/FileLabel.vue'
const route = useRoute()
const filterOptionsRaw = ref([
  { field: 'wallet.user.id', type: 'equal', value: route.params.id || '' },
])

const { page, onSort, onSearch, filterOptions, sortOptions, handleExport } =
  useTransactionParticipant('not-pendings')
const BASE_TRANS_URL = '/finance/transaction-history-management'

const { data, refresh } = await useAPI<
  IDataResponse<TransactionHistoryListItem>
>(() => `${BASE_TRANS_URL}/view-transaction-histories-paginated-participant`, {
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
    fullName: item.wallet.user.firstName + ' ' + item.wallet.user.lastName,
    document: `${item.wallet.user.documentType} ${item.wallet.user.documentIdentifier}`,
    motive:
      transactionHistoryMotiveMap[item.motive as TransactionHistoryMotive]
        ?.label,
    status: item.status,
  })),
)
</script>
