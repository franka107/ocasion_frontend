<script setup lang="ts">
import type { BidDto } from '~/types/Bids'

const props = defineProps<{
  bids: BidDto[]
  type?: 'complete' | 'resumed' // La propiedad 'type' ahora es opcional
}>()

const { user } = useUserSession()
const { bids, type } = toRefs(props)

const finalType = computed(() => type.value ?? 'resumed')

const additionalBidsCount = computed(() =>
  finalType.value === 'resumed' ? bids.value.length - 4 : 0,
)

// Excluir la puja ganadora de la lista de "Pujas anteriores"
const bidsToShow = computed(() =>
  finalType.value === 'resumed' ? bids.value.slice(1, 5) : bids.value.slice(1),
)
</script>

<template>
  <div class="text-primary-950 text-sm">
    <!-- Puja ganadora -->
    <p class="uppercase font-bold">Puja ganadora</p>
    <p
      class="my-4 flex justify-between items-center bg-primary-100 p-2 rounded-lg"
    >
      <!-- <span class="uppercase font-bold text-lg">{{ -->
      <!--   bids[0].guaranteedAmount.pseudonym -->
      <!-- }}</span> -->
      <span
        :class="{
          'font-bold': user?.user.id === bids[0].userId,
          uppercase: true,
          'text-lg': true,
        }"
      >
        {{
          `${bids[0].guaranteedAmount?.pseudonym || 'PUJA BASE'} ${user?.user.id === bids[0].userId ? '(YO)' : ''}`
        }}
      </span>
      <span class="text-xl font-semibold text-primary-700"
        >USD ${{ bids[0].amount }}</span
      >
    </p>

    <!-- Lista de pujas -->
    <ul class="overflow-y-auto max-h-[300px]">
      <li class="uppercase font-bold">Pujas anteriores</li>

      <!-- Pujas anteriores según el tipo -->
      <li
        v-for="(item, i) in bidsToShow"
        :key="i"
        class="flex justify-between items-center w-full !py-1"
      >
        <span :class="{ 'font-bold': user?.user.id === item.userId }">
          {{
            `${item.guaranteedAmount?.pseudonym || 'PUJA BASE'} ${user?.user.id === item.userId ? '(YO)' : ''}`
          }}
        </span>
        <span class="text-sm font-semibold text-right">
          USD ${{ item.amount }}
        </span>
      </li>

      <!-- Indicación de más pujas solo si es 'resumed' -->
      <li
        v-if="finalType === 'resumed' && additionalBidsCount > 0"
        class="text-center text-primary-600 mt-3 cursor-pointer"
      >
        <span>{{ additionalBidsCount }} pujas más...</span>
      </li>
    </ul>

    <!-- Total de pujas -->
    <div
      v-if="finalType === 'resumed' && additionalBidsCount > 0"
      class="mt-4 text-center text-sm text-gray-500"
    >
      <span>{{ bids.length }} pujas en total</span>
    </div>
  </div>
</template>

<style scoped>
/* Mejorar la visualización de la puja ganadora */

/* Añadir separación y mejorar legibilidad de la lista de pujas */
li {
  padding: 8px 0;
}
</style>
