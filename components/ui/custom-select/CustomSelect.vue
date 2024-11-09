<template>
  <SelectRoot v-model:open="open" :disabled="props.disabled">
    <label 
        v-if="props.staticLabel"
        :class="{
        'text-[#0F172A] text-4 font-[500]': true,
        'opacity-50 cursor-not-allowed': props.disabled
      }"
      >
        {{ props.placeholder }}
        <span class="text-[#F6313C] ml-1">*</span>
      </label>
    <SelectTrigger class="border-[#0B3859] relative">
      <label
        v-if="!props.staticLabel && !!currentLabel"
        class="absolute text-[#64748B] bg-white text-xs top-[-8px] left-2 px-1 max-w-[calc(100%_-_12px)] whitespace-nowrap overflow-hidden text-ellipsis"
        >{{ props.placeholder }}</label
      >
      <span :class="currentLabel ? 'text-[#020617]' : 'text-[#94A3B8]'">
        {{ currentLabel || props.placeholder }}
      </span>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <li
          v-for="item in items"
          :key="item.id"
          tabindex="-1"
          class="relative flex w-full select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          @click="handleSelect(item.id)"
        >
          <Check
            v-if="
              item.id === currentValue ||
              (Array.isArray(currentValue) && currentValue.includes(item.id))
            "
            class="flex items-center justify-center h-4 w-4 mr-2"
          />
          <span v-else class="flex items-center justify-center h-4 w-4 mr-2" />
          <span>{{ item.name }}</span>
        </li>
      </SelectGroup>
    </SelectContent>
  </SelectRoot>
</template>
<script setup lang="ts">
import { SelectRoot } from 'radix-vue'
import { Check } from 'lucide-vue-next'
export interface Item {
  id: string | number
  name: string
}
interface Props {
  items: Item[]
  placeholder: string
  multiple?: boolean
  modelValue?: Item | string | undefined | string[]
  staticLabel?: boolean
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  placeholder: '',
  multiple: false,
  staticLabel: false,
  disabled: false,
})
const emit = defineEmits(['update:modelValue', 'update:open'])
const open = ref(false)
const currentValue = ref<
  undefined | string | number | Item | (string | number)[]
>(undefined)
watch(
  () => props.modelValue,
  (val) => {
    currentValue.value = val
  },
  { immediate: true },
)
const currentLabel = computed(() => {
  if (currentValue.value === undefined) return ''
  if (['string', 'number'].includes(typeof currentValue.value)) {
    return (
      props.items.find((item) => item.id === currentValue.value)?.name ||
      props.placeholder
    )
  }
  if (Array.isArray(currentValue.value)) {
    return currentValue.value
      .map((id) => props.items.find((item) => item.id === id)?.name)
      .join(', ')
  }
  // return currentValue.value.name
})
const handleSelect = (value: string | number) => {
  if (!props.multiple) {
    if (currentValue.value !== value) {
      currentValue.value = value
      emit('update:modelValue', value)
    }
    open.value = false
  } else {
    if (currentValue.value === undefined) {
      currentValue.value = [value]
    } else if (Array.isArray(currentValue.value)) {
      const index = currentValue.value.findIndex((item) => item === value)
      if (index !== -1) {
        currentValue.value.splice(index, 1)
      } else {
        currentValue.value.push(value)
      }
    }
    emit('update:modelValue', currentValue.value)
  }
}
</script>
