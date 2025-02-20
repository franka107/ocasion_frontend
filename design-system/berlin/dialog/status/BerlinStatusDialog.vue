<!-- ConfirmDialog.vue -->
<template>
  <AlertDialog :open="props.open !== null">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ props.open?.title }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.open?.message }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction>Continuar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
export type BerlinStatusDialogOpen = {
  title: string
  message: string
  type: 'success' | 'error' | 'warning'
}

const props = defineProps<{
  open: BerlinStatusDialogOpen | null
  onClose: () => void
}>()

const closeDialog = () => {
  props.onClose()
}
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
