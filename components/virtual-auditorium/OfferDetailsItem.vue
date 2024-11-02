<script setup lang="ts">
import { ref } from 'vue';
import type { OfferListItem } from '~/types/Offer';
import { getRemainingTime } from '@/utils/countDown'
import ConfirmBidDialog from '~/components/virtual-auditorium/ConfirmBidDialog.vue';

const props = defineProps<{ offer: OfferListItem, onPlaceBid: ({ offerId, amount }: { offerId: string, amount: number }) => void }>();
const { offer } = toRefs(props);
const useCountDown = (offer: Ref<OfferListItem>) => {
    const endMiliseconds = computed(() => getRemainingTime(offer.value.endTime))
    const countDownkey = ref(0);
    watch(offer, (newVal) => {
        countDownkey.value += 1;
    });
    return { countDownkey, endMiliseconds };
}
const { countDownkey, endMiliseconds } = useCountDown(offer);

const offerNewBid = () => {
    const bidValue = ref(0);
    const onFocusInput = ref(false);
    const invalidBidAmount = computed(() => bidValue.value < ((offer.value.bid?.amount || 0) + 50));
    const errorMessage = computed<string | undefined>(() => 
        onFocusInput.value && invalidBidAmount.value? "La oferta debe superar como mínimo en 50 al valor actual." : undefined);
    const quickActions = ref([
      { label: "+ $ 50.00", value: 50 },
      { label: "+ $ 100.00", value: 100 },
      { label: "+ $ 150.00", value: 150 },
      { label: "+ $ 200.00", value: 200 },
      { label: "+ $ 250.00", value: 250 }
    ]);
    const onQuickAction = (value: number) => {
        bidValue.value = (offer.value.bid?.amount || 0) + value;
    }
    const isDisabledButton = (totalSeconds: number) =>  totalSeconds === 0 || invalidBidAmount.value || offer.value.status === 'DEBATED';
    
    return { bidValue, errorMessage, quickActions, onQuickAction, invalidBidAmount, isDisabledButton, onFocusInput };
}
const { bidValue, errorMessage, quickActions, onQuickAction, isDisabledButton, onFocusInput, invalidBidAmount } = offerNewBid();

const showModal = ref(false);
const onSubmitBid = () => {
    if(!invalidBidAmount.value) {
        showModal.value = true;
        console.log('Oferta realizada');
    }
}
</script>
<template>
    <section class="flex justify-center">
        <ConfirmBidDialog v-model="showModal" :onPlaceBid="onPlaceBid" :bid="bidValue" :offerId="offer.id"  />
        <Countdown
            :key="countDownkey"
            :time="endMiliseconds"
            v-slot="{ days, hours, minutes, seconds, totalSeconds }"
        >
            <div class="grid grid-cols-1 mx-auto">
                <div class="max-w-[350px] max-h-[394px] flex flex-col shadow-[0px_0px_4px_0px_#0000001A] bg-white rounded-[8px] overflow-hidden">
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
                    <div class="px-[8px] pt-[20px] pb-[16px]">
                        <div class="flex justify-between text-[#20445E] text-[12px] leading-[25px]">
                            <p class="font-[600] mb-[16px]">Nombre evento</p>
                            <p class="font-[400]">00 ofertas</p>
                        </div>
                        <h2 class="text-[#152A3C] text-[14px] font-[700] leading-[24px] pb-[16px] uppercase">
                            {{ offer.title }}
                        </h2>
                        <div class="flex flex-col">
                            <div class="flex gap-x-[4px] leading-[16px]">
                                <p class="text-[#68686C] text-[12px] font-[600] text-center mb-[4px] flex items-center ">
                                    Valor actual
                                </p>
                                <CustomIcons name="Info" class="mt-[1.5px] w-4 h-4 text-primary" />
                            </div>
                            <p class="font-[700] text-[14px] text-[#20445E] mb-1">USD ${{ offer.bid?.amount || 0 }}</p>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between space-x-[10px] mb-1">
                                <div class="flex">
                                    <Input v-model="bidValue" type="number" placeholder="0.00" @focus="onFocusInput = true" class="focus-visible:ring-transparent rounded-[6px_0_0_6px]" />
                                    <div class="w-10 flex justify-center items-center bg-[#E6E6E7] rounded-[0_6px_6px_0]">
                                        <img src="@/assets/icon/svg/arrow_up.svg" alt="">
                                    </div>
                                </div>
                                <Button @click="onSubmitBid" type="button" variant="default" :disabled="isDisabledButton(totalSeconds)" class="py-[10px] px-[24px]">
                                    Ofertar
                                </Button>
                            </div>
                            <p v-if="errorMessage" class="text-[#F6313C] text-[12px] font-[400]">{{ errorMessage }}</p>
                        </div>
                        <div class="flex flex-col">
                            <div class="flex gap-x-[4px] leading-[16px]">
                                <p class="text-[#68686C] text-[14px] font-[600] text-center mb-[8px] flex items-center ">
                                    Acciones rápidas
                                </p>
                                <CustomIcons name="Info" class="mt-[1.5px] w-4 h-4 text-primary" />
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="flex flex-wrap justify-center gap-y-[8px] gap-x-[16px] px-[22.5px]">
                                <Button
                                    v-for="(action, index) in quickActions"
                                    :key="index"
                                    type="button"
                                    @click="onQuickAction(action.value)"
                                    class="w-[83px] h-[34px] px-4 py-1 text-[14px] border border-bluePrimary text-bluePrimary font-[600] hover:text-white hover:bg-bluePrimary rounded-[8px] bg-white"
                                >
                                    {{ action.label }}
                                </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Countdown>
    </section>
</template>
