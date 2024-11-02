<script setup lang="ts">
import AuditoriumList from '~/components/virtual-auditorium/AuditoriumList.vue'
import OfferDetailsItem from '~/components/virtual-auditorium/OfferDetailsItem.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type { OfferListItem } from '~/types/Offer';
import type { IDataResponse } from '~/types/Common';
const { socket } = useSocketIo()

const onPlaceBid = ({ offerId, amount }: { offerId: string, amount: number }) => {
    socket.emit('placeBid', { offerId, amount });
}

const OFFER_BASE_URL = '/offer-management'
const options = ["Todos", "Finalizado", "Por vencer"];


const { page, sortOptions, } = useOfferAPI()
const filterOptions = ref('[]')
const selectedOffer = ref<OfferListItem | undefined>(undefined)
const offerList = ref<OfferListItem[]>([])
const { data: offerListData } = await useAPI<IDataResponse<OfferListItem>>(`${OFFER_BASE_URL}/find-offers-paginated-for-participant`, {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any)
offerList.value = offerListData.value.data

socket.on('bidError', (data) => {
    console.error('bidError',data)
})
socket.on('offerUpdated', (newOffer: OfferListItem) => {
    const offerIndex = offerList.value.findIndex(offerItem => offerItem.id === newOffer.id)
    if (offerIndex !== -1) {
        console.log('offerUpdated', newOffer.appraisal);
        offerList.value[offerIndex] = newOffer
        if(selectedOffer.value?.id === offerList.value[offerIndex].id) {
            selectedOffer.value = newOffer
        }
    }
})
</script>

<template>
    <section class="flex gap-x-[16px] w-full max-w-[1324px]">
        <div class="max-w-[901px]">
            <div class="flex h-[56px] items-center text-[#152A3C] justify-end mb-[8px] gap-x-[10px] px-[8px]">
                <label class="font-[600] text-[14px] md:text-[16px] leading-[24px]">Ordenar por:</label>
                <Select>
                    <SelectTrigger
                        class="max-w-[180px] text-[12px] md:text-[16px] font-[400] border border-[#CBD5E1] rounded-md p-2 text-[#152A3C]">
                        <SelectValue placeholder="Todos" class="max-w-[180px]"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="option in options" :key="option" :value="option"
                            class="flex justify-center text-center rounded-[8px] font-[500] text-[12px] md:text-[14px] p-[5px] text-[#152A3C] hover:bg-[#F1F5F9]">
                            {{ option }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <AuditoriumList :offerList="offerList" @onSelectOffer="(value) => { selectedOffer = value }" />
            <CustomPagination 
              class="mt-[32px]"
             :total="offerListData.count"
             v-model:page="page"
             :limit="8"
            />
        </div>
            <OfferDetailsItem  class="hidden xl:block" v-if="selectedOffer" :offer="selectedOffer" :onPlaceBid="onPlaceBid" />
    </section>
</template>
