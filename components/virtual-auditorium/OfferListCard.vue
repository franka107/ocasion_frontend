<script setup lang="ts">
import type { OfferListItem } from '~/types/Offer'
import { getRemainingTime } from '@/utils/countDown'
const props = defineProps<{ offer: OfferListItem }>()
const { offer } = toRefs(props)
const key = ref(0)
const endMiliseconds = ref(getRemainingTime(offer.value.endTime))
watch(offer, () => {
  key.value++
  endMiliseconds.value = getRemainingTime(offer.value.endTime)
})
const cardClass = (totalSeconds: number, offer: OfferListItem) => {
  const SHOW_ALERT_ON_SECOND = 120
  const BID_WINNER_STATUS = 'WINNER'

  if (totalSeconds <= 0) {
    if (offer.bid?.status === BID_WINNER_STATUS) {
      return 'border-2 border-green-400'
    } else {
      return 'border-2 border-black-600'
    }
  } else if (totalSeconds < SHOW_ALERT_ON_SECOND) {
    return 'animate-twinkle-shadow'
  }
  return ''
}
const router = useRouter()
const handleEventsDetail = async (offerId: string) => {
  router.push(`/dashboard/participant/virtual-auditorium/offers/${offerId}`)
}

const offerImage = offer.value.attachedFiles[0].path
</script>
<template>
  <Countdown
    :key="key"
    v-slot="{ days, hours, minutes, seconds, totalSeconds }"
    :time="endMiliseconds"
  >
    <div
      tabindex="0"
      :class="
        cn(
          `w-full flex flex-col box-content shadow-[0px_0px_4px_0px_#0000001A] cursor-pointer max-w-[238px]
       bg-white rounded-lg overflow-hidden border-box focus:border-2 border-transparent focus:border-[#414967]`,
          cardClass(totalSeconds, offer),
        )
      "
    >
      <!-- Contador en cajitas -->
      <div class="bg-[#C7E0F0] text-white text-sm font-medium text-center py-2">
        <div
          class="flex items-center space-x-2 justify-center text-[#152A3C] text-xs font-semibold"
        >
          <div
            class="w-9 h-5 border border-[#152A3C] rounded-md flex items-center justify-center"
          >
            {{ days }}<span class="text-[#F6313C] ml-1">d</span>
          </div>
          <span>:</span>
          <div
            class="w-9 h-5 border border-[#152A3C] rounded-md flex items-center justify-center"
          >
            {{ hours }}<span class="text-[#F6313C] ml-1">h</span>
          </div>
          <span>:</span>
          <div
            class="w-9 h-5 border border-[#152A3C] rounded-md flex items-center justify-center"
          >
            {{ minutes }}<span class="text-[#F6313C] ml-1">m</span>
          </div>
          <span>:</span>
          <div
            class="w-9 h-5 border border-[#152A3C] rounded-md flex items-center justify-center"
          >
            {{ seconds }}<span class="text-[#F6313C] ml-1">s</span>
          </div>
        </div>
      </div>
      <!-- Información de la tarjeta -->
      <div class="px-2 py-2">
        <div class="h-24">
          <img
            :src="offerImage"
            alt="Imagen del auto"
            class="w-full h-full object-cover rounded-md"
          />
        </div>
        <p class="text-[#152A3C] text-[12px] font-[700] my-3 leading-2">
          N°{{ offer.id }}
        </p>
        <h2 class="text-[#20445E] text-sm font-semibold leading-4 pb-2">
          {{ offer.title }}
        </h2>
        <div
          class="flex items-center justify-between space-x-2 text-[#68686C] text-xs font-semibold mb-2"
        >
          <div class="flex items-center">
            <span>Valor actual</span>
            <CustomIcons name="Info" class="w-5 h-5 text-primary" />
          </div>
          <span class="font-bold text-sm text-[#20445E]"
            >USD ${{ offer.bids[0]?.amount }}</span
          >
        </div>
        <div class="flex justify-end">
          <button
            class="px-4 py-1 text-sm text-[#388EBF] font-medium hover:text-white hover:bg-bluePrimary rounded-md"
            @click="handleEventsDetail(offer.id)"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  </Countdown>
</template>
