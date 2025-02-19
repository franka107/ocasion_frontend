<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from 'radix-vue'
import { ChevronDownIcon, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/design-system/ui/command'
import { TagsInput, TagsInputInput } from '~/design-system/ui/tags-input'
import { Badge } from '~/design-system/ui/badge'
import TagsInputItemText from '~/design-system/ui/tags-input/TagsInputItemText.vue'
import TagsInputItemDelete from '~/design-system/ui/tags-input/TagsInputItemDelete.vue'
import TagsInputItem from '~/design-system/ui/tags-input/TagsInputItem.vue'

// Tipado de las opciones
interface Option {
  label: string
  value: string
}

const props = defineProps<{
  placeholder?: string
  options?: Option[]
}>()

const modelValue = defineModel<string[]>({ required: true })

const open = ref(false)
const searchTerm = ref('')

const selectedValuesSet = computed(() => new Set(modelValue.value))

const filteredOptions = computed(
  () =>
    props.options?.filter(
      (option) => !selectedValuesSet.value.has(option.value),
    ) ?? [],
)

const optionsMap = computed(() => {
  return new Map(props.options?.map((opt) => [opt.value, opt.label]))
})

const findLabelById = (id: string) => optionsMap.value.get(id) ?? 'Desconocido'

const handleRemove = (value: string) => {
  modelValue.value = modelValue.value.filter((item) => item !== value)
}

const handleSelect = (value: string) => {
  if (!selectedValuesSet.value.has(value)) {
    modelValue.value = modelValue.value.concat(value)
  }
  if (filteredOptions.value.length === 0) {
    open.value = false
  }
}

const debouncedSearchTerm = useDebounce(searchTerm, 200)

const toggleOpen = () => {
  open.value = !open.value
}
</script>

<template>
  <div>
    <TagsInput
      class="px-0 gap-0 w-full cursor-pointer relative"
      :model-value="modelValue"
    >
      <!-- Icono desplegable -->
      <ChevronDownIcon
        class="cursor-pointer size-4 mr-3 absolute right-0"
        @click="toggleOpen"
      />

      <ComboboxRoot
        v-model="modelValue"
        v-model:open="open"
        v-model:search-term="searchTerm"
        class="w-full"
      >
        <ComboboxAnchor as-child>
          <div class="flex items-center justify-start w-full">
            <ComboboxInput :placeholder="props.placeholder" as-child>
              <div
                class="mr-8 ml-2 min-h-6 flex overflow-x-auto max-w-full gap-2 scrollbar-hide"
              >
                <TagsInputItem
                  v-for="item in modelValue"
                  :key="item"
                  :value="item"
                  class="bg-primary text-white"
                >
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
                <TagsInputInput
                  v-if="modelValue.length === 0"
                  :placeholder="props.placeholder"
                />
              </div>
            </ComboboxInput>
          </div>
        </ComboboxAnchor>
        <ComboboxPortal>
          <ComboboxContent>
            <CommandList
              position="popper"
              class="w-[--radix-popper-anchor-width] z-[200] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none"
            >
              <CommandEmpty>No hay opciones disponibles</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  v-for="option in filteredOptions"
                  :key="option.value"
                  :value="option.value"
                  @select.prevent="handleSelect(option.value)"
                >
                  {{ option.label }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </ComboboxContent>
        </ComboboxPortal>
      </ComboboxRoot>
    </TagsInput>

    <!-- Etiquetas seleccionadas -->
    <!-- <div -->
    <!--   v-if="modelValue?.length > 0" -->
    <!--   class="flex gap-2 flex-wrap items-center px-3 py-3" -->
    <!-- > -->
    <!--   <div -->
    <!--     v-for="item in modelValue" -->
    <!--     :key="item" -->
    <!--     class="flex items-center gap-2" -->
    <!--   > -->
    <!--     <Badge class="gap-2 py-1 px-2 bg-green1"> -->
    <!--       {{ findLabelById(item) }} -->
    <!--       <X class="cursor-pointer size-3" @click="handleRemove(item)" /> -->
    <!--     </Badge> -->
    <!--   </div> -->
    <!-- </div> -->
  </div>
</template>

<style scoped>
/* Oculta la barra de desplazamiento en navegadores compatibles */
.scrollbar-hide {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE y Edge */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari y Opera */
}
</style>
