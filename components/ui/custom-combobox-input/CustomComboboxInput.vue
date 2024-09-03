<template>
  <div class="my-2">
    <Popover>
      <PopoverTrigger as-child>
        <!-- <Button -->
        <!--   variant="outline" -->
        <!--   :class="[ -->
        <!--     'w-full justify-start text-left font-normal', -->
        <!--     !modelValue && 'text-muted-foreground', -->
        <!--     props.class, -->
        <!--   ]" -->
        <!--   :disabled="props.disabled" -->
        <!-- > -->
        <!--   <CalendarIcon class="mr-2 h-4 w-4" /> -->
        <!--   {{ -->
        <!--     dateValue -->
        <!--       ? dateFormatter.format(dateValue.toDate(getLocalTimeZone())) -->
        <!--       : props.label -->
        <!--   }} -->
        <!-- </Button> -->
        <Button
          variant="outline"
          role="combobox"
          :class="[
            'w-full justify-between text-left font-normal border-[#0B3859]',
            !modelValue && 'text-muted-foreground',
            props.class,
          ]"
        >
          {{
            modelValue
              ? options.find((value) => value.value === modelValue)?.label
              : props.label
          }}
          <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <!-- <Calendar -->
        <!--   :minValue="props.minValue" -->
        <!--   :maxValue="props.maxValue" -->
        <!--   @update:modelValue="onUpdateValue" -->
        <!--   v-model="dateValue" -->
        <!--   initial-focus -->
        <!--   :disabled="props.disabled" -->
        <!-- /> -->
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
                    //modelValue = option.value;
                    onUpdateValue(option.value);
                  }
                "
              >
                {{ option.label }}
                <CheckIcon
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      option.value === modelValue ? 'opacity-100' : 'opacity-0',
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from "vue";
import { useVModel } from "@vueuse/core";
import { CaretSortIcon } from "@radix-icons/vue";

const props = defineProps<{
  label: string;
  class?: string;
  options: { value: string; label: any }[];
  value: string | undefined;
  disabled?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | undefined): void;
}>();

const modelValue = useVModel(props, "value", emits, {
  passive: true,
  defaultValue: props.value,
});

const onUpdateValue = (newValue: any | undefined) => {
  emits("update:modelValue", newValue ? newValue : undefined);
};
</script>
