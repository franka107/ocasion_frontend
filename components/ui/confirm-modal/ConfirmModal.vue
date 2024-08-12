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

const { showModal, confirmModalTitle, confirmModalMessage, confirmModalCallback } = useConfirmModal()
</script>

<template>
  <AlertDialog v-model:open="showModal">
    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ confirmModalTitle }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ confirmModalMessage}}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="confirmModalCallback">Continue</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>