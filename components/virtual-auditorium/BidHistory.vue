<script setup lang="ts">
import type { Bid, BidHistory } from '~/types/Offer'

const props = defineProps<{
  bids: Bid[]
  winnerBid?: number
}>()
const { user } = useUserSession()
const { bids } = toRefs(props)

// Calculamos cuántas pujas más hay para mostrar
const additionalBidsCount = computed(() => bids.value.length - 4)
</script>

<template>
  <div class="text-primary-950 text-sm">
    <!-- Puja ganadora -->
    <p v-if="winnerBid" class="mb-4">
      <span class="uppercase font-bold text-lg">Puja ganadora</span>
      <span class="text-xl font-semibold">USD {{ bids[0].amount }}</span>
    </p>

    <!-- Lista de pujas -->
    <ul class="overflow-y-auto">
      <li class="uppercase font-bold">Pujas anteriores</li>

      <!-- Pujas anteriores -->
      <li
        v-for="(item, i) in bids.slice(0, 4)"
        :key="i"
        class="flex justify-between items-center w-full"
      >
        <span :class="{ 'font-bold': user?.user.id === item.userId }">
          {{
            `${item.guaranteedAmount?.pseudonym || 'PUJA BASE'} ${user?.user.id === item.userId ? '(YO)' : ''}`
          }}
        </span>
        <span class="text-sm font-semibold text-right"
          >USD ${{ item.amount }}</span
        >
      </li>

      <!-- Indicación de más pujas -->
      <li
        v-if="additionalBidsCount > 0"
        class="text-center text-primary-600 mt-3 cursor-pointer"
      >
        <span> {{ additionalBidsCount }} pujas más... </span>
      </li>
    </ul>

    <!-- Total de pujas -->
    <div
      v-if="additionalBidsCount > 0"
      class="mt-4 text-center text-sm text-gray-500"
    >
      <span>{{ bids.length }} pujas en total</span>
    </div>
  </div>
</template>

<style scoped>
/* Añadir separación y mejorar legibilidad de la lista de pujas */
li {
  padding: 8px 0;
}

span.float-right {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.text-primary-600 {
  color: #3b82f6;
}

.text-primary-950 {
  color: #111827;
}
</style>
