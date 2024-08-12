<template>
    <section>
    <EventDetails :eventDetail="eventDetail" />
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
    <CustomTable
        :data="offerData"
        :header="offerHeader"
        @onSort="onSort"
        @onSearch="onSearch"
      >
      <template #action-button>
          <SheetTrigger @click="() => {}">
            <Button
              variant="default"
              >Confirmar oferta</Button
            >
          </SheetTrigger>
        </template>
        <template #attachedFiles>
          <div class="w-10 h-10 flex items-center justify-center rounded-full bg-[#0B38590A]">
            <CustomIcons name="Clip"  />
          </div>
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
              <DropdownMenuContent align="start" class="bg-primary text-white">
                <DropdownMenuItem
                  @click=""
                >
                  Debatir
                  <CustomIcons name="Reload" class="ml-auto" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #status="{ row }">
          <CustomChip :text="offerStatus.get(row.status)?.name || ''" :variant="offerStatus.get(row.status)?.color as any"></CustomChip>
        </template>
      </CustomTable>
      <!-- Fomulario -->
      <!-- Fomulario -->
    </div>
    <CustomPagination
      class="mt-5 mb-[19px]"
      :total="data.count"
      :limit="data.limit"
      v-model:page="page"
    />
   </section>
</template>
<script setup lang="ts">
import EventDetails from '~/components/events/EventDetails.vue';
const BASE_OFFERS_URL = '/offer-management'
import { offerHeader, offerStatus } from "@/constants/offer";
import type { OfferItem } from '~/types/Offer';
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue';
const route = useRoute()
const page = ref(1)
const filterOptions = ref('[]')
const sortOptions = ref('[]')
const { getEvent } = useEvent()
const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
}
const onSearch = (item: {[key: string]: string }) => {
    const filters = [
      { field: 'title', type: 'like', value: item.title || '' },
    ]
    filterOptions.value = JSON.stringify(filters)
}
Promise.all([
  getEvent(route.params.eventId as string),
  useAPI(`${BASE_OFFERS_URL}/find-offers`, {
    query: {
      limit: 8,
      page: 1,
      filterOptions: '[]',
      sortOptions: '[]'
    },
  } as any)
])
// [] = await Promise.all
const { data, refresh } : any = await useAPI(`${BASE_OFFERS_URL}/find-offers`, {
  query: {
    limit: 8,
    page,
    filterOptions,
    sortOptions
  },
} as any);
const { data: eventDetail } = await getEvent(route.params.eventId as string)
console.log('eventDetail', eventDetail.value)
const offerData= computed(() => data.value.data.map((item: OfferItem) => ({
    brandName: item.model.brand.name,
    modelName: item.model.name,
    addressCity: item.address.district.city.name,
    ...item
  })))
</script>