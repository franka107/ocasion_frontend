<script setup lang="ts">
import type { BidDto } from '~/types/Bids'

const props = defineProps<{
  bids: BidDto[]
  type?: 'complete' | 'resumed'
}>()

const { user } = useUserSession()
const { bids, type } = toRefs(props)

const finalType = computed(() => type.value ?? 'resumed')
const showAllBids = ref(false)

const additionalBidsCount = computed(() =>
  finalType.value === 'resumed' && !showAllBids.value
    ? Math.max(bids.value.length - 5, 0)
    : 0,
)

const bidsToShow = computed(() => {
  if (finalType.value === 'complete' || showAllBids.value) {
    return bids.value.slice(1)
  }
  return bids.value.slice(1, 5)
})

const handleShowAllBids = () => {
  showAllBids.value = true
}
</script>

<template>
  <div class="text-primary-950 text-sm">
    <!-- Puja ganadora -->
    <div class="mb-6">
      <p class="uppercase font-bold text-lg text-primary-700">Puja ganadora</p>
      <div
        class="my-4 flex justify-between items-center bg-primary-100 p-4 rounded-xl border-2 border-primary-500 shadow-lg"
      >
        <span
          :class="{
            'font-bold': user?.user.id === bids[0].userId,
            'uppercase text-xl': true,
          }"
        >
          {{
            `${bids[0].guaranteedAmount?.pseudonym || 'PUJA BASE'} ${user?.user.id === bids[0].userId ? '(YO)' : ''}`
          }}
        </span>
        <span class="text-2xl font-extrabold text-primary-700">
          USD ${{ bids[0].amount }}
        </span>
      </div>
    </div>

    <!-- Lista de pujas anteriores -->
    <div class="max-h-[300px] overflow-y-auto">
      <p class="uppercase font-bold mb-2 text-primary-600 border-b pb-1">
        Pujas anteriores
      </p>

      <ul>
        <li
          v-for="(item, i) in bidsToShow"
          :key="i"
          class="flex justify-between items-center w-full py-2 border-b last:border-b-0"
        >
          <span
            :class="{
              'font-bold': user?.user.id === item.userId,
              'flex items-center': true,
            }"
          >
            {{
              `${item.guaranteedAmount?.pseudonym || 'PUJA BASE'} ${user?.user.id === item.userId ? '(YO)' : ''}`
            }}
            <span
              v-if="user?.user.id === item.userId"
              class="ml-2 text-primary-500"
              >✔️</span
            >
          </span>
          <span class="text-sm font-semibold text-right"
            >USD ${{ item.amount }}</span
          >
        </li>
      </ul>

      <!-- Botón para mostrar más pujas -->
      <button
        v-if="finalType === 'resumed' && additionalBidsCount > 0"
        class="mt-3 text-primary-600 hover:underline cursor-pointer w-full text-center"
        @click="handleShowAllBids"
      >
        Ver todas las pujas ({{ additionalBidsCount }} más)
      </button>
    </div>

    <!-- Total de pujas -->
    <div
      v-if="finalType === 'resumed' && bids.length > 5"
      class="mt-4 text-center text-sm text-gray-500"
    >
      <span>{{ bids.length }} pujas en total</span>
    </div>
  </div>
</template>

<style scoped>
li {
  padding: 8px 0;
}
</style>
