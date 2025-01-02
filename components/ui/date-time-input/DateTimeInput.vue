<template>
  <div>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="[
            'w-full justify-start text-left font-normal relative border-[#0B3859]',
            !modelValue && 'text-[#94A3B8]',
            props.class,
          ]"
          :disabled="props.disabled"
        >
          <span
            v-if="dateValue"
            class="absolute text-[#64748B] bg-white text-xs top-[-8px] left-2 px-1"
            >{{ props.label }}</span
          >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{
            dateValue
              ? dateFormatter.format(dateValue.toDate(getLocalTimeZone()))
              : props.label
          }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <div class="sm:flex">
          <!-- <Calendar -->
          <!--   mode="single" -->
          <!--   :selected="date" -->
          <!--   :initial-focus="true" -->
          <!--   @select="handleDateSelect" -->
          <!-- /> -->

          <Calendar
            v-model="dateValue"
            locale="es"
            :min-value="props.minValue"
            :max-value="props.maxValue"
            :is-date-disabled="props.isDateDisabled"
            initial-focus
            :disabled="props.disabled"
            @update:model-value="onUpdateValue"
          />
          <div
            class="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x"
          >
            <ScrollArea class="w-64 sm:w-auto">
              <div class="flex sm:flex-col p-2">
                <Button
                  v-for="hour in reversedHours"
                  :key="hour"
                  size="icon"
                  :variant="
                    dateValue &&
                    dateValue.toDate(getLocalTimeZone()).getHours() === hour
                      ? 'default'
                      : 'ghost'
                  "
                  class="sm:w-full shrink-0 aspect-square"
                  @click="handleTimeChange('hour', hour.toString())"
                >
                  {{ hour }}
                </Button>
              </div>
              <ScrollBar orientation="horizontal" class="sm:hidden" />
            </ScrollArea>
            <ScrollArea class="w-64 sm:w-auto">
              <div class="flex sm:flex-col p-2">
                <Button
                  v-for="minute in minutes"
                  :key="minute"
                  size="icon"
                  :variant="
                    dateValue &&
                    dateValue.toDate(getLocalTimeZone()).getMinutes() === minute
                      ? 'default'
                      : 'ghost'
                  "
                  class="sm:w-full shrink-0 aspect-square"
                  @click="handleTimeChange('minute', minute.toString())"
                >
                  {{ minute.toString().padStart(2, '0') }}
                </Button>
              </div>
              <ScrollBar orientation="horizontal" class="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'
import {
  CalendarDate,
  CalendarDateTime,
  DateFormatter,
  fromDate,
  getLocalTimeZone,
  parseAbsolute,
  parseAbsoluteToLocal,
  parseDate,
  parseDateTime,
  type DateValue,
} from '@internationalized/date'
import CalendarIcon from '@radix-icons/vue/CalendarIcon'

const dateFormatter = new DateFormatter('es', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const props = defineProps<{
  label: string
  class?: string
  maxValue?: DateValue
  minValue?: DateValue
  isDateDisabled?: (date: DateValue) => boolean
  value: string | undefined
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | undefined): void
}>()

const modelValue = useVModel(props, 'value', emits, {
  passive: true,
  defaultValue: props.value,
})

const hours = Array.from({ length: 24 }, (_, i) => i)
const reversedHours = computed(() => [...hours].reverse())
const minutes = computed(() => Array.from({ length: 12 }, (_, i) => i * 5))

const dateValue = computed({
  get: () => (modelValue.value ? parseDateTime(modelValue.value) : undefined),
  get: () => {
    let value
    if (modelValue.value) {
      try {
        value = parseDateTime(modelValue.value)
      } catch (err) {
        value = parseAbsolute(modelValue.value, getLocalTimeZone())
        // try {
        // } catch (err) {
        //   // etc.
        // }
      }
    } else {
      return undefined
    }
    return value
  },
  // get: () =>
  //   modelValue.value
  //     ? parseAbsolute(modelValue.value, getLocalTimeZone())
  //     : undefined,
  set: (val) => {
    modelValue.value = val ? val.toString() : undefined
  },
})

const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
  // notificationDf.format(
  //   parseAbsolute(
  //     notification.createdAt,
  //     getLocalTimeZone(),
  //   ).toDate(),
  // )
  if (dateValue.value) {
    const newDate = dateValue.value.toDate(getLocalTimeZone())
    if (type === 'hour') {
      newDate.setHours(parseInt(value))
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value))
    }
    // dateValue.value = parseDateTime(newDate.toISOString())
    // dateValue.value = parseDateTime(
    //   parseAbsolute(newDate.toISOString(), getLocalTimeZone())
    //     .toDate()
    //     .toISOString(),
    // )
    const jsDate = newDate
    const calendarDateTime = new CalendarDateTime(
      jsDate.getFullYear(),
      jsDate.getMonth() + 1, // Los meses en JavaScript son base 0
      jsDate.getDate(),
      jsDate.getHours(),
      jsDate.getMinutes(),
      jsDate.getSeconds(),
    )
    dateValue.value = calendarDateTime
  }
}

const onUpdateValue = (newValue: DateValue | undefined) => {
  emits('update:modelValue', newValue ? newValue.toString() : undefined)
}
</script>
