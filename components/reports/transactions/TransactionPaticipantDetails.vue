<template>
 <div class="w-full gap-x-4 mb-6">
  <div class="w-[100%] bg-white rounded-xl px-[24px] ">
    <h2 class="font-[700] text-[#152A3C] text-[24px] pt-[8px]" >
      {{ participant.commonName }}
    </h2> 
    <div
      class="flex flex-wrap md:flex-nowrap justify-center gap-y-[32px] gap-x-[32px] py-6"
    >
      <div
        v-for="(card, index) in cardsData"
        :key="index"
        class="max-w-[356px] bg-[#F3F8FC] p-4 flex flex-col rounded-[8px] w-full"
      >
        <div class="flex justify-between items-center">
          <h4
            class="text-[16px] text-[#20445E] font-[500] leading-[15px] mb-[16px]"
          >
            {{ card.subtitle }}
          </h4>
        </div>
        <h3
          class="text-[20px] text-[#152A3C] font-bold leading-[14px] mb-[16px]"
        >
          ${{ purseDetail[card.amountKey] }}
        </h3>
        <p class="font-[400] text-[12px] text-[#86868A] leading-[15px]">
          {{ card.description }}
        </p>
      </div>
    </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ComparisonModule from '~/components/kpis/ComparisonModule.vue';

const route = useRoute();
const { data: purseDetail, refresh } = await useAPI<any>(
  `/finance/wallet-management/view-wallet-balance?userId=${route.params.id}`,
  {
    query: {},
    default: () => ({}),
  },
)

const { data: participant } = await useAPI<any>(
  `/user-management/get-user-detail?id=${route.params.id}`,
  {
    query: {},
    default: () => ({}),
  },
)



const cardsData = ref([
  {
    subtitle: 'Saldo disponible',
    amountKey: 'availableBalance',
    description:
      'Saldo que ha cargado y que puede disponer para uso de garantía en participación de eventos.',
  },
  {
    subtitle: 'Saldo garantizado',
    amountKey: 'guaranteedBalance',
    description:
      'Saldo que está siendo utilizado como garantía para la participación de uno o más eventos (no puede disponerse).',
  },
  {
    subtitle: 'Saldo Total',
    amountKey: 'totalAmount',
    description: 'Suma del saldo que tiene el Monedero.',
  },
])
</script>
