<script setup lang="tsx">
import { computed } from 'vue'

interface MoneyLabelProps {
  amount: number
  currency?: string
  locale?: string
}

const props = defineProps<MoneyLabelProps>()

// Configuramos los valores predeterminados
const currency = props.currency ?? 'USD'
const locale = props.locale ?? 'en-US'

// Formatear el monto
const formattedAmount = computed(() =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(props.amount),
)

// Verificar si el monto es negativo
const isNegative = computed(() => props.amount < 0)
</script>

<template>
  <div
    :class="
      cn(
        'flex justify-end items-center py-2 px-3 w-full max-w-[120px]',
        $attrs.class as string,
      )
    "
  >
    <span
      :class="[
        'text-sm font-medium tabular-nums',
        isNegative
          ? 'text-red-600 dark:text-red-400'
          : 'text-gray-900 dark:text-gray-100',
      ]"
      :title="formattedAmount"
    >
      {{ formattedAmount }}
    </span>
  </div>
</template>
