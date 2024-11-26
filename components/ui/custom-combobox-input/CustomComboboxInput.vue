<template>
  <div class="my-2">
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :disabled="props.disabled"
          :aria-expanded="open"
          :class="[
            'w-full justify-between text-left font-normal border-[#0B3859]',
            !modelValue && 'text-muted-foreground',
            props.class,
          ]"
        >
          <!-- {{ -->
          <!--   modelValue -->
          <!--     ? options.find((value) => value.value === modelValue)?.label -->
          <!--     : props.label -->
          <!-- }} -->
          {{ currentLabel || props.label }}
          <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Command>
          <CommandInput :placeholder="props.label" />
          <CommandEmpty>No hay coincidencias.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="option in options"
                :key="option.value"
                :value="option.label"
                @select="
                  () => {
                    handleSelect(option.value)
                    // onUpdateValue(option.value)
                    // open = false
                  }
                "
              >
                <Check
                  v-if="
                    option.value === currentValue ||
                    (Array.isArray(currentValue) &&
                      currentValue.includes(option.value))
                  "
                  class="flex items-center justify-center h-4 w-4 mr-2"
                />
                {{ option.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'
import { CaretSortIcon } from '@radix-icons/vue'
import { withDefault } from 'radix-vue'
import { Check, CheckIcon } from 'lucide-vue-next'
export interface Item {
  id: string | number
  name: string
}

const props = withDefaults(
  defineProps<{
    label: string
    class?: string
    options: { value: string; label: any }[]
    value: undefined | string | number | Item | (string | number)[]
    multiple?: boolean
    disabled?: boolean
  }>(),
  {
    class: '',
    multiple: false,
  },
)

const emits = defineEmits<{
  (
    e: 'update:modelValue',
    payload: undefined | string | number | Item | (string | number)[],
  ): void
}>()

const open = ref(false)

const modelValue = useVModel(props, 'value', emits, {
  passive: true,
  defaultValue: props.value,
})

const currentValue = ref<
  undefined | string | number | Item | (string | number)[]
>(undefined)

//
watch(
  () => modelValue.value,
  (val) => {
    currentValue.value = val
  },
  { immediate: true },
)

const currentLabel = computed(() => {
  if (currentValue.value === undefined) return ''
  if (['string', 'number'].includes(typeof currentValue.value)) {
    return (
      props.options.find((item) => item.value === currentValue.value)?.label ||
      props.label
    )
  }
  if (Array.isArray(currentValue.value)) {
    return currentValue.value
      .map((id) => props.options.find((item) => item.value === id)?.label)
      .join(', ')
  }
  return ''
})

const handleSelect = (value: string | number) => {
  if (!props.multiple) {
    if (currentValue.value !== value) {
      currentValue.value = value
      emits('update:modelValue', value)
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
    emits('update:modelValue', currentValue.value)
  }
}
</script>
