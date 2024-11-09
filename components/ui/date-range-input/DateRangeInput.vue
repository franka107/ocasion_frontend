<script setup lang="ts">
import { Button, buttonVariants } from '@/components/ui/button'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
} from '@/components/ui/range-calendar'

import { cn } from '@/lib/utils'
import {
  CalendarDate,
  type DateValue,
  isEqualMonth,
} from '@internationalized/date'
import dayjs from 'dayjs'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { type DateRange, RangeCalendarRoot, useDateFormatter } from 'radix-vue'
import { createMonth, type Grid, toDate } from 'radix-vue/date'
import { type Ref, ref, watch } from 'vue'
const props = withDefaults(defineProps<{
  placeholder?: string,
  modelValue: undefined | string[],
  locale?: string
}>(),{
  placeholder: 'Selecciona un rango de fechas',
  locale: 'en-US'
})
const emit = defineEmits<{
  (e: 'update:modelValue', payload: string[] | undefined): void
}>()

const nowYear = dayjs().year()
const nowMonth = dayjs().month() + 1
const nowDay = dayjs().date()
const value = ref({
  start: new CalendarDate(nowYear, nowMonth, nowDay),
  end: new CalendarDate(nowYear, nowMonth, nowDay).add({ days: 20 }),
}) as Ref<DateRange>

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const initDate = dayjs(newValue[0])
    const endDate = dayjs(newValue[1])
    value.value = {
      start: new CalendarDate(
        initDate.year(),
        initDate.month() + 1,
        initDate.date(),
      ),
      end: new CalendarDate(
        endDate.year(),
        endDate.month() + 1,
        endDate.date(),
      ),
    }
  }
})
const emitValue = (newValue: DateRange) => {
  if(newValue.start && newValue.end){
    emit('update:modelValue', [toDate(newValue.start).toISOString(), toDate(newValue.end).toISOString()])
  } else {
    emit('update:modelValue', undefined)
  }
}
const locale = ref(props.locale)
const formatter = useDateFormatter(locale.value)

const placeholder = ref(value.value?.start) as Ref<DateValue>
const secondMonthPlaceholder = ref(value.value?.end) as Ref<DateValue>

const firstMonth = ref(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>
const secondMonth = ref(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>

function updateMonth(reference: 'first' | 'second', months: number) {
  if (reference === 'first') {
    placeholder.value = placeholder.value.add({ months })
  }
  else {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months,
    })
  }
}

watch(placeholder, (_placeholder) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months: 1,
    })
  }
})

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
    placeholder.value = placeholder.value.subtract({ months: 1 })
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )
        "
      >
      <template v-if="props.modelValue">
        <template v-if="value.start">
          <template v-if="value.end">
            {{
              formatter.custom(toDate(value.start), {
                dateStyle: "medium",
              })
            }}
            -
            {{
              formatter.custom(toDate(value.end), {
                dateStyle: "medium",
              })
            }}
          </template>

          <template v-else>
            {{
              formatter.custom(toDate(value.start), {
                dateStyle: "medium",
              })
            }}
          </template>
        </template>
        <template v-else>
          {{ props.placeholder }}
        </template>
        </template>
        <template v-else>
          {{ props.placeholder }}
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendarRoot v-slot="{ weekDays }" v-model="value" @update:model-value="emitValue" v-model:placeholder="placeholder" class="p-3">
        <div
          class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('first', -1)"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <div
                :class="cn('text-sm font-medium')"
              >
                {{
                  formatter.fullMonthAndYear(
                    toDate(firstMonth.value),
                  )
                }}
              </div>
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('first', 1)"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
            <RangeCalendarGrid>
              <RangeCalendarGridHead>
                <RangeCalendarGridRow>
                  <RangeCalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-full"
                  >
                    {{ day }}
                  </RangeCalendarHeadCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody>
                <RangeCalendarGridRow
                  v-for="(
                    weekDates, index
                  ) in firstMonth.rows"
                  :key="`weekDate-${index}`"
                  class="mt-2 w-full"
                >
                  <RangeCalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <RangeCalendarCellTrigger
                      :day="weekDate"
                      :month="firstMonth.value"
                    />
                  </RangeCalendarCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('second', -1)"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <div
                :class="cn('text-sm font-medium')"
              >
                {{
                  formatter.fullMonthAndYear(
                    toDate(secondMonth.value),
                  )
                }}
              </div>

              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('second', 1)"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
            <RangeCalendarGrid>
              <RangeCalendarGridHead>
                <RangeCalendarGridRow>
                  <RangeCalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-full"
                  >
                    {{ day }}
                  </RangeCalendarHeadCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody>
                <RangeCalendarGridRow
                  v-for="(
                    weekDates, index
                  ) in secondMonth.rows"
                  :key="`weekDate-${index}`"
                  class="mt-2 w-full"
                >
                  <RangeCalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <RangeCalendarCellTrigger
                      :day="weekDate"
                      :month="secondMonth.value"
                    />
                  </RangeCalendarCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          </div>
        </div>
      </RangeCalendarRoot>
    </PopoverContent>
  </Popover>
</template>
