<template>
  <Button
    v-if="value"
    size="icon"
    variant="ghost"
    class="rounded-full"
    @click="downloadFile"
  >
    <CustomIcons name="Doc-Loupe" />
  </Button>
  <Badge v-else variant="outline" class="text-gray-400 border-gray-300">
    No disponible
  </Badge>
</template>

<script setup lang="tsx">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { FileIcon } from 'lucide-vue-next'
import Button from '../button/Button.vue'
import Badge from '../badge/Badge.vue'
import type { FileType } from '~/types/Disbursement'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'

const props = defineProps<{
  value: FileType | null
}>()

const downloadFile = () => {
  window.open(props.value?.path, '_blank')
}
</script>
