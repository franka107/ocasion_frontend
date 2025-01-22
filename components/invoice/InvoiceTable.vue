<template>
  <section>
    <div class="w-full flex flex-col">
      <Card>
        <CardContent>
          <CustomTable
            :data="paginatedInvoices.data.value.data"
            class="mb-4"
            :header="invoiceTableMvi.tableHeaders"
            :search="invoiceTableMvi.tableSearch"
            @on-sort="invoiceTableMvi.onSort"
            @on-search="invoiceTableMvi.onSearch"
          >
            <template #offerEndTime="{ row }">
              <DateLabel :value="row.offer.endTime" />
            </template>
            <template #paymentCreatedAt="{ row }">
              <DateLabel :value="row.payment.createdAt" />
            </template>
            <template #offerLabel="{ row }">
              <OfferLabel
                :offer="row.offer"
                :href="`/dashboard/participant/virtual-auditorium/offers/${row.offer.id}`"
              />
            </template>
            <template #eventLabel="{ row }">
              <EventLabel
                :event="row.event"
                :href="`${landingUrl}/events/${row.event.id}`"
              />
            </template>

            <template #eventGoodType="{ row }">
              {{ goodType.get(row.event.goodType) }}
            </template>
            <template #bidAmount="{ row }">
              <MoneyLabel :amount="row.bid.amount" />
            </template>
            <template #paymentComissionAmount="{ row }">
              <MoneyLabel :amount="row.payment.comissionAmount" />
            </template>
            <template #invoiceFile="{ row }">
              <DownloadLabel
                :url="row.billingFile.path"
                :file-name="row.billingFile.name"
              />
            </template>
          </CustomTable>
        </CardContent>
      </Card>
      <CustomPagination
        v-if="paginatedInvoices.data.value.data"
        v-model:page="invoiceTableMvi.page.value"
        class="mt-5 mb-[19px]"
        :total="paginatedInvoices.data.value.count"
        :limit="paginatedInvoices.data.value.limit"
        @page-change="paginatedInvoices.refresh"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import CardContent from '../ui/card/CardContent.vue'
import { useInvoiceTableMvi } from './useInvoiceTable'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
import Card from '~/design-system/ui/card/Card.vue'
import OfferLabel from '~/design-system/ui/offer-label/OfferLabel.vue'
import EventLabel from '~/design-system/ui/event-label/EventLabel.vue'
import { goodType } from '~/constants/events'
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'

const invoiceTableMvi = useInvoiceTableMvi()
const { landingUrl } = useRuntimeConfig().public

const paginatedInvoices = await invoiceTableMvi.viewPaginatedInvoices()
</script>
