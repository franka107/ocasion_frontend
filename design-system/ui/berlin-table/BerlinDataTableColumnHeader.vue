<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  EyeOffIcon,
} from 'lucide-vue-next'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../select'

import { cn } from '@/lib/utils'

interface Props<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  class?: string
}

const props = defineProps<Props<any, any>>()

const ascValue = `${props.column.id}-asc`
const descValue = `${props.column.id}-desc`
const hideValue = `${props.column.id}-hide`

const currentValue = computed(() => {
  if (props.column.getIsSorted() === 'desc') return descValue
  if (props.column.getIsSorted() === 'asc') return ascValue
  return undefined
})

const ariaLabel = computed(() => {
  if (props.column.getIsSorted() === 'desc') {
    return 'Sorted descending. Click to sort ascending.'
  }
  if (props.column.getIsSorted() === 'asc') {
    return 'Sorted ascending. Click to sort descending.'
  }
  return 'Not sorted. Click to sort ascending.'
})

const handleValueChange = (value: string) => {
  if (value === ascValue) props.column.toggleSorting(false)
  else if (value === descValue) props.column.toggleSorting(true)
  else if (value === hideValue) props.column.toggleVisibility(false)
}
</script>

<template>
  <div
    v-if="!props.column.getCanSort() && !props.column.getCanHide()"
    :class="props.class"
  >
    {{ props.title }}
  </div>
  <div v-else :class="cn('flex items-center gap-2', props.class)">
    <Select :model-value="currentValue" @update:model-value="handleValueChange">
      <SelectTrigger
        :aria-label="ariaLabel"
        class="-ml-3 h-8 w-fit border-none text-xs hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent [&>svg:last-child]:hidden"
      >
        {{ props.title }}
        <template #icon>
          <ArrowDownIcon
            v-if="
              props.column.getCanSort() && props.column.getIsSorted() === 'desc'
            "
            class="ml-2.5 size-4"
            aria-hidden="true"
          />
          <ArrowUpIcon
            v-else-if="props.column.getIsSorted() === 'asc'"
            class="ml-2.5 size-4"
            aria-hidden="true"
          />
          <ChevronsUpDownIcon v-else class="ml-2.5 size-4" aria-hidden="true" />
        </template>
      </SelectTrigger>

      <SelectContent align="start">
        <template v-if="props.column.getCanSort()">
          <SelectItem :value="ascValue">
            <span class="flex items-center">
              <ArrowUpIcon
                class="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Asc
            </span>
          </SelectItem>
          <SelectItem :value="descValue">
            <span class="flex items-center">
              <ArrowDownIcon
                class="mr-2 size-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Desc
            </span>
          </SelectItem>
        </template>
        <SelectItem v-if="props.column.getCanHide()" :value="hideValue">
          <span class="flex items-center">
            <EyeOffIcon
              class="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Hide
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
