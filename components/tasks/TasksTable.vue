<script setup lang="ts">
import { computed, ref } from 'vue'
import { getColumns, type DataTableRowAction } from './tasks-table-column'
import type {
  DataTableAdvancedFilterField,
  DataTableFilterField,
} from '~/design-system/ui/berlin-table/types'
import { useDataTable } from '~/design-system/ui/berlin-table/use-berlin-table'
import BerlinDataTable from '~/design-system/ui/berlin-table/BerlinDataTable.vue'

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'canceled'
export type TaskLabel = 'bug' | 'feature' | 'enhancement' | 'documentation'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  code: string
  title: string | null
  status: TaskStatus
  label: TaskLabel
  priority: TaskPriority
  archived: boolean
  createdAt: Date
  updatedAt: Date | null
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TasksTableProps {
  data: Task[]
  statusCounts: Record<string, number>
  priorityCounts: Record<string, number>
  pageCount: number
}

const props = defineProps<TasksTableProps>()

const rowAction = ref<DataTableRowAction<Task> | null>(null)

const columns = computed(() =>
  getColumns({
    setRowAction: (action) => (rowAction.value = action),
  }),
)

const filterFields = computed<DataTableFilterField<Task>[]>(() => [
  {
    id: 'title',
    label: 'Title',
    placeholder: 'Filter titles...',
  },
  // {
  //   id: 'status',
  //   label: 'Status',
  //   options: tasks.status.enumValues.map((status) => ({
  //     label: toSentenceCase(status),
  //     value: status,
  //     icon: getStatusIcon(status),
  //     count: props.statusCounts[status],
  //   })),
  // },
  // {
  //   id: 'priority',
  //   label: 'Priority',
  //   options: tasks.priority.enumValues.map((priority) => ({
  //     label: toSentenceCase(priority),
  //     value: priority,
  //     icon: getPriorityIcon(priority),
  //     count: props.priorityCounts[priority],
  //   })),
  // },
])

const advancedFilterFields = computed<DataTableAdvancedFilterField<Task>[]>(
  () => [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
    },
    // {
    //   id: 'status',
    //   label: 'Status',
    //   type: 'multi-select',
    //   options: tasks.status.enumValues.map((status) => ({
    //     label: toSentenceCase(status),
    //     value: status,
    //     icon: getStatusIcon(status),
    //     count: props.statusCounts[status],
    //   })),
    // },
    // {
    //   id: 'priority',
    //   label: 'Priority',
    //   type: 'multi-select',
    //   options: tasks.priority.enumValues.map((priority) => ({
    //     label: toSentenceCase(priority),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     count: props.priorityCounts[priority],
    //   })),
    // },
    {
      id: 'createdAt',
      label: 'Created at',
      type: 'date',
    },
  ],
)

// const enableAdvancedTable = computed(() =>
//   featureFlags.includes('advancedTable'),
// )
// const enableFloatingBar = computed(() => featureFlags.includes('floatingBar'))

const { table } = useDataTable({
  data: props.data,
  columns: columns.value,
  pageCount: props.pageCount,
  filterFields: filterFields.value,
  // enableAdvancedFilter: enableAdvancedTable.value,

  enableAdvancedFilter: false,
  initialState: {
    sorting: [{ id: 'createdAt', desc: true }],
    columnPinning: { right: ['actions'] },
  },
  getRowId: (originalRow) => originalRow.id,
  shallow: false,
  clearOnDefault: true,
})
</script>

<template>
  <div>
    <BerlinDataTable :table="table" :floating-bar="null">
      <template v-if="false">
        <!-- <DataTableAdvancedToolbar
          :table="tabler
          :filter-fields="advancedFilterFields"
          :shallow="false"
        >
          <TasksTableToolbarActions :table="table" />
        </DataTableAdvancedToolbar> -->
      </template>
      <template v-else>
        <!-- <DataTableToolbar :table="table" :filter-fields="filterFields">
          <TasksTableToolbarActions :table="table" />
        </DataTableToolbar> -->
      </template>
    </BerlinDataTable>

    <!-- <UpdateTaskSheet
      :open="rowAction?.type === 'update'"
      :on-open-change="() => (rowAction = null)"
      :task="rowAction?.row.original ?? null"
    />

    <DeleteTasksDialog
      :open="rowAction?.type === 'delete'"
      :on-open-change="() => (rowAction = null)"
      :tasks="rowAction?.row.original ? [rowAction.row.original] : []"
      :show-trigger="false"
      @success="rowAction?.row.toggleSelected(false)"
    /> -->
  </div>
</template>
