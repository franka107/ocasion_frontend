<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
        <DotsHorizontalIcon class="h-4 w-4" />
        <span class="sr-only">Abrir menú</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <div v-for="(action, index) in actions" :key="action.label">
        <DropdownMenuItem asChild class="flex items-center w-full justify-between">
          <button
            type="button"
            @click="action.onClick(row.original)"
            :disabled="action.isDisabled(row.original)"
          >
            <span :class="{ 'text-[#5f7382]': action.isDisabled(row.original) }">
              {{ action.label }}
            </span>
            <BerlinIcon
              v-if="action.icon"
              :class="{ 'stroke-[#5f7382]': action.isDisabled(row.original), 'h-4 w-4': true }"
              :iconName="action.icon"
            />
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="index < actions.length - 1" />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { DotsHorizontalIcon } from '@radix-icons/vue';
import type { Row } from '@tanstack/vue-table';
// import BerlinIcon from '~/design-system/atoms/berlin-icon/icon';

export interface Action<T> {
  label: string;
  icon?: any; //BerlinIcon
  onClick: (row: T) => void;
  isDisabled: (row: T) => boolean;
}

export default defineComponent({
  name: 'DataTableRowActions',
  props: {
    actions: {
      type: Array as PropType<Action<any>[]>,
      required: true,
    },
    row: {
      type: Object as PropType<Row<any>>,
      required: true,
    },
  },
});
</script>
