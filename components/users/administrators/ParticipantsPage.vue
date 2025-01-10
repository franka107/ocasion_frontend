<template>
  <ContentLayout title="Usuarios">
    <CustomSimpleCard
      title="Panel de participantes"
      class="mb-6"
      sub-title="Gestiona participantes"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="adminsData"
          :header="participantsHeader"
          :search="participantSearch()"
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #type="{ row }">
            <span class="whitespace-nowrap">{{
              userType.get(row.type) || ''
            }}</span>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="row.status === 'ACTIVE' ? 'Activo' : 'Suspendido'"
              :variant="row.status === 'ACTIVE' ? 'default' : 'destructive'"
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
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import { userType } from '~/constants/administrators'
import type { IAdminsLItem } from '@/types/Administrators.ts'
import { participantSearch, participantsHeader } from '~/constants/participants'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'

const route = useRoute()
const { page, sortOptions, onSort } = useAdmins()
const filterOptions = ref(
  `[{"field":"type","type":"equal","value": "PARTICIPANT"}]`,
)
const openModal = ref(false)
const admsUserId = ref<number | undefined>(undefined)
const BASE_ADM_URL = '/user-management'
const onSearch = (item: { [key: string]: string }) => {
  const filters = [
    { field: 'type', type: 'equal', value: 'PARTICIPANT' || '' },
    { field: 'commonName', type: 'like', value: item.commonName || '' },
    { field: 'email', type: 'like', value: item.email || '' },
    { field: 'phoneNumber', type: 'like', value: item.phoneNumber || '' },
    { field: 'status', type: 'equal', value: item.status || '' },
    {
      field: 'createdAt',
      type: 'equal',
      value: item.createdAt || '',
    },
  ]
  filterOptions.value = JSON.stringify(filters)
}

const { data }: any = await useAPI(
  `${BASE_ADM_URL}/find-participants-paginated`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const adminsData = computed(
  () => data.value.data,
  // data.value.data.map((item: IAdminsLItem) => ({
  //   fullName: `${item.firstName} ${item.lastName}`,
  //   document: `${item.documentType} - ${item.documentIdentifier}`,
  //   cellphone: item.phoneNumber,
  //   organization: item.organizations.map((org) => org.name).join(', '),
  //   ...item,
  // })),
)
</script>
