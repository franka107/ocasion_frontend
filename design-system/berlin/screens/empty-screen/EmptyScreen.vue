<script setup lang="ts">
import { SearchX, SearchXIcon } from 'lucide-vue-next'
import { TableRow, TableCell } from '@/components/ui/table'
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-3">
    <SearchXIcon class="h-10 w-10 text-gray-400" />
    <div class="text-lg font-medium text-gray-900 dark:text-gray-100">
      No se encontraron resultados
    </div>
    <div class="text-sm text-gray-500 dark:text-gray-400">
      Intenta ajustar tus filtros o términos de búsqueda
    </div>
  </div>
</template>
