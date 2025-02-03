<template>
  <div class="w-full gap-x-4 bg-white rounded-xl mb-[24px] p-[16px]">
    <h1 class="font-[600] text-[#363636] text-[18px] mb-[12px]">
      Resumen de transacciones
    </h1>
    <div
      class="flex flex-wrap md:flex-nowrap justify-center gap-y-[32px] gap-x-[32px]"
    >
      <div
        v-for="(card, index) in props.cardsData"
        :key="index"
        class="max-w-[356px] bg-[#F3F8FC] p-4 flex flex-col rounded-[8px] w-full"
      >
        <div class="flex justify-between items-center">
          <h4
            class="text-[16px] text-[#20445E] font-[500] leading-[11px] mb-[16px]"
          >
            {{ card.subtitle }}
          </h4>
        </div>
        <h3 class="text-[20px] text-[#152A3C] font-[700] leading-[14px]">
          {{ card.amountKey }}
        </h3>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  cardsData: {
    subtitle: string
    amountKey: string
  }[]
}>()
</script>
