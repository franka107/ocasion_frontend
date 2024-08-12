<template>
    <section>
        <OrganizationDetails :data="organizationSummary" /> 
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-4">
      <CustomTable :data="eventsData" :header="eventListHeaders" @onSort="onSort" @onSearch="onSearch">
        <template #type="{ row }">
          <span class="whitespace-nowrap">{{  eventType.get(row.type) || '' }}</span>
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
              <DropdownMenuContent align="start" class="bg-primary text-white w-40">
                <DropdownMenuItem>
                  <NuxtLink :to="`/dashboard/events/organization/${row.rucNumber}/event/${row.id}`">Ver Evento</NuxtLink>
                  <CustomIcons name="EyeIcon" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleSuspend(row.rucNumber)">
                  Editar
                  <CustomIcons name="Pen" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleActivate(row.rucNumber)" >
                  Cancelar
                  <CustomIcons name="Close" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #status="{ row }">
          <CustomChip :text="eventStatus.get(row.status)?.name || ''" :variant="eventStatus.get(row.status)?.color as any"></CustomChip>
        </template>
      </CustomTable>
    </div>
    <CustomPagination class="mt-5 mb-[19px]" :total="data.count" :limit="data.limit" v-model:page="page" />

    </section>
</template>
<script setup lang="ts">
import OrganizationDetails from '@/components/organizations/OrganizationDetails.vue';
import CustomTable from '@/components/ui/custom-table/CustomTable.vue';
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue';
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue';
import { eventListHeaders, eventStatus, eventType } from '~/constants/events';
import type { IEventLItem, IOrganizationSummary } from '@/types/Event';
import type { IDataResponse } from '@/types/Common';

const { page, sortOptions, onSort } = useEvent()

const router = useRoute()
// const filterOptions = ref(`[{ "field": "organization.rucNumber", "type": "equal", "value": "${router.params.rucId}" }]`)
const filterOptions = ref(`[]`)
const onSearch = (item: {[key: string]: string }) => {
    filterOptions.value = JSON.stringify([
      { field: 'name', type: 'like', value: item.name || '' },
    ])
}
const BASE_ORG_URL = '/event-management'
const [ eventListData, organizationSummaryData]= await Promise.all([
    useAPI<IDataResponse<IEventLItem[]>>(`${BASE_ORG_URL}/find-events`, {
    query: {
        limit: 6,
        page,
        filterOptions,
        sortOptions
    },
    } as any),
    useAPI<IOrganizationSummary>(`${BASE_ORG_URL}/get-events-summary`, { query: { organizationRucNumber: router.params.rucId }} as any)
])
const { data, refresh } = eventListData
const organizationSummary = organizationSummaryData.data.value
const eventsData = computed(() => data.value.data)

const handleSuspend = async (rucNumber: string) => {
  console.log("rucNumber", rucNumber);
  
  const { status: suspendStatus } : any = await useAPI(`${BASE_ORG_URL}/suspend-organization`,{
      method: 'POST',
      body: {
        rucNumber, 
      }
    } as any);
  refresh()
}

const handleActivate = async (rucNumber: string) => {
  console.log("rucNumber", rucNumber);
  
  const { status: activateStatus } : any = await useAPI(`${BASE_ORG_URL}/activate-organization`,{
      method: 'POST',
      body: {
        rucNumber, 
      }
    } as any);
  refresh()
}

</script>