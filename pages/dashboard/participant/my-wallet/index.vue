<template>
  <ContentLayout title="Mi monedero">
    <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
    <section>
      <PurseDetails />
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-4">
        <div
          class="px-0 py-[31.5px] text-[#262F45] text-[18px] font-[700] border-b-[1px] border-[#E2E8F0]"
        >
          <h2>Historial de transacciones</h2>
        </div>
        <CustomTable
          :data="transactionHistoryData"
          :header="transactionHistoryHeader"
          :search="purseSearch"
          class="border-2 border-[#5da9d3] rounded-lg"
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #status="{ row }">
            <CustomChip
              :text="
                transactionHistoryStatusMap[
                  row.status as TransactionHistoryStatus
                ].label || ''
              "
              :variant="
                transactionHistoryStatusMap[
                  row.status as TransactionHistoryStatus
                ].color as any
              "
            ></CustomChip>
          </template>

          <template #voucher>
            <Button variant="ghost">
              <CustomIcons
                name="Doc-Transfer"
                class="w-6 h-6 text-reminder-600"
              />
            </Button>
          </template>
        </CustomTable>
      </div>
      <CustomPagination
        v-model:page="page"
        class="mt-5 mb-[19px]"
        :total="1"
        :limit="1"
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
import { transactionHistoryHeader, purseSearch } from '~/constants/purse'

import ContentLayout from '~/layouts/default/ContentLayout.vue'
import type { BidDto } from '~/types/Bids'
import {
  transactionHistoryCurrencyMap,
  transactionHistoryMotiveMap,
  TransactionHistoryStatus,
  transactionHistoryStatusMap,
  transactionHistoryTypeMap,
  type TransactionHistoryDto,
} from '~/types/TransactionHistory'
const { page, sortOptions, onSort, createEvent, editEvent, cancelEvent } =
  useEvent()
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
console.log(myGrants)

const filterOptions = ref(JSON.stringify([]))

const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([])
}

const BID_BASE_URL = '/bid-management'

const { data, refresh }: any = await useAPI(
  `user-management/get-my-transaction-histories`,
  {
    query: {
      limit: 10,
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
      createdAt: format(item.createdAt, 'dd/MM/yyyy'),
      type: transactionHistoryTypeMap[item.type].label,
      motive: transactionHistoryMotiveMap[item.motive].label,
      currency: transactionHistoryCurrencyMap[item.currency].label,
      amount: item.amount.toFixed(2),
    })) || [],
)
</script>
