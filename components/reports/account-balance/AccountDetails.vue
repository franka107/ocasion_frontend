<template>
  <div class="w-full gap-x-4 bg-white rounded-xl mb-[24px] p-[16px]">
    <h1 class="font-[600] text-[#363636] text-[18px] mb-[12px]">
      Resumen de transacciones
    </h1>
    <div
      class="flex flex-wrap md:flex-nowrap justify-center gap-y-[2px] gap-x-[12px]"
    >
      <div
        v-for="(card, index) in cardsData"
        :key="index"
        class="max-w-[151.43px] bg-[#F3F8FC] px-[12px] py-[17.5px] flex flex-col rounded-[8px] w-full"
      >
        <h3
          class="text-[24px] text-[#152A3C] font-[700] leading-[32px] mb-[4px]"
        >
          <MoneyLabel
            :amount="walletsResumeData[card.amountKey]"
            class="text-xl justify-start p-0"
          />
        </h3>
        <div class="flex justify-between items-center">
          <h4 class="text-[12px] text-[#6B7280] font-[400] leading-[11px]">
            {{ card.subtitle }}
          </h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'

const props = defineProps<{
  walletsResumeData: Record<string, number>
}>()

const cardsData = ref([
  {
    subtitle: 'Total Ingresos',
    amountKey: 'totalChangeBalance',
  },
  {
    subtitle: 'Total Egresos',
    amountKey: 'totalDischargeBalance',
  },
  {
    subtitle: 'Total Penalidades',
    amountKey: 'totalPenaltyBalance',
  },
  {
    subtitle: 'Total Garantizada',
    amountKey: 'totalGuaranteedBalance',
  },
  {
    subtitle: 'Total Saldo',
    amountKey: 'totalAvailableBalance',
  },
  {
    subtitle: 'Total retiro pendiente',
    amountKey: 'totalPendingWithdrawalBalance',
  },
  {
    subtitle: 'Total recarga pendiente',
    amountKey: 'totalPendingRechargeBalance',
  },
])
</script>
