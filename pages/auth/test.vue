<script setup lang="tsx">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import TasksTable, {
  type Task,
  type TasksTableProps,
} from '~/components/tasks/TasksTable.vue'
import { useRetireRequestService } from '~/src/application/services/useRetireRequestService'

// const queryClient = useQueryClient()
// const retireRequestService = useRetireRequestService()
//
// const tasksQuery = useQuery({
//   queryKey: ['tasks'],
//   queryFn: retireRequestService.fetchPaginatedRetireRequest,
// })
//
// // Mutation
// const mutation = useMutation({
//   mutationFn: postTodo,
//   onSuccess: () => {
//     // Invalidate and refetch
//     queryClient.invalidateQueries({ queryKey: ['tasks'] })
//   },
// })
//
// function onButtonClick() {
//   mutation.mutate({
//     id: Date.now(),
//     title: 'Do Laundry',
//   })
// }

const tableData = ref<TasksTableProps>({
  data: [],
  pageCount: 0,
  statusCounts: {},
  priorityCounts: {},
})

const tableDataTasks: Task[] = [
  {
    archived: false,
    code: 'COD-1',
    createdAt: new Date(),
    id: 'COD-1',
    label: 'bug',
    priority: 'high',
    status: 'canceled',
    title: 'Title',
    updatedAt: null,
  },
]

onMounted(async () => {
  try {
    const [{ data, pageCount }, statusCounts, priorityCounts] =
      await Promise.all([
        Promise.resolve({ data: tableDataTasks, pageCount: 1 }),
        Promise.resolve({}),
        Promise.resolve({}),
      ])

    tableData.value = {
      data,
      pageCount,
      statusCounts,
      priorityCounts,
    }
  } catch (error) {
    console.error('Failed to load table data:', error)
  }
})
</script>

<template>
  <!-- <div class="bg-white border border-blue p-6"> -->
  <!--   <span v-if="tasksQuery.isPending">Loading...</span> -->
  <!--   <span v-else-if="tasksQuery.isError" -->
  <!--     >Error: {{ tasksQuery.error.message }}</span -->
  <!--   > -->
  <!--   <!-- We can assume by this point that `isSuccess === true` -->
  -->
  <!--   <ul v-else> -->
  <!--     <li v-for="todo in tasksQuery.data" :key="todo.id">{{ todo.title }}</li> -->
  <!--   </ul> -->
  <!--   <button @click="onButtonClick">Add Todo</button> -->
  <!--   <TasksTable -->
  <!--     :data="tableData.data" -->
  <!--     :page-count="tableData.pageCount" -->
  <!--     :priority-counts="tableData.priorityCounts" -->
  <!--     :status-counts="tableData.statusCounts" -->
  <!--   /> -->
  <!-- </div> -->
</template>
