<script lang="tsx" setup>
export type BerlinActivityCardProps = {
  customIconName?: string
  kpiValue?: string
  description?: string
}
const props = withDefaults(defineProps<BerlinActivityCardProps>(), {
  customIconName: 'save',
  kpiValue: '0',
  description: 'Lorem ipsum dolor sit amet',
})
const emit = defineEmits<{
  onViewDetailButtonPressed: []
}>()

const hasClickEventListener = computed(
  () => getCurrentInstance()?.vnode.props?.onViewDetailButtonPressed,
)
</script>

<template>
  <div class="bg-[#F4F7FA] rounded-lg p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="border rounded-lg bg-[#E6F0F8] p-3 flex-shrink-0">
          <CustomIcons :name="customIconName" class="w-8 h-8" />
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold">{{ kpiValue }}</span>
          <span class="text-gray-500 text-sm">{{ description }}</span>
        </div>
      </div>
      <button
        v-if="hasClickEventListener"
        class="text-orange-500 text-xs mb-12 hover:text-orange-700"
        @click="emit('onViewDetailButtonPressed')"
      >
        Ver detalle
      </button>
    </div>
  </div>
</template>
