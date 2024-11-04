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
  confirmModalIcon,
  confirmModalCallback,
  confirmIsSubmitting,
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
          class="absolute right-1 top-1 text-gray-400 [&>svg]:text-[#a6b4bf]"
          variant="ghost"
          @click="showModal = false"
        >
          <CustomIcons name="Close" />
        </Button>

        <div v-if="confirmModalIcon && modalType === 'confirm'" class="w-full">
          <div class="">
            <CustomIcons
              v-bind="{
                name: confirmModalIcon,
                class:
                  'w-9 h-9 m-auto justify-center bg-[#2872a1] rounded-full  p-2 m-auto items-center flex justify-center',
              }"
            />
          </div>
        </div>

        <CustomIcons
          v-else
          v-bind="
            modalType === 'confirm'
              ? { name: 'AlertIcon', class: '[&>svg]:text-[#FBBF24]' }
              : modalType === 'success'
                ? { name: 'SuccessIcon', class: '[&>svg]:text-[#00BB8E]' }
                : { name: 'ErrorIcon', class: '[&>svg]:text-[#F53E3E]' }
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
          <div class="flex gap-x-[10px] w-full">
            <Button
              variant="outline"
              class="w-full"
              @click="
                cancelModalCallback
                  ? cancelModalCallback()
                  : (showModal = false)
              "
              >Cancelar</Button
            >
            <Button
              class="w-full"
              :disabled="confirmIsSubmitting"
              @click="confirmModalCallback"
              >Confirmar</Button
            >
          </div>
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
