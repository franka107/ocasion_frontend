<script setup lang="ts">
import type { OfferListItem } from '~/types/Offer';
import { getRemainingTime } from '@/utils/countDown'
const props = defineProps<{ offer: OfferListItem }>()
const { offer } = toRefs(props)
const key = ref(0)
const endMiliseconds = ref(getRemainingTime(offer.value.endTime)) 
watch(offer,() => { 
  key.value++
  endMiliseconds.value = getRemainingTime(offer.value.endTime)
})
const cardClass = (totalSeconds: number, offer: OfferListItem) => {
  const SHOW_ALERT_ON_SECOND = 120
  const BID_WINNER_STATUS = 'WINNER'

  if(totalSeconds <= 0) {
    if(offer.bid?.status === BID_WINNER_STATUS) {
      return 'border-2 border-green-400'
    } else {
      return 'border-2 border-black-600'
    }
  } else if(totalSeconds < SHOW_ALERT_ON_SECOND) {
    return 'animate-twinkle-shadow'
  }
  return ''
}
</script>
<template> 
  <Countdown
    :key="key"
    :time="endMiliseconds"
    v-slot="{ days, hours, minutes, seconds, totalSeconds }"
  >
    <div
      tabindex="0"
      :class="cn(`w-[219px] h-[300px] flex flex-col box-content shadow-[0px_0px_4px_0px_#0000001A] cursor-pointer
       bg-white rounded-[8px] overflow-hidden border-box focus:border-2 border-transparent focus:border-[#414967]`, cardClass(totalSeconds, offer))">
      <!-- Contador en cajitas -->
      <div class="text-[#FFFFFF] text-[14px] leading-[16.41px] font-[500] bg-[#C7E0F0] text-center py-[8px]">
        <div class="flex items-center space-x-2 justify-center text-[#152A3C] text-[10px] font-[600]">
          <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center">
            {{ days }}<span class="text-[#F6313C] ml-[3px]">d</span>
          </div>
          <span>:</span>
          <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center">
            {{ hours }}<span class="text-[#F6313C] ml-[3px]">h</span>
          </div>
          <span>:</span>
          <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center ">
            {{ minutes }}<span class="text-[#F6313C] ml-[3px]">m</span>
          </div>
          <span>:</span>
          <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center">
            {{ seconds }}<span class="text-[#F6313C] ml-[3px]">s</span>
          </div>
        </div>
      </div>  
      <!-- Información de la tarjeta -->
      <div class="px-[8px] py-[8px]">
        <div class="h-[99px]">
            <img src="/assets/img/auto_card.png" alt="Imagen del auto" class="w-full h-full object-cover rounded-[8px]" />
        </div>  
        <p class="text-[#152A3C] text-[12px] font-[700] my-[12px] leading-[9px]">N°{{ offer.id }}</p>
        <h2 class="text-[#20445E] text-[14px] font-[600] leading-[16px] pb-[8px]">
          {{ offer.title }}
        </h2>
        <p class="text-[#68686C] text-[12px] font-[600] text-center leading-[20px] mb-[8px] flex items-center justify-between">
            Valor actual 
            <CustomIcons name="Info" class="w-4 h-4 text-primary" />
            <span class="font-[700] text-[14px] text-[#20445E] ">USD ${{ offer.bid?.amount || 0 }}</span>
        </p>

        <div class="flex justify-end">
          <button
            class="px-4 py-1 text-[14px] text-[#388EBF] font-[500] hover:text-white hover:bg-bluePrimary rounded-[8px]"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  </Countdown>
</template>
