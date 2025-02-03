<template>
  <ContentLayout title="Balance de cuentas">
    <AccountDetails :wallets-resume-data="walletsResumeData" />
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto pb-6">
        <CustomTable
          :data="balanceData"
          :header="balanceHeader"
          :search="balanceSearch"
          @on-sort="onSort"
          @on-search="onSearchGlobal"
        >
          <template #chargeBalance="{ row }">
            <MoneyLabel :amount="row.chargeBalance" />
          </template>
          <template #dischargeBalance="{ row }">
            <MoneyLabel :amount="row.dischargeBalance" />
          </template>
          <template #penaltyBalance="{ row }">
            <MoneyLabel :amount="row.penaltyBalance" />
          </template>
          <template #guaranteedBalance="{ row }">
            <MoneyLabel :amount="row.guaranteedBalance" />
          </template>
          <template #availableBalance="{ row }">
            <MoneyLabel :amount="row.availableBalance" />
          </template>
          <template #pendingWithdrawalBalance="{ row }">
            <MoneyLabel :amount="row.pendingWithdrawalBalance" />
          </template>
          <template #pendingRechargeBalance="{ row }">
            <MoneyLabel :amount="row.pendingRechargeBalance" />
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
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import AccountDetails from '~/components/reports/account-balance/AccountDetails.vue'
import { useAccountBalance } from '@/composables/useAccountBalance'
import type { IAccountBalanceItem } from '~/types/AccountBalance'
import type { IDataResponse } from '~/types/Common'
import { balanceHeader, balanceSearch } from '~/constants/reports'
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'
const { page, onSort, onSearch, filterOptions, sortOptions } =
  useAccountBalance()
const BASE_WALL_URL = '/finance/wallet-management'
const { data, refresh } = await useAPI<IDataResponse<IAccountBalanceItem>>(
  () => `${BASE_WALL_URL}/view-wallets-paginated`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const onSearchGlobal = (values: any) => {
  onSearch(values)
  // const onSearcha = (item: { [key: string]: string }) => {
  //   const filters = [
  //     { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
  //     {
  //       field: 'quickSearchPeriod',
  //       type: 'in',
  //       value: item.quickSearchPeriod || '',
  //     },
  //   ]
  //   filterOptions.value = JSON.stringify(filters)
  // }
}

const { data: walletsResumeData, refresh: walletsResumeRefresh } =
  await useAPI<any>(`/finance/wallet-management/view-wallets-resume`, {
    query: {
      filterOptions,
      sortOptions,
    },
    default: () => ({}),
  })

const balanceData = computed(() =>
  data.value?.data.map((item: IAccountBalanceItem) => ({
    fullName: item.user.commonName,
    ...item,
  })),
)
</script>
