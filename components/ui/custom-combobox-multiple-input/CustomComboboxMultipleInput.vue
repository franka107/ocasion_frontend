<!-- <template> -->
<!--   <div class="my-2"> -->
<!--     <Popover> -->
<!--       <PopoverTrigger as-child> -->
<!--         <Button -->
<!--           variant="outline" -->
<!--           role="combobox" -->
<!--           :class="[ -->
<!--             'w-full justify-between text-left font-normal', -->
<!--             !modelValue && 'text-muted-foreground', -->
<!--             props.class, -->
<!--           ]" -->
<!--         > -->
<!--           {{ -->
<!--             modelValue -->
<!--               ? options.find((value) => value.value === modelValue)?.label -->
<!--               : props.label -->
<!--           }} -->
<!--           <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" /> -->
<!--         </Button> -->
<!--       </PopoverTrigger> -->
<!--       <PopoverContent class="w-auto p-0"> -->
<!--         <Command> -->
<!--           <CommandInput :placeholder="props.label" /> -->
<!--           <CommandEmpty>No hay coincidencias.</CommandEmpty> -->
<!--           <CommandList> -->
<!--             <CommandGroup> -->
<!--               <CommandItem -->
<!--                 v-for="option in options" -->
<!--                 :key="option.value" -->
<!--                 :value="option.label" -->
<!--                 @select=" -->
<!--                   () => { -->
<!--                     //modelValue = option.value; -->
<!--                     onUpdateValue(option.value); -->
<!--                   } -->
<!--                 " -->
<!--               > -->
<!--                 {{ option.label }} -->
<!--                 <CheckIcon -->
<!--                   :class=" -->
<!--                     cn( -->
<!--                       'ml-auto h-4 w-4', -->
<!--                       option.value === modelValue ? 'opacity-100' : 'opacity-0', -->
<!--                     ) -->
<!--                   " -->
<!--                 /> -->
<!--               </CommandItem> -->
<!--             </CommandGroup> -->
<!--           </CommandList> -->
<!--         </Command> -->
<!--       </PopoverContent> -->
<!--     </Popover> -->
<!--   </div> -->
<!-- </template> -->
<template>
  <p>{{ JSON.stringify(options) }}</p>
  <p>{{ searchTerm }}</p>
  <TagsInput class="px-0 gap-0 w-80" :model-value="modelValue">
    <div class="flex gap-2 flex-wrap items-center px-3">
      <TagsInputItem v-for="item in modelValue" :key="item" :value="item">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
    </div>

    <ComboboxRoot
      v-model="modelValue"
      v-model:open="open"
      v-model:searchTerm="searchTerm"
      class="w-full"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput placeholder="Functionalidades" as-child>
          <TagsInputInput
            class="w-full px-3"
            :class="(modelValue?.length || 0) > 0 ? 'mt-2' : ''"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </ComboboxAnchor>

      <ComboboxPortal class="z-40">
        <ComboboxContent class="z-40">
          <CommandList
            position="popper"
            class="z-40 w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="framework in filteredOptions"
                :key="framework.value"
                :value="framework.value"
                @select.prevent="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = '';
                      const newModelValue = (modelValue || []).push(
                        ev.detail.value,
                      );
                      onUpdateValue(newModelValue);
                    }

                    if (filteredOptions.length === 0) {
                      open = false;
                    }
                  }
                "
              >
                {{ framework.label }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import { useVModel } from "@vueuse/core";
import { CaretSortIcon } from "@radix-icons/vue";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from "radix-vue";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";

const modelValue = ref<string[]>([]);

const props = defineProps<{
  label: string;
  class?: string;
  options: { value: string; label: any }[];
  value: string[] | undefined;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string[] | undefined): void;
}>();

const filteredOptions = computed(() =>
  props.options.filter((i) => !modelValue.value?.includes(i.label)),
);

// const modelValue = useVModel(props, "value", emits, {
//   passive: true,
//   defaultValue: props.value,
// });
//
const open = ref(false);
const searchTerm = ref("");

const onUpdateValue = (newValue: any | undefined) => {
  emits("update:modelValue", newValue ? newValue : undefined);
};
</script>
