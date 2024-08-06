import { h } from 'vue';
import type { ColumnDef } from '@tanstack/vue-table';
import type { Action } from '~/components/common/table/DataTableRowActions.vue';
import DataTableRowActions from '@/components/common/table/DataTableRowActions.vue';

interface CreateColumnsProps<T> {
  additionalColumns: ColumnDef<T>[];
  actions: Action<T>[];
}

export const addActions = <T extends object>({
  additionalColumns,
  actions,
}: CreateColumnsProps<T>): ColumnDef<T>[] => {
  const baseColumns: ColumnDef<T>[] = [
    ...additionalColumns,
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => h(DataTableRowActions, { actions, row }),
    },
  ];

  return baseColumns;
};
