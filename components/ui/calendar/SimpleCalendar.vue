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
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const dateToValidate = new Date(date.year, date.month - 1, date.day);


  if (currentMonth === 10 && currentDay >= 22) {
    const startDate = new Date(currentYear, 10, 22);
    const endDate = new Date(currentYear + 1, 0, 31);
    return dateToValidate >= startDate && dateToValidate <= endDate;
  }

  const startMonth = Math.floor(currentMonth / 2) * 2;
  let startYear = currentYear;
  let endYear = currentYear;

  if (startMonth === 10) {
    endYear = currentYear + 1;
  }

  const startDate = new Date(startYear, startMonth, 1);
  const endDate = new Date(endYear, startMonth + 2, 0);

  return dateToValidate >= startDate && dateToValidate <= endDate;
};

const isDateDisabled = (date: CalendarDate): boolean => {
  return !isDateAllowed(date);
};

const handlePlaceholderChange = (date: CalendarDate) => {
  placeholder.value = date
  handleDateChange(date)
}

const handleDateChange = (selectedDate: CalendarDate) => {
  if (isDateAllowed(selectedDate)) {
    emits('update:modelValue', selectedDate)
  } else {
    console.warn("Fecha seleccionada no permitida:", selectedDate)
  }
}

const getDateCellClass = (date: CalendarDate): string => {
  return isDateDisabled(date)
    ? 'opacity-50 pointer-events-none text-gray-400'
    : '';
};
</script>

<template>
  <CalendarRoot
    v-slot="{ grid }"
    v-model:placeholder="placeholder"
    @update:placeholder="handlePlaceholderChange"
    v-bind="forwarded"
    class="p-4 w-full max-w-4xl mx-auto bg-white"
  >
    <CalendarHeader class="flex justify-between items-center">
      <CalendarHeading class="flex-1 ml-4 font-bold text-xl">
        {{ spanishMonths[placeholder.month - 1] }}
      </CalendarHeading>
      <div class="flex items-center gap-1">
        <CalendarPrevButton />
        <CalendarNextButton />
      </div>
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in spanishWeekdays"
              :key="day"
              class="w-9 p-0 text-sm font-medium text-gray-500"
            >
              {{ day.slice(0, 2) }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`">
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              :disabled="isDateDisabled(weekDate)"
              class="p-0 relative focus-within:relative focus-within:z-20"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :disabled="isDateDisabled(weekDate)"
                :class="[
                  getDateCellClass(weekDate),
                  'h-9 w-9 mx-auto flex items-center justify-center rounded-full',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground',
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

