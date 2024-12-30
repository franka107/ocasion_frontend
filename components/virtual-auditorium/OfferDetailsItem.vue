<script setup lang="ts">
import { ref, computed, watch, toRefs } from 'vue'
import type { Socket } from 'socket.io-client'
import BidHistory from './BidHistory.vue'
import type { OfferListItem } from '~/types/Offer'
import { getRemainingTime } from '@/utils/countDown'
import ConfirmBidDialog from '~/components/virtual-auditorium/ConfirmBidDialog.vue'

const props = defineProps<{
  offer: OfferListItem
  onPlaceBid: ({ offerId, amount }: { offerId: string; amount: number }) => void
  socket: Socket
}>()

const subscribeError = ref(false)
props.socket.on('error', (data) => {
  const ERROR_NOT_SUBSCRIBED = data.errors.find(
    (error: { code: string }) =>
      error.code === 'AUCTION_MANAGEMENT.USER_NOT_SUBSCRIBED',
  )
  if (ERROR_NOT_SUBSCRIBED) {
    showModal.value = true
    subscribeError.value = true
  }
})

const { offer } = toRefs(props)
const useCountDown = (offer: Ref<OfferListItem>) => {
  const endMiliseconds = computed(() => getRemainingTime(offer.value.endTime))
  const countDownkey = ref(0)
  watch(offer, () => {
    countDownkey.value += 1
  })
  return { countDownkey, endMiliseconds }
}
const { countDownkey, endMiliseconds } = useCountDown(offer)

const offerNewBid = () => {
  const bidValue = ref(0)
  const onFocusInput = ref(false)
  const invalidBidAmount = computed(
    () => bidValue.value < (offer.value.bids[0].amount || 0) + 50,
  )
  const errorMessage = computed<string | undefined>(() =>
    onFocusInput.value && invalidBidAmount.value
      ? 'La oferta debe superar como mínimo en 50 al valor actual.'
      : undefined,
  )
  const quickActions = ref([
    { label: '+ $ 50.00', value: 50 },
    { label: '+ $ 100.00', value: 100 },
    { label: '+ $ 150.00', value: 150 },
    { label: '+ $ 200.00', value: 200 },
    { label: '+ $ 250.00', value: 250 },
  ])
  const onQuickAction = (value: number) => {
    bidValue.value = (offer.value.bids[0].amount || 0) + value
  }
  const isDisabledButton = (totalSeconds: number) =>
    totalSeconds === 0 ||
    invalidBidAmount.value ||
    offer.value.status === 'DEBATED'

  return {
    bidValue,
    errorMessage,
    quickActions,
    onQuickAction,
    invalidBidAmount,
    onFocusInput,
    isDisabledButton,
  }
}
const {
  bidValue,
  errorMessage,
  quickActions,
  onQuickAction,
  onFocusInput,
  invalidBidAmount,
  isDisabledButton,
} = offerNewBid()

const showModal = ref(false)
const onSubmitBid = () => {
  if (!invalidBidAmount.value) {
    props.onPlaceBid({ offerId: offer.value.id, amount: bidValue.value })
    // showModal.value = true
  }
}
const eventApi = useEvent()
const { data: eventDetail } = await eventApi.viewEvent(
  offer.value.event?.id || '',
)
</script>
<template>
  <section class="flex justify-center">
    <ConfirmBidDialog
      v-if="subscribeError"
      v-model="showModal"
      :on-place-bid="onPlaceBid"
      :bid="bidValue"
      :event-id="offer.event?.id || ''"
      :offer-id="offer.id"
    />
    <Countdown
      :key="countDownkey"
      v-slot="{ days, hours, minutes, seconds, totalSeconds }"
      :time="endMiliseconds"
    >
      <div class="grid mx-auto">
        <div
          class="w-full max-w-[350px] min-h-0-h-[394px] flex flex-col shadow-[0px_0px_4px_0px_#0000001A] bg-white rounded-[8px] overflow-hidden"
        >
          <!-- Contador en cajitas -->
          <div
            class="text-[#FFFFFF] text-[14px] leading-[16.41px] font-[500] bg-[#C7E0F0] text-center py-[8px]"
          >
            <div
              class="flex items-center space-x-2 justify-center text-[#152A3C] text-[10px] font-[600]"
            >
              <div
                class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center"
              >
                {{ days }}<span class="text-[#F6313C] ml-[3px]">d</span>
              </div>
              <span>:</span>
              <div
                class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center"
              >
                {{ hours }}<span class="text-[#F6313C] ml-[3px]">h</span>
              </div>
              <span>:</span>
              <div
                class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center"
              >
                {{ minutes }}<span class="text-[#F6313C] ml-[3px]">m</span>
              </div>
              <span>:</span>
              <div
                class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center"
              >
                {{ seconds }}<span class="text-[#F6313C] ml-[3px]">s</span>
              </div>
            </div>
          </div>
          <!-- Información de la tarjeta -->
          <div class="px-3 py-5">
            <div class="">
              <div
                class="flex justify-between mb-[16px] text-[#20445E] text-[12px] leading-[25px]"
              >
                <p class="font-[600">Evento: {{ offer.event?.name }}</p>
                <p class="font-[400]">{{ eventDetail.offerCount }} ofertas</p>
              </div>
              <h2
                class="text-[#152A3C] text-[16px] font-[600] leading-[24px] pb-[16px] uppercase"
              >
                {{ offer.title }}
              </h2>
              <div class="flex flex-col">
                <div class="flex gap-x-[4px] leading-[16px]">
                  <p
                    class="text-[#68686C] text-[12px] font-[600] text-center mb-[5.5px] flex items-center"
                  >
                    Valor actual
                  </p>
                  <button type="button" class="mb-[4px]">
                    <CustomIcons
                      name="Info"
                      class="mt-[1.5px] w-4 h-4 text-primary"
                    />
                  </button>
                </div>
                <p class="font-[700] text-[14px] text-[#20445E] mb-4">
                  USD ${{ offer.bids[0]?.amount || offer.initialValue }}
                </p>
              </div>
            </div>
            <div class="mb-4">
              <div class="flex justify-between space-x-[10px] mb-1">
                <div class="flex">
                  <Input
                    v-model="bidValue"
                    type="number"
                    placeholder="0.00"
                    class="focus-visible:ring-transparent rounded-[6px_0_0_6px]"
                    @focus="onFocusInput = true"
                  />
                  <div
                    class="w-10 flex justify-center items-center bg-[#E6E6E7] rounded-[0_6px_6px_0]"
                  >
                    <img src="@/assets/icon/svg/arrow_up.svg" alt="" />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="default"
                  class="py-[10px] px-[24px]"
                  :disabled="isDisabledButton(totalSeconds)"
                  @click="onSubmitBid"
                >
                  Ofertar
                </Button>
              </div>
              <p
                v-if="errorMessage"
                class="text-[#F6313C] text-[12px] font-[400]"
              >
                {{ errorMessage }}
              </p>
            </div>
            <div class="flex flex-col">
              <div class="flex gap-x-[4px] leading-[16px]">
                <p
                  class="text-[#68686C] text-[14px] font-[600] text-center mb-[8px] flex items-center"
                >
                  Acciones rápidas
                </p>
                <CustomIcons
                  name="Info"
                  class="mt-[1.5px] w-4 h-4 text-primary"
                />
              </div>
              <div class="flex flex-col items-center">
                <div
                  class="flex flex-wrap justify-center gap-y-[8px] gap-x-[16px] px-[22px]"
                >
                  <Button
                    v-for="(action, index) in quickActions"
                    :key="index"
                    type="button"
                    class="w-[83px] h-[34px] px-4 py-1 text-[14px] border border-bluePrimary text-bluePrimary font-[600] hover:text-white hover:bg-bluePrimary rounded-[8px] bg-white"
                    @click="onQuickAction(action.value)"
                  >
                    {{ action.label }}
                  </Button>
                </div>
              </div>
            </div>
            <template v-if="offer.bids.length">
              <hr class="border-gray-100 border-[1.5px] my-4" />
              <BidHistory :bids="offer.bids" />
            </template>
          </div>
        </div>
      </div>
    </Countdown>
  </section>
</template>
