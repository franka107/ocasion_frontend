<script setup lang="ts">
import { ref } from 'vue'
import BidHistory from './BidHistory.vue'
import OfferDetailPage from './OfferDetailPage.vue'
import type { OfferDto } from '~/types/Offer'

const props = defineProps<{
  offerDetail: OfferDto
}>()
</script>

<template>
  <div class="text-left">
    <h2
      class="text-[#152A3C] text-[17px] md:text-[20px] font-[700] py-[16px] uppercase tracking-tight leading-[28px]"
    >
      {{ offerDetail.title }} - MARCA: {{ offerDetail.carBrand.name }} MODELO:
      {{ offerDetail.carModel.name }} - AÑO {{ offerDetail.year }}
    </h2>
    <div class="grid gap-y-[8px] font-[400] text-[#454446] text-[14px]">
      <div class="flex gap-x-[8px]">
        <CustomIcons name="home-work-detail" class="mb-[1px]" />
        <p class="leading-[24px]">{{ offerDetail.event.organization.name }}</p>
      </div>
      <div class="flex gap-x-[8px]">
        <CustomIcons name="location" class="w-[16px] mb-[1px]" />
        <p class="leading-[24px]">{{ offerDetail.address.district.name }}</p>
      </div>
    </div>
    <div
      class="grid pt-[24px] pb-[16px] gap-y-[8px] border-b-2 border-[#E6E6E7]"
    >
      <p class="font-[700] leading-[24px]">OFERTA INICIAL</p>
      <p class="font-[700] text-[22px] md:text-[24px] leading-[32px]">
        USD ${{ offerDetail.initialValue }}
      </p>
    </div>
    <BidHistory :bids="offerDetail.bids" winner-bid type="complete" />
  </div>
</template>
