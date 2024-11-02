<script setup lang="ts">
import type { BidHistory } from '~/types/Offer';

const props = defineProps<{
    bidHistory: BidHistory[],
    winnerBid?: number
}>()
const { bidHistory, winnerBid } = toRefs(props)
</script>
<template>
    <div class="text-primary-950 text-sm">
        <p v-if="winnerBid" class="mb-4">
            <span class="uppercase font-bold">Puja ganadora</span
            ><span> USD ${{ winnerBid }}</span>
        </p>
        <ul class="space-y-3">
            <li class="uppercase font-bold">Puja anteriores</li>
            <li v-for="(item,i) in bidHistory" :key="i">
            <span>{{ item.user.firstName }}</span
            ><span class="float-right">USD ${{ item.modifiedAmount }}</span>
            </li>
        </ul>
    </div>
</template>
