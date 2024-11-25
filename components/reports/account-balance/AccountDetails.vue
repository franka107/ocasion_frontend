<template>
    <div class="w-full gap-x-4 bg-white rounded-xl mb-[24px] p-[16px]">
        <h1 class="font-[600] text-[#363636] text-[18px] mb-[12px]">Resumen de transacciones</h1>
        <div class="flex flex-wrap md:flex-nowrap justify-center gap-y-[2px] gap-x-[12px]">
            <div v-for="(card, index) in cardsData" :key="index"
                class="max-w-[151.43px] bg-[#F3F8FC] px-[12px] py-[17.5px] flex flex-col rounded-[8px] w-full">                
                <h3 class="text-[24px] text-[#152A3C] font-[700] leading-[32px]  mb-[4px]">
                    {{ card.amountKey }}
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
const cardsData = ref([
  {
    subtitle: 'Total Ingresos',
    amountKey: '00',
  },
  {
    subtitle: 'Total Egresos',
    amountKey: '00',
  },
  {
    subtitle: 'Total Penalidades',
    amountKey: '00',
  },
  {
    subtitle: 'Total Garantizada',
    amountKey: '00',
  },
  {
    subtitle: 'Total Saldo',
    amountKey: '00',
  },
  {
    subtitle: 'Total retiro pendiente',
    amountKey: '00',
  },
  {
    subtitle: 'Total recarga pendiente',
    amountKey: '00',
  },
])
</script>