<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { CalendarRoot, type CalendarRootEmits, type CalendarRootProps, useForwardPropsEmits, useDateFormatter } from 'radix-vue'
import { computed, type HTMLAttributes, ref } from 'vue'
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNextButton, CalendarPrevButton } from '.'
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date'

const props = defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>()

const emits = defineEmits<CalendarRootEmits>()

const spanishWeekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const spanishMonths = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const formatter = useDateFormatter('es')
const placeholder = ref(today(getLocalTimeZone()))

const isDateAllowed = (date: CalendarDate): boolean => {
  const today = new Date()
  const startValidDate = new Date(today.getFullYear(), 10, 20) 
  const nextYear = today.getFullYear() + 1
  const endValidDate = new Date(nextYear, 0, 31)


  const dateToValidate = new Date(date.year, date.month - 1, date.day)

  return dateToValidate >= startValidDate && dateToValidate <= endValidDate
}


const isDateDisabled = (date: CalendarDate): boolean => {
  return !isDateAllowed(date);
};


const getDateCellClass = (date: CalendarDate): string => {
  return isDateDisabled(date)
    ? 'opacity-50 pointer-events-none text-gray-400'
    : '';
};

</script>

<template>
  <CalendarRoot
    v-slot="{ grid, }"
    v-model:placeholder="placeholder"
    v-bind="forwarded"
     class="p-4 w-full max-w-4xl mx-auto bg-white "
  >
    <CalendarHeader class="flex justify-between items-center">
      <CalendarHeading class="flex-1 ml-4 font-bold text-xl">
        {{ spanishMonths[placeholder.month - 1] }}</CalendarHeading>
      <div class="flex items-center gap-1">
        <CalendarPrevButton />
        <CalendarNextButton />
      </div>
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" >
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="(day) in spanishWeekdays"
              :key="day"
              class="w-full sm:w-1/7 p-2 text-sm font-medium text-gray-500 mr-2"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mr-2">
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :disabled="isDateDisabled(weekDate)"
               class="w-full sm:w-1/7 p-2"
            >
            <CalendarCellTrigger
            :day="weekDate"
            :month="month.value"
            :disabled="isDateDisabled(weekDate)"
            :class="[
            getDateCellClass(weekDate),
            'h-8 w-8 flex items-center justify-center rounded-full',
            'hover:bg-muted focus:bg-muted',
            'aria-selected:bg-primary aria-selected:text-primary-foreground',
            'transition-colors duration-200'
            ]"
              >
                {{ weekDate.day }}
              </CalendarCellTrigger>
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>


