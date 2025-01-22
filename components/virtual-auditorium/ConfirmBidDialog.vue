<script setup lang="ts">
import { toast } from '../ui/toast'
import { Button } from '@/components/ui/button'
import type { IDataResponse } from '~/types/Common'
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    description?: string
    onPlaceBid: () => Promise<void>
    bid: number
    offerId: string
    eventId: string
  }>(),
  {
    title: '',
    description: '',
  },
)
const { onPlaceBid } = toRefs(props)
const emit = defineEmits(['update:modelValue', 'onSubmitBid'])
const pseudonym = ref<string>('')
const successSubmit = ref(false)
const title = ref('Separación de garantía')
const icon = ref('CurencyOutline')

const { data, status } = await useAPI<{
  amountToBeSeparated: number
  availableBalance: number
  remainingBalance: number
}>(`/auction-management/subscribe-to-offer-preview/?eventId=${props.eventId}`, {
  method: 'GET',
} as any)
console.log('data', data, status)

// if (status.value !== 'success') {
//   toast({
//     title: 'Problema en el servidor',
//     description: 'intentelo mas tarde',
//     variant: 'default',
//     class: 'border-red',
//   })
// }
const confirmModal = useConfirmModal()

const onSubmit = async () => {
  try {
    const { data, status, error } = await useAPI<{ pseudonym: string }>(
      `/auction-management/subscribe-to-offer/?eventId=${props.eventId}`,
      { method: 'POST' } as any,
    )
    console.log('data', data, status)

    if (status.value !== 'success') {
      const eMsg =
        error.value?.data?.errors?.[0].message ||
        error.value?.data?.message ||
        'No se pudo continuar con la puja. \nTe reco mendamos intentarlo nuevamente.'
      toast({
        title: 'Problema en la puja',
        description: eMsg,
        variant: 'default',
        class: 'border-red',
      })
    }
    pseudonym.value = data.value.pseudonym
    // await onPlaceBid.value({ offerId: props.offerId, amount: props.bid })
    await onPlaceBid.value()
    successSubmit.value = true
    title.value = 'Separación confirmada'
    icon.value = 'AccountOutline'
  } catch (error) {
    console.error('error', error)
  }
}
const resetForm = () => {
  successSubmit.value = false
  title.value = 'Separación de garantía'
  icon.value = 'CurencyOutline'
}
</script>
<template>
  <CustomModal
    :model-value="modelValue"
    :title="title"
    :icon="icon"
    @update:model-value="($event) => emit('update:modelValue', $event)"
    @close-auto-focus="resetForm"
  >
    <template v-if="!successSubmit">
      <p class="mb-4 text-sm text-gray-500 font-medium">
        Para poder realizar una oferta, deberá pagar la garantía, la cual será
        descontada de tu monedero. Este monto corresponde a la preliquidación de
        la separación de garantía.
      </p>
      <ul v-if="data" class="mb-6 text-sm font-medium">
        <li>
          <span class="text-primary-700">Saldo disponible: </span
          ><span>$ {{ data.availableBalance }}</span>
        </li>
        <li>
          <span class="text-primary-700">monto a separar: </span
          ><span>$ {{ data.amountToBeSeparated }}</span>
        </li>
        <li>
          <span class="text-primary-700">Saldo restante: </span
          ><span>$ {{ data.remainingBalance }}</span>
        </li>
      </ul>
      <div class="flex gap-x-[10px] w-full">
        <Button
          variant="outline"
          class="w-full"
          @click="emit('update:modelValue', false)"
          >Cancelar</Button
        >
        <Button class="w-full" @click="onSubmit">Separar</Button>
      </div>
    </template>
    <template v-else>
      <p class="mb-4 text-sm text-gray-500 font-medium">
        Se confirmo la separación de tu garantia exitosamente y tu seudónimo
        asignado es {{ pseudonym }}
      </p>
    </template>
  </CustomModal>
</template>
