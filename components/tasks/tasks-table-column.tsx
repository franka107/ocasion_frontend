import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  CircleHelpIcon,
  CircleIcon,
  CircleXIcon,
  Ellipsis,
  TimerIcon,
} from 'lucide-vue-next'
import type { ColumnDef, Row } from '@tanstack/vue-table'
import { Transition } from 'vue'
import type { Task } from './TasksTable.vue'
import Checkbox from '~/design-system/ui/checkbox/Checkbox.vue'
import BerlinDataTableColumnHeader from '~/design-system/ui/berlin-table/BerlinDataTableColumnHeader.vue'
import Badge from '~/design-system/ui/badge/Badge.vue'
import { formatDate } from '~/design-system/ui/berlin-table/berlin-table-utils'
import DropdownMenu from '~/design-system/ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '~/design-system/ui/dropdown-menu/DropdownMenuTrigger.vue'
import Button from '~/design-system/ui/button/Button.vue'
import DropdownMenuContent from '~/design-system/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '~/design-system/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSub from '~/design-system/ui/dropdown-menu/DropdownMenuSub.vue'
import DropdownMenuSubTrigger from '~/design-system/ui/dropdown-menu/DropdownMenuSubTrigger.vue'
import DropdownMenuSubContent from '~/design-system/ui/dropdown-menu/DropdownMenuSubContent.vue'
import DropdownMenuRadioGroup from '~/design-system/ui/dropdown-menu/DropdownMenuRadioGroup.vue'
import DropdownMenuSeparator from '~/design-system/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuShortcut from '~/design-system/ui/dropdown-menu/DropdownMenuShortcut.vue'
import DropdownMenuRadioItem from '~/design-system/ui/dropdown-menu/DropdownMenuRadioItem.vue'

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: 'update' | 'delete'
}

export interface GetColumnsProps {
  setRowAction: (action: DataTableRowAction<Task> | null) => void
}

export function getStatusIcon(status: Task['status']) {
  const statusIcons = {
    canceled: CircleXIcon,
    done: CheckCircle2Icon,
    'in-progress': TimerIcon,
    todo: CircleHelpIcon,
  }

  return statusIcons[status] || CircleIcon
}

export function getPriorityIcon(priority: Task['priority']) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  }

  return priorityIcons[priority] || CircleIcon
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<Task>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onUpdate:checked={(value) => {
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label="Select all"
          class="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onUpdate:checked={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          class="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'code',
      header: ({ column }) => (
        <BerlinDataTableColumnHeader column={column} title="Task" />
      ),
      cell: ({ row }) => <div class="w-20">{row.getValue('code')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <BerlinDataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        // const label = tasks.label.enumValues.find(
        //   (label) => label === row.original.label,
        // )
        const label = 'titleLabel'

        return (
          <div class="flex space-x-2">
            {label && <Badge variant="outline">{label}</Badge>}
            <span class="max-w-[31.25rem] truncate font-medium">
              {row.getValue('title')}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <BerlinDataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        // const status = tasks.status.enumValues.find(
        //   (status) => status === row.original.status,
        // )
        const status: Task['status'] = 'canceled'

        if (!status) return null

        const Icon = getStatusIcon(status)

        return (
          <div class="flex w-[6.25rem] items-center">
            <Icon
              class="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span class="capitalize">{status}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <BerlinDataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        // const priority = tasks.priority.enumValues.find(
        //   (priority) => priority === row.original.priority,
        // )
        const priority: Task['priority'] = 'high'

        if (!priority) return null

        const Icon = getPriorityIcon(priority)

        return (
          <div class="flex items-center">
            <Icon
              class="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span class="capitalize">{priority}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'archived',
      header: ({ column }) => (
        <BerlinDataTableColumnHeader column={column} title="Archived" />
      ),
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.archived ? 'Yes' : 'No'}</Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <BerlinDataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const isUpdatePending = ref(false)

        return (
          <Transition>
            <DropdownMenu v-if={isUpdatePending.value}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  class="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <Ellipsis class="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-40">
                <DropdownMenuItem
                  onClick={() => setRowAction({ row, type: 'update' })}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      modelValue={row.original.label}
                      onUpdate:modelValue={(value) => {
                        isUpdatePending.value = true
                        // toast.promise(
                        //   updateTask({
                        //     id: row.original.id,
                        //     label: value as Task['label'],
                        //   }),
                        //   {
                        //     loading: 'Updating...',
                        //     success: 'Label updated',
                        //     error: (err) => getErrorMessage(err),
                        //   },
                        // )
                        isUpdatePending.value = false
                      }}
                    >
                      {/* {tasks.label.enumValues.map((label) => (
                        <DropdownMenuRadioItem
                          key={label}
                          value={label}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ))} */}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setRowAction({ row, type: 'delete' })}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Transition>
        )
      },
      size: 40,
    },
  ]
}
