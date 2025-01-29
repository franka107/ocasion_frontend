<template>
  <ContentLayout title="Mi monedero">
    <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
    <section>
      <PurseDetails :refresh-history-transaction-table="refresh" />
      <div
        class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-4 pb-3"
      >
        <div
          class="px-0 py-[31.5px] text-[#262F45] text-[18px] font-[700] border-b-[1px] border-[#E2E8F0]"
        >
          <h2>Historial de transacciones</h2>
        </div>
        <CustomTable
          :data="transactionHistoryData"
          :header="transactionHistoryHeader"
          :search="transactionHistorySearch"
          class="mb-4"
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #createdAt="{ row }">
            <DateLabel :value="row.createdAt" />
          </template>
          <template #amount="{ row }">
            <span
              :class="[
                `text-${transactionHistoryTypeMap[row.type as TransactionHistoryType]?.color}-500`,
              ]"
            >
              {{ row.type === TransactionHistoryType.Charge ? '+' : '-'
              }}{{ row.amount.toFixed(2) }}</span
            >
          </template>
          <template #type="{ row }">
            <CustomChip
              :text="
                transactionHistoryTypeMap[row.type as TransactionHistoryType]
                  ?.label || ''
              "
              :variant="
                transactionHistoryTypeMap[row.type as TransactionHistoryType]
                  ?.color as any
              "
            ></CustomChip>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="
                transactionHistoryStatusMap[
                  row.status as TransactionHistoryStatus
                ]?.label || ''
              "
              :variant="
                transactionHistoryStatusMap[
                  row.status as TransactionHistoryStatus
                ]?.color as any
              "
            ></CustomChip>
          </template>

          <template #voucher="{ row }">
            <div class="flex items-center justify-center">
              <NuxtLink
                v-if="row.rechargeRequest?.voucherGeneratedFile?.path"
                :to="row.rechargeRequest?.voucherGeneratedFile?.path"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center"
              >
                <CustomIcons name="Doc-Loupe" />
              </NuxtLink>
              <span v-else>-</span>
            </div>
            <!-- <Button variant="ghost">
              <CustomIcons name="fileSearch" class="w-6 h-6 text-primary" />
            </Button> -->
          </template>
        </CustomTable>
      </div>
      <CustomPagination
        v-model:page="page"
        class="mt-5 mb-[19px]"
        :total="data?.count"
        :limit="limit"
      />
    </section>
  </ContentLayout>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { format } from 'date-fns'
import PurseDetails from '@/components/purse/PurseDetails.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import {
  transactionHistoryHeader,
  transactionHistorySearch,
} from '~/constants/purse'

import ContentLayout from '~/layouts/default/ContentLayout.vue'
import type { BidDto } from '~/types/Bids'
import {
  transactionHistoryCurrencyMap,
  transactionHistoryMotiveMap,
  TransactionHistoryStatus,
  transactionHistoryStatusMap,
  TransactionHistoryType,
  transactionHistoryTypeMap,
  type TransactionHistoryDto,
} from '~/types/TransactionHistory'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
const { page, sortOptions, onSort, createEvent, editEvent, cancelEvent } =
  useEvent()
const { getMyGrants } = useAuthManagement()
const limit = ref(10)

const filterOptions = ref(JSON.stringify([]))

const onSearch = (item: { [key: string]: string }) => {
  const filters = []
  if (item.type) {
    filters.push({ field: 'type', type: 'equal', value: item.type })
  }
  if (item.motive) {
    filters.push({ field: 'motive', type: 'equal', value: item.motive })
  }
  if (item.createdAt) {
    filters.push({
      field: 'createdAt',
      type: 'between',
      value: item.createdAt,
    })
  }
  filterOptions.value = JSON.stringify(filters)
}

const BID_BASE_URL = '/bid-management'

const { data, refresh }: any = await useAPI(
  `user-management/get-my-transaction-histories`,
  {
    query: {
      limit,
      page,
      filterOptions,
      // relations: JSON.stringify(['bid']),
      sortOptions,
    },
  } as any,
)
const transactionHistoryData = computed(
  () =>
    data.value?.data.map((item: TransactionHistoryDto, index: number) => ({
      // code: item.offer.id,
      // offerEndTime: item.offer.endTime
      //   ? dayjs(item.offer.endTime).format('DD/MM/YYYY')
      //   : '-',
      // taxes: 200,
      // type: '-',
      // total: item.amount + 200,
      // ...item,
      ...item,
      motive: transactionHistoryMotiveMap[item.motive]?.label,
      currency: transactionHistoryCurrencyMap[item.currency]?.label,
    })) || [],
)
</script>
