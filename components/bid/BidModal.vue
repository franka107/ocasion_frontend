<template>
  <Dialog
    :open="isOpen"
    class="p-6 max-w-lg mx-auto rounded-lg shadow-lg"
    @update:open="handleClose"
  >
    <DialogContent class="grid gap-4">
      <DialogHeader>
        <DialogTitle class="text-xl font-extrabold text-gray-800">
          Puja
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-500">
          Detalle de puja
        </DialogDescription>
      </DialogHeader>
      <hr class="my-2 border-gray-200" />
      <DialogRow
        icon="CoinsIcon"
        label="Monto:"
        :value="`$${bid.amount.toFixed(2)}`"
      />
      <hr class="my-2 border-gray-200" />
      <DialogRow icon="Info" label="Estado:">
        <Badge
          variant="outline"
          :class="statusBadgeClass"
          class="px-3 py-1 rounded-lg text-sm shadow-md"
        >
          {{ statusInfo.name }}
        </Badge>
      </DialogRow>
      <hr class="my-2 border-gray-200" />
      <DialogRow icon="Calendar" label="F. de creación:">
        {{ formattedDate }}
      </DialogRow>
    </DialogContent>

    <DialogFooter class="flex justify-end gap-2">
      <Button variant="outline" class="hover:bg-gray-100" @click="handleClose">
        Cancelar
      </Button>
      <Button
        class="bg-blue-600 text-white hover:bg-blue-700"
        @click="handleClose"
      >
        Cerrar
      </Button>
    </DialogFooter>
  </Dialog>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import DialogRow from './DialogRow.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { BidDto } from '~/types/Bids'
import { bidStatus } from '~/constants/bids'

const props = defineProps<{
  isOpen: boolean
  bid: BidDto
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const statusInfo = computed(() => {
  return (
    bidStatus.get(props.bid.status) || { name: 'Desconocido', color: 'gray' }
  )
})

const formattedDate = computed(() => {
  return format(new Date(props.bid.createdAt), "d 'de' MMMM 'de' yyyy, HH:mm", {
    locale: es,
  })
})

const statusBadgeClass = computed(() => {
  const color = statusInfo.value.color
  return `bg-${color}-100 text-${color}-800 border-${color}-300`
})

const handleClose = () => {
  emit('update:isOpen', false)
}
</script>
