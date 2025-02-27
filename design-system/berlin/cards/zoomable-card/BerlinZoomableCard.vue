<script setup lang="ts">
import { FullscreenIcon, ZoomInIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import Button from '~/design-system/ui/button/Button.vue'

defineProps<{
  title: string
}>()

const isDialogOpen = ref(false)
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row justify-between">
      <span>{{ title }}</span>
      <Button
        size="icon"
        variant="outline"
        class=""
        @click="isDialogOpen = true"
      >
        <FullscreenIcon />
      </Button>
    </CardHeader>
    <CardContent>
      <slot />
    </CardContent>
  </Card>

  <!-- Dialog -->
  <Dialog v-model="isDialogOpen">
    <DialogContent class="max-w-3xl max-h-[80vh] overflow-auto">
      <DialogHeader>{{ title }}</DialogHeader>
      <div class="w-full h-[400px]">
        <slot />
      </div>
    </DialogContent>
  </Dialog>
</template>
