<script setup lang="ts">
import type { Bid, BidHistory } from '~/types/Offer'

const props = defineProps<{
  bidHistory: Bid[]
  winnerBid?: number
}>()
const { bidHistory } = toRefs(props)
</script>
<template>
  <div class="text-primary-950 text-sm">
    <p v-if="winnerBid" class="mb-4">
      <span class="uppercase font-bold">Puja ganadora</span
      ><span> USD {{ bidHistory[0].amount }}</span>
    </p>
    <ul class="space-y-3">
      <li class="uppercase font-bold">Puja anteriores</li>
      <li v-for="(item, i) in bidHistory" :key="i">
        <span>{{ item.user.commonName }}</span
        ><span class="float-right">USD ${{ item.amount }}</span>
      </li>
    </ul>
  </div>
</template>
