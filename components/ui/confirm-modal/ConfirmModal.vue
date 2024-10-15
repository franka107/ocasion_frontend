<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const {
  showModal,
  confirmModalTitle,
  confirmModalMessage,
  confirmModalCallback,
  modalType,
  cancelModalCallback,
} = useConfirmModal()
</script>

<template>
  <AlertDialog v-model:open="showModal">
    <AlertDialogContent class="z-[100]">
      <AlertDialogHeader>
        <Button
          v-if="modalType !== 'confirm'"
          class="absolute right-1 top-1 text-gray-400"
          variant="ghost"
          @click="showModal = false"
        >
          <CustomIcons name="Close" />
        </Button>
        <CustomIcons
          v-bind="
            modalType === 'confirm'
              ? { name: 'AlertIcon', class: 'text-[#FBBF24]' }
              : modalType === 'success'
                ? { name: 'SuccessIcon', class: 'text-[#00BB8E]' }
                : { name: 'ErrorIcon', class: 'text-[#F53E3E]' }
          "
        />
        <AlertDialogTitle class="text-center">{{
          confirmModalTitle
        }}</AlertDialogTitle>
        <AlertDialogDescription class="text-center">
          {{ confirmModalMessage }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <template v-if="modalType === 'confirm'">
          <Button
            class="ml-3"
            @click="
              cancelModalCallback ? cancelModalCallback() : (showModal = false)
            "
            >Cancelar</Button
          >
          <Button class="ml-3" @click="confirmModalCallback">Confirmar</Button>
        </template>
        <template v-if="modalType === 'error'">
          <AlertDialogAction class="mx-auto"
            >Volver a intentarlo</AlertDialogAction
          >
        </template>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

