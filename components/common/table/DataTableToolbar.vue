<template>
  <div class="flex items-center mt-2 mr-4 flex-col gap-2 md:flex-row">
    <div class="flex flex-1 justify-end items-center space-x-2">
      <div v-for="filter in filters">
        <Input
          input-variant="classic"
          icon="search"
          :placeholder="filter.placeholder"
          :model-value="(table.getColumn(filter.field)?.getFilterValue() as string) ?? ''"
          @update:model-value="
            table.getColumn(filter.field)?.setFilterValue($event)
          "
          class="border-transparent w-[250px] h-12 bg-[#e3ecf0]"
        />
      </div>

    </div>
    <DataTableForm
    :create-button-label="props.createButtonLabel"
     :on-create="onCreate">
      <slot />
    </DataTableForm>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";
import type { Table } from "@tanstack/vue-table";
import DataTableForm from "./DataTableForm.vue";


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters: {
    field: string;
    placeholder: string;
  }[];
  createButtonLabel: string;
  status: any;
  onCreate: () => void;
}
const props = defineProps<DataTableToolbarProps<any>>();

const isFiltered = computed(
  () => props.table.getState().columnFilters.length > 0
);
</script>