<script setup lang="tsx">
import { computed } from 'vue'
import { EyeIcon } from 'lucide-vue-next'
import type { OfferDto, OfferStatus } from '~/types/Offer'
import { offerStatusRecord } from '~/constants/offer'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'

interface Props {
  offer: OfferDto
  displayProps: (keyof OfferDto)[]
  onClick?: (() => void) | null
}

const props = defineProps<Props>()

const formattedData = computed(() => {
  return props.displayProps.map((key) => {
    switch (key) {
      case 'carModel':
        return { label: 'Modelo', value: props.offer.carModel.name, key }
      case 'id':
        return { label: 'Código', value: props.offer.id, key }
      case 'carBrand':
        return { label: 'Marca', value: props.offer.carBrand.name, key }
      case 'initialValue':
        return {
          label: 'Valor Inicial',
          value: `$${props.offer.initialValue.toLocaleString()}`,
          key,
        }
      case 'status':
        return { label: 'Estado', value: props.offer.status, key }
      case 'year':
        return { label: 'Año', value: props.offer.year, key }
      case 'endTime':
        return {
          label: 'Finaliza',
          key,
          value: props.offer.endTime,
        }
      default:
        return { label: key, value: props.offer[key], key }
    }
  })
})
</script>

<template>
  <div
    class="offer-card p-3 rounded-xl shadow-sm bg-white relative flex flex-col gap-1 border hover:shadow-md transition-all"
  >
    <div class="flex justify-between items-center">
      <h3 class="text-sm font-medium truncate">{{ props.offer.title }}</h3>

      <button
        v-if="props.onClick"
        class="text-primary-600 hover:text-primary-800 transition-all"
        aria-label="Ver detalles"
        @click="props.onClick"
      >
        <EyeIcon size="18" />
      </button>
    </div>

    <ul class="space-y-0.5 text-xs">
      <li
        v-for="item in formattedData"
        :key="item.label"
        class="flex justify-between"
      >
        <span class="font-medium">{{ item.label }}:</span>
        <span v-if="item.key === 'status'">
          <CustomChip
            :text="
                    offerStatusRecord[item.value as OfferStatus].name || ''
                  "
            :variant="
                    offerStatusRecord[item.value as OfferStatus]
                      .color as any
                  "
          ></CustomChip>
        </span>
        <span v-else-if="item.key === 'endTime'">
          <DateLabel :value="item.value" />
        </span>
        <span v-else class="truncate">
          {{ item.value }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.offer-card {
  transition: box-shadow 0.2s;
}
</style>
