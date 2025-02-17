<script lang="tsx" setup>
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'

export type BerlinActivityCardProps = {
  customIconName?: string
  kpiValue?: string | number
  type?: 'text' | 'money'
  description?: string
}
const props = withDefaults(defineProps<BerlinActivityCardProps>(), {
  kpiValue: '0',
  customIconName: undefined,
  type: 'text',
  description: 'Lorem ipsum dolor sit amet',
})
const emit = defineEmits<{
  viewDetailButtonPressed: []
}>()

const hasClickEventListener = computed(
  () => getCurrentInstance()?.vnode.props?.onViewDetailButtonPressed,
)
</script>

<template>
  <div class="bg-[#F4F7FA] rounded-lg p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div
          v-if="customIconName"
          class="border rounded-lg bg-[#E6F0F8] p-3 flex-shrink-0"
        >
          <CustomIcons :name="customIconName" class="w-8 h-8" />
        </div>
        <div class="flex flex-col">
          <span v-if="type === 'text'" class="text-2xl font-bold">{{
            kpiValue
          }}</span>
          <span
            v-if="type === 'money' && typeof kpiValue === 'number'"
            class="text-2xl font-bold"
          >
            <MoneyLabel
              :amount="kpiValue"
              class="justify-start p-0 font-bold"
            />
          </span>
          <span class="text-gray-500 text-sm">{{ description }}</span>
        </div>
      </div>
      <button
        v-if="hasClickEventListener"
        class="text-orange-500 text-xs mb-12 hover:text-orange-700"
        @click="
          () => {
            console.log('from componente')
            emit('viewDetailButtonPressed')
          }
        "
      >
        Ver detalle
      </button>
    </div>
  </div>
</template>
