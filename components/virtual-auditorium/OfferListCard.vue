<script setup lang="ts">
import { Expand, Maximize, Trash } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
import type { OfferDto, OfferListItem } from '~/types/Offer'
import { getRemainingTime } from '@/utils/countDown'
import Dialog from '~/design-system/ui/dialog/Dialog.vue'
import DialogTrigger from '~/design-system/ui/dialog/DialogTrigger.vue'
import DialogTitle from '~/design-system/ui/dialog/DialogTitle.vue'
import DialogDescription from '~/design-system/ui/dialog/DialogDescription.vue'
import DialogFooter from '~/design-system/ui/dialog/DialogFooter.vue'
import Album from '~/design-system/ui/album/Album.vue'
import Thumbnails from '~/design-system/ui/thumbnails/Thumbnails.vue'
const props = defineProps<{ offer: OfferDto }>()
const { offer } = toRefs(props)
const key = ref(0)
const endMiliseconds = ref(getRemainingTime(offer.value.endTime))
watch(offer, () => {
  key.value++
  endMiliseconds.value = getRemainingTime(offer.value.endTime)
})
const { clear, user } = useUserSession()
const emit = defineEmits(['click'])

const cardClass = (totalSeconds: number, offer: OfferListItem) => {
  const SHOW_ALERT_ON_SECOND = 120
  const BID_WINNER_STATUS = 'WINNER'

  if (totalSeconds <= 0) {
    if (user.value?.user.id === offer.bids[0]?.userId) {
      return 'overlay-item border-2 border-green-400'
    } else {
      return 'overlay-item border-2 border-[#ffffff]'
    }
  } else if (totalSeconds < SHOW_ALERT_ON_SECOND) {
    return 'animate-twinkle-border'
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
  <Dialog>
    <Countdown
      :key="key"
      v-slot="{ days, hours, minutes, seconds, totalSeconds }"
      :time="endMiliseconds"
    >
      <div
        tabindex="0"
        :class="
          cn(
            `w-full border-2 flex flex-col box-content relative shadow-[0px_0px_4px_0px_#0000001A] cursor-pointer max-w-[238px]
       rounded-lg overflow-hidden border-box bg-primary-50 border-[#ffffff] focus:border-2 focus:!border-[#414967]`,
            cardClass(totalSeconds, offer),
          )
        "
        @click="$emit('click', $event)"
      >
        <!-- Contador en cajitas -->
        <div
          class="bg-[#C7E0F0] text-white text-sm font-medium text-center py-2"
        >
          <div
            class="flex items-center space-x-2 justify-center text-[#152A3C] text-xs font-semibold px-2"
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
          <div class="h-24 relative">
            <img
              :src="offerImage"
              alt="Imagen"
              class="absolute inset-0 w-full h-full object-cover rounded-md"
            />

            <DialogTrigger as-child>
              <Button
                class="absolute bottom-1 right-1"
                variant="outline"
                size="xs"
              >
                <Maximize class="w-[13px] h-[13px]" />
              </Button>
            </DialogTrigger>
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

    <DialogContent class="lg:min-w-[800px]">
      <DialogHeader>
        <DialogTitle>{{ offer.title }}</DialogTitle>
        <DialogDescription>
          Archivos adjuntos relacionados al bien
        </DialogDescription>
      </DialogHeader>
      <div>
        <Thumbnails orientation="horizontal" :files="offer.attachedFiles" />
      </div>
    </DialogContent>
  </Dialog>
</template>
<style scoped>
.overlay-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(243, 248, 252, 0.5);
  z-index: 1;
}
</style>
