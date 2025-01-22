<script setup lang="tsx">
import { defineProps } from 'vue'
import { XCircle, AlertCircle } from 'lucide-vue-next' // Asegúrate de instalar lucide-vue-next
import { Button } from '@/components/ui/button' // Ajusta esta importación según tu estructura de componentes

interface AlertBannerProps {
  message: string
  onRetry: () => void
  onClose: () => void
}

defineProps<AlertBannerProps>()
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 bg-red-100 border-b border-red-200 px-4 py-3 shadow-md z-[200]"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center">
        <AlertCircle class="h-5 w-5 text-red-500 mr-2" />
        <span class="text-red-700">{{ message }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <Button variant="outline" size="sm" @click="onRetry">
          Reintentar puja
        </Button>
        <Button variant="ghost" size="sm" @click="onClose">
          <XCircle class="h-5 w-5" />
        </Button>
      </div>
    </div>
  </div>
</template>
