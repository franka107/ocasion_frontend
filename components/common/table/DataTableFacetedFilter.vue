<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button size="sm" class="h-8">
        <PlusCircledIcon class="mr-2 h-4 w-4" />
        <p>{{ title }}</p>
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge
              v-if="selectedValues.size > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal"
            >
              {{ selectedValues.size }} seleccionados
            </Badge>
            <template v-else>
              <Badge
                v-for="option in options.filter((option) =>
                  selectedValues.has(option.value)
                )"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0" align="start">
      <Command
      >
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>No se han encontrado resultados.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option"
              @select="
                (e: any) => {
                  const isSelected = selectedValues.has(option.value);
                  if (isSelected) {
                    selectedValues.delete(option.value);
                  } else {
                    selectedValues.add(option.value);
                  }
                  const filterValues = Array.from(selectedValues);
                  column?.setFilterValue(
                    filterValues.length ? filterValues : undefined
                  );
                }
              "
            >
              <div
                :class="
                  cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    selectedValues.has(option.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible'
                  )
                "
              >
                <CheckIcon class="h-4 w-4" />
              </div>
              <component
                :is="option.icon"
                v-if="option.icon"
                class="mr-2 h-4 w-4 text-muted-foreground"
              />
              <span>{{ option.label }}</span>
              <span
                v-if="facets && facets.get(option.value)"
                class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
              >
                {{ facets.get(option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>
          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="{ label: 'Limpiar filtros' }"
                @select="column?.setFilterValue(undefined)"
                class="justify-center text-center"
              >
                Limpiar filtros
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { CheckIcon, PlusCircledIcon } from "@radix-icons/vue";
import type { Column } from "@tanstack/vue-table";


interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: any;
  }[];
}

const props = defineProps<DataTableFacetedFilterProps<any, any>>();

const facets = computed(() => props.column?.getFacetedUniqueValues())
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]))
</script>
