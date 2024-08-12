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
          <SheetTrigger @click="() => { offerId = undefined; openSheet('offer-form') }">
            <Button
              variant="default"
              >Crear oferta</Button
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
          <CustomChip :text="offerStatus.get(row.status)?.name || ''" :variant="offerStatus.get(row.status)?.color as any" ></CustomChip>
        </template>
      </CustomTable>
      <SheetContent
          class="flex flex-col h-full"
        >
          <OfferForm
            :id="offerId"
            :orgRucNumber="route.params.rucId as string"
            :onsubmit="offerId !== undefined ? handleEdit : handleCreate"
          />
        </SheetContent>
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
import OfferForm from '@/components/offers/OfferForm.vue';
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { currentSheet, openSheet, closeSheet } = useSheetStore();
const { page, sortOptions, filterOptions, onSort, onSearch, createOffer, editOffer } = useOfferAPI()

const route = useRoute()
const { getEvent } = useEvent()
const offerId = ref(undefined)

Promise.all([
  getEvent(route.params.eventId as string),
  useAPI(`${BASE_OFFERS_URL}/find-offers`, {
    query: {
      limit: 8,
      page,
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

const offerData= computed(() => data.value.data.map((item: OfferItem) => ({
    brandName: item.model.brand.name,
    modelName: item.model.name,
    addressCity: item.address.district.city.name,
    ...item
  })))


  const handleCreate = async (values: any) => {
  openConfirmModal({title:'Crear Oferta', message: '¿Estás seguro de que deseas crear este Oferta?', callback: async() => {
    const { status, error } : any = await createOffer(values)
    if(status.value === 'success') {
        closeSheet();
        refresh();
        updateConfirmModal({title: 'Oferta creado', message: 'La oferta ha sido creada exitosamente', type: 'success'});
    } else {
      
        const eMsg = error.value.data?.errors?.[0].message || error.value.data.message || 'La oferta no se pudo crear, intentalo más tarde'  
        updateConfirmModal({title: 'Error al crear Oferta', message: eMsg, type: 'error'});
    } 
  }})
};

const handleEdit = async (values: any) => {
  openConfirmModal({ title: 'Actualizar Oferta', message: '¿Estás seguro de que deseas actualizar este Oferta?', callback: async() => {
    const { status, error } : any = await editOffer(values)
    if(status.value === 'success') {
        closeSheet();
        refresh();
        updateConfirmModal({title: 'Oferta actualizada', message: 'La oferta ha sido actualizado exitosamente', type: 'success'});
    } else {
        const eMsg = error.value.data?.errors?.[0].message || error.value.data.message || 'El evento no se pudo actualizar, intentalo más tarde'  
        updateConfirmModal({title: 'Error al crear evento', message: eMsg, type: 'error'});
    } 
  }})
};
</script>