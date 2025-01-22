<script setup lang="tsx">
import { ref, defineProps } from 'vue'
import { Download } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Button from '~/design-system/ui/button/Button.vue'

const props = defineProps<{
  url: string
  fileName?: string
}>()
</script>

<template>
  <div class="flex justify-center items-center py-2 px-3 w-full">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            as="a"
            class="border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 h-10 w-10 rounded-full"
            :aria-label="`Descargar ${fileName || 'archivo'}`"
            target="_blank"
            rel="noopener noreferrer"
            :href="url"
          >
            <Download class="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Descargar {{ fileName || 'archivo' }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<style scoped>
/* Aquí puedes agregar estilos personalizados si es necesario */
</style>
