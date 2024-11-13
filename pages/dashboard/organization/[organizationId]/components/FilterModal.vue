<template>
  <SheetContent
    v-model:open="isSheetOpen"
    side="right"
    class="bg-white shadow rounded p-4 w-full sm:w-80 lg:w-96"
  >
    <div class="h-full flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-medium">Filtro</h2>
        <DialogClose
          class="rounded-full p-2 hover:bg-gray-100"
        >
          <X class="h-4 w-4" />
        </DialogClose>
      </div>
      <div class="flex-1 p-4 overflow-y-auto">
        <!-- Contenido del filtro -->
      </div>
      <div class="border-t p-4 flex justify-between gap-2">
        <Button class="w-full" variant="outline" @click="handleClear">
          Limpiar
        </Button>
        <Button class="w-full" @click="handleApply">
          Aplicar
        </Button>
      </div>

    </div>
  </SheetContent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import SheetContent from '~/components/ui/sheet/SheetContent.vue'
import Button from '~/components/ui/button/Button.vue'
import DialogClose from '~/components/ui/dialog/DialogClose.vue'


const isSheetOpen = ref(false)

const handleApply = () => {
  console.log('Applying filters')
}

const handleClear = () => {
  console.log('Clearing filters')
}
</script>
