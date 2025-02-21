<script setup lang="ts">
import { XCircle } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  onClose: () => void
  title: string
}>()
</script>
<template>
  <Sheet :open="isOpen">
    <SheetHeader>
      <SheetClose
        class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]"
        @click="props.onClose"
      >
        <XCircle class="w-4 h-4 text-muted-foreground" />
      </SheetClose>
      <SheetTitle class="text-xl font-medium text-[#64748B]">{{
        props.title
      }}</SheetTitle>
    </SheetHeader>
    <SheetContent>
      <slot name="content" />
    </SheetContent>
    <SheetFooter>
      <slot name="footer" />
    </SheetFooter>
  </Sheet>
</template>
