<template>
  <ContentLayout title="Reporte de transacciones (Global)">
    <TransactionsDetails :cards-data="transactionHistoryResumeData" />
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 pb-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="parsedTransactionHistoryList"
          :header="transactionsHeader"
          :search="transactionsSearch"
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

          <template #actions="{ row }">
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
                <DropdownMenuContent
                  align="start"
                  class="bg-primary text-white"
                >
                  <DropdownMenuItem>
                    <NuxtLink
                      class="flex justify-between w-full"
                      :to="`/dashboard/platform/reports/transactions/${row.wallet.userId}`"
                    >
                      Estado de cuenta
                      <CustomIcons name="EyeIcon" class="ml-[14px]" />
                    </NuxtLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
        :total="total"
        :limit="10"
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
  transactionsHeader,
  transactionsSearch,
} from '~/constants/reports'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import formatCurrency from '~/utils/formatCurrency'
import TransactionsDetails from '~/components/reports/transactions/TransactionsDetails.vue'
import {
  TransactionHistoryMotive,
  transactionHistoryMotiveMap,
  type TransactionHistoryListItem,
} from '~/types/TransactionHistory'
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'
import FileLabel from '~/design-system/ui/file-label/FileLabel.vue'
import TextLabel from '~/design-system/ui/text-label/TextLabel.vue'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
const { page, onSort, onSearch, getData, handleExport } =
  useTransactionHistoriesAPI()
const { transactionHistoryList, transactionHistoryResume } = await getData()
const transactionHistoryResumeData = computed(() => {
  return [
    {
      subtitle: 'Ingresos',
      amountKey: formatCurrency(
        transactionHistoryResume.data.value.incomeAmount,
        'USD',
      ),
    },
    {
      subtitle: 'Penalidades cobradas',
      amountKey: formatCurrency(
        transactionHistoryResume.data.value.penaltiesChargedAmount,
        'USD',
      ),
    },
    {
      subtitle: 'Retiros pendientes de procesar',
      amountKey: formatCurrency(
        transactionHistoryResume.data.value.withdrawalsPendingProcessingAmount,
        'USD',
      ),
    },
  ]
})
const total = computed(() => transactionHistoryList.data.value.count)
const parsedTransactionHistoryList = computed(() =>
  transactionHistoryList.data.value.data.map((item) => {
    return {
      ...item,
      fullName: item.wallet.user.firstName + ' ' + item.wallet.user.lastName,
      document: `${item.wallet.user.documentType} ${item.wallet.user.documentIdentifier}`,
      motive:
        transactionHistoryMotiveMap[item.motive as TransactionHistoryMotive]
          ?.label,
      status: item.status,
    }
  }),
)
</script>
