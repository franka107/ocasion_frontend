<template>
  <ContentLayout title="Mi monedero">
    <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
    <section>
      <PurseDetails></PurseDetails>
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-4">
        <div
          class="px-0 py-[31.5px] text-[#262F45] text-[18px] font-[700] border-b-[1px] border-[#E2E8F0]"
        >
          <h2>Historial de transacciones</h2>
        </div>
        <CustomTable
          :data="purseData"
          :header="purseHeader"
          :search="purseSearch"
          class="bg-[#E6F0F8] rounded-t-lg"
          @on-sort="onSort"
          @on-search="onSearch"
        >
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
import PurseDetails from '@/components/purse/PurseDetails.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import { purseHeader, purseSearch } from '~/constants/purse'

import ContentLayout from '~/layouts/default/ContentLayout.vue'
const { page, sortOptions, onSort, createEvent, editEvent, cancelEvent } =
  useEvent()
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
console.log(myGrants)

const filterOptions = ref(JSON.stringify([]))

const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([])
}
const purseData = ref([])
</script>

