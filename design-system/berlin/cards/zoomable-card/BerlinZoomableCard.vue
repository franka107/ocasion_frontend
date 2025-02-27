<script setup lang="ts">
import { FullscreenIcon, ZoomInIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import Button from '~/design-system/ui/button/Button.vue'
import DialogTrigger from '~/design-system/ui/dialog/DialogTrigger.vue'

defineProps<{
  title: string
}>()

const isDialogOpen = ref(true)
</script>

<template>
  <Dialog>
    <Card>
      <CardHeader class="flex flex-row justify-between">
        <span>{{ title }}</span>
        <DialogTrigger>
          <Button size="icon" variant="outline" class="">
            <FullscreenIcon />
          </Button>
        </DialogTrigger>
      </CardHeader>
      <CardContent>
        <div class="relative w-full overflow-hidden">
          <slot class="w-full h-full" />
        </div>
      </CardContent>
    </Card>

    <!-- Dialog -->
    <DialogContent class="max-w-3xl max-h-[80vh] overflow-auto">
      <DialogHeader>{{ title }}</DialogHeader>
      <div class="w-full h-[400px]">
        <slot />
      </div>
    </DialogContent>
  </Dialog>
</template>
