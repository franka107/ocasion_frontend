<template>
  <div>
    <Dialog :open="open" @update:open="closeDialog">
      <DialogContent class="sm:max-w-[425px] rounded-lg">
        <div class="flex flex-col items-center text-center">
          <div :class="[props.iconBgColor, 'rounded-full p-3 mb-4']">
            <slot name="icon" />
          </div>
          <DialogTitle class="text-xl font-bold text-[#09314F] mb-2">
            {{ props.title }}
          </DialogTitle>
          <DialogDescription class="text-gray-600 mb-6">
            {{ props.description }}
            <p v-if="props.subDescription" class="mt-2">
              {{ props.subDescription }}
            </p>
          </DialogDescription>

          <!-- Generación dinámica de botones -->
          <div v-if="actions.length > 0" class="flex gap-2 justify-center">
            <Button
              v-for="(action, index) in actions"
              :key="index"
              class="w-40 bg-[#09314F] hover:bg-[#09314F] text-white rounded py-2"
              @click="executeAction(action)"
            >
              {{ action.label }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

// Tipos para definir la estructura de las acciones
interface Action {
  label: string // Texto del botón
  callback: () => void // Función que se ejecuta al hacer click
}

const props = defineProps<{
  open: boolean
  title: string
  iconBgColor: string
  description: string
  subDescription?: string
  actions: Action[] // Array de acciones con label y callback
}>()

const emit = defineEmits(['update:open', 'close', 'action'])

const closeDialog = () => {
  emit('update:open', false)
  emit('close')
}

const executeAction = (action: Action) => {
  closeDialog()
  action.callback()
}
</script>
