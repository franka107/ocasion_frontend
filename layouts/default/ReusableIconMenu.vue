<template>
  <div class="bg-white shadow rounded p-4 w-full">
    <div class="flex justify-end items-center mb-4">
      <button
        class="text-gray-500 hover:text-gray-700"
        @click="emitOpenSheet"
      >
        <CustomIcons :name="iconSrc" class="w-12 h-12 border rounded-lg border-black p-2" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'

interface Props {
  iconSrc: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'open-sheet'): void
}>()

const emitOpenSheet = () => {
  console.log('Emitting open-sheet event')
  emit('open-sheet')
}
</script>
