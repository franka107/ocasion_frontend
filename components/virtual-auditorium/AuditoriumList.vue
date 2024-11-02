<script setup lang="ts">
import AuditoriumListItem from '~/components/virtual-auditorium/AuditoriumListItem.vue'
import type { OfferListItem } from '~/types/Offer';

const props = defineProps<{ offerList: OfferListItem[] }>()
const emit = defineEmits(['onSelectOffer'])
</script>
<template>
  <section class="flex ">
    <div class="flex flex-wrap gap-4 md:gap-2 w-full max-w-[901px] justify-center">
        <AuditoriumListItem v-for="offer in props.offerList" :offer="offer" :key="offer.id" @click="emit('onSelectOffer', offer)" tabindex="0" class="flex-[1_1_200px] max-w-[220px]"  />
    </div>
  </section>
</template>
  