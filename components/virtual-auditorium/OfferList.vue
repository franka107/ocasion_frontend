<script setup lang="ts">
import OfferListCard from '~/components/virtual-auditorium/OfferListCard.vue'
import type { OfferDto, OfferListItem } from '~/types/Offer'

const props = defineProps<{ offerList: OfferDto[] }>()
const emit = defineEmits(['onSelectOffer'])
</script>
<template>
  <section class="flex">
    <div
      class="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] justify-items-center gap-4 md:gap-2 max-w-[100%] w-full justify-center"
    >
      <OfferListCard
        v-for="offer in props.offerList"
        :key="offer.id"
        :offer="offer"
        tabindex="0"
        @click="emit('onSelectOffer', offer)"
      />
    </div>
  </section>
</template>
