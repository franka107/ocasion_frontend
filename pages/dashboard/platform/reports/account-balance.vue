<template>
    <ContentLayout title="Balance de cuentas">
      <AccountDetails/>
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="balanceData"
            :header="balanceHeader"
            :search="balanceSearch"
            @on-sort="onSort"
            @on-search="onSearch"
          >
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
  import type { OrganizationItem } from '~/types/Order.ts'
  import {
    balanceHeader,
    balanceSearch,
  } from '~/constants/reports'
  import ContentLayout from '~/layouts/default/ContentLayout.vue'
  import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
  import { ref } from 'vue'
  import AccountDetails from '~/components/reports/account-balance/AccountDetails.vue'
  import { useAccountBalance } from '@/composables/useAccountBalance'
  import type { IAccountBalanceItem } from '~/types/AccountBalance'
  const openApplicationModal = ref(false);
  const openParticipantModal = ref(false);
  const {
    page,
    onSort,
    onSearch,
    filterOptions,
    sortOptions,
  } = useAccountBalance()
  const BASE_WALL_URL = '/finance/wallet-management'
  const { data, refresh }: any = await useAPI(
    `${BASE_WALL_URL}/view-wallets-paginated`,
    {
      query: {
        limit: 8,
        page,
        filterOptions,
        sortOptions,
      },
    } as any,
  )
  const balanceData = computed(() =>
    data.value?.data.map((item: IAccountBalanceItem) => ({
      fullName: item.user.commonName,
      ...item,
    })),
  )
  </script>
