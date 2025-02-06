<template>
  <ContentLayout title="Reporte de lotes de desembolsos">
    <CustomSimpleCard
      title="Listado de reportes de lotes de desembolsos"
      class="mb-6"
      sub-title="Vizualización de reporte de lotes de desembolsos de los participantes"
    />
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="disbursementData"
          :header="disbursementHeader"
          :search="disbursementSearch"
          show-more-button
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #action-button>
            <Button variant="default" @click="handleExport">
              <CustomIcons name="Download" class="ml-auto" />
              Exportar
            </Button>
            <!-- </div> -->
          </template>
          <template #archive="{ row }">
            <div class="flex items-center justify-center">
              <NuxtLink
                v-if="row.voucherGeneratedFile?.path"
                :to="row.voucherGeneratedFile.path"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center"
              >
                <CustomIcons name="Doc-Loupe" />
              </NuxtLink>
              <span v-else>-</span>
            </div>
          </template>
          <template #proofOfDisbursement="{ row }">
            <div class="flex items-center justify-center">
              <NuxtLink
                v-if="row.paymentSupportFile && row.paymentSupportFile[0]?.path"
                :to="row.paymentSupportFile[0].path"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center"
              >
                <CustomIcons name="Doc-Loupe" />
              </NuxtLink>
              <span v-else>-</span>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="disbursementStatus.get(row.status)?.name || ''"
              :variant="disbursementStatus.get(row.status)?.color as any"
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
import { ref } from 'vue'
import dayjs from 'dayjs'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { useDisbursement } from '@/composables/useDisbursement'
import type { IDataResponse } from '~/types/Common'
import type { DisbursementLot } from '~/types/Disbursement'
import {
  disbursementStatus,
  disbursementHeader,
  disbursementSearch,
} from '~/constants/reports'

const { page, onSort, onSearch, filterOptions, sortOptions, handleExport } =
  useDisbursement('not-pendings')

const BASE_DIS_URL = '/finance/disbursement-management'

const { data, refresh } = await useAPI<IDataResponse<DisbursementLot>>(
  () => `${BASE_DIS_URL}/view-paginated-disbursement-lots`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const disbursementData = computed(() =>
  data.value?.data.map((item: DisbursementLot) => ({
    ...item,
    createdAt: dayjs(item.createdAt).format('YYYY-MM-DD'),
  })),
)
</script>
