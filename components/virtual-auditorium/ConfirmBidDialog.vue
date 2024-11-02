<script setup lang="ts">
import { Button } from '@/components/ui/button'
const props = withDefaults(defineProps<{ modelValue: boolean, title?: string, description?: string, onPlaceBid: ({ offerId, amount }: { offerId: string, amount: number }) => void, bid: number, offerId: string }>(), {
  title: '',
  description: ''
});
const { onPlaceBid} = toRefs(props)
const emit = defineEmits(['update:modelValue', 'onSubmitBid']);
const BALANCE = 20000
const successSubmit = ref(false)
const title = ref("Separación de garantía")
const icon= ref("CurencyOutline")

const onSubmit = async () => {
    await onPlaceBid.value({offerId: props.offerId, amount: props.bid})
    successSubmit.value = true
    title.value = "Separación confirmada"
    icon.value = "AccountOutline"
}
const resetForm = () => {
    successSubmit.value = false
    title.value = "Separación de garantía"
    icon.value = "CurencyOutline"
}
</script>
<template>
  <CustomModal
        :model-value="modelValue"
        @update:model-value="($event) => emit('update:modelValue', $event)"
        :title="title"
        :icon="icon"
        @close-auto-focus="resetForm"
    >
        <template v-if="!successSubmit">
            <p class="mb-4 text-sm text-gray-500 font-medium">Para poder realizar una oferta, deberá pagar la garantía, la cual será descontada de tu monedero. Este monto corresponde a la preliquidación de la separación de garantía.</p>
            <ul class="mb-6 text-sm font-medium">
                <li><span class="text-primary-700">Saldo disponible: </span><span>$ {{ BALANCE }}</span></li>
                <li><span class="text-primary-700">monto a separar: </span><span>$ {{ props.bid }}</span></li>
                <li><span class="text-primary-700">Saldo restante: </span><span>$ {{ BALANCE - props.bid }}</span></li>
            </ul>
            <div class="flex gap-x-[10px] w-full">
                <Button variant="outline" class="w-full" @click="emit('update:modelValue', false)">Cancelar</Button>
                <Button class="w-full" @click="onSubmit">Separar</Button>
            </div>
        </template>
        <template v-else>
            <p class="mb-4 text-sm text-gray-500 font-medium">Se confirmo la separación de tu garantia exitosamente y tu seudónimo asignado es MAPACHE508</p>
        </template>
    </CustomModal>
</template>
