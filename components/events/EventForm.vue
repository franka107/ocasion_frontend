<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import Holidays from 'date-holidays'
import { X } from 'lucide-vue-next'
import { addDays, eachDayOfInterval, isBefore, isWeekend } from 'date-fns'
import {
  CalendarDate,
  startOfMonth,
  getLocalTimeZone,
  parseDate,
  today,
  type DateValue,
  parseAbsolute,
} from '@internationalized/date'
import Textarea from '../ui/textarea/Textarea.vue'
import type { Item } from '../ui/custom-select/CustomSelect.vue'
import { eventType, goodType, eventTimes } from '@/constants/events'
import type { IEventLItem } from '@/types/Event'
import InputFile from '@/components/common/file/Input.vue'
const EVENT_BASE_URL = '/event-management'
let form: any
const { getEvent } = useEvent()
const props = defineProps<{
  id: string | undefined
  orgid: string
  onsubmit: (values: any) => void
}>()

const countBusinessDays = (start: Date, end: Date) => {
  const hd = new Holidays({ country: 'PE' })
  const days = eachDayOfInterval({ start, end })
  let businessDaysCount = 0

  days.forEach((date) => {
    const isHoliday = hd.isHoliday(date)
    const isWeekendDay = isWeekend(date)

    if (!isHoliday && !isWeekendDay) {
      businessDaysCount++
    }
  })

  return businessDaysCount
}

const isBusinessDay = (date: Date): boolean => {
  const hd = new Holidays({ country: 'PE' })
  const isHoliday = hd.isHoliday(date)
  const isWeekendDay = isWeekend(date)
  return !isHoliday && !isWeekendDay
}

// Función para sumar 2 días hábiles
const addBusinessDays = (startDate: Date, numberOfDays: number): Date => {
  let businessDaysAdded = 0
  let currentDate = startDate

  while (businessDaysAdded < numberOfDays) {
    currentDate = addDays(currentDate, 1) // Agrega un día
    if (isBusinessDay(currentDate)) {
      businessDaysAdded++
    }
  }

  console.log(`currentDate ${currentDate}`)
  return currentDate
}

const validateInitialDate = (date: DateValue): boolean => {
  const todayDate = new Date()
  const selectedDate = date.toDate(getLocalTimeZone())

  const businessDaysCountToday = countBusinessDays(todayDate, selectedDate)
  console.log(`businessDaysCountToday ${businessDaysCountToday}`)
  if (businessDaysCountToday < 3) {
    return true
  } else {
    return false
  }
}

const validateEndDate = (date: DateValue): boolean => {
  const startDate = form.values.startDate
    ? parseDate(form.values.startDate)
    : null
  if (!startDate) return true

  const selectedDate = date.toDate(getLocalTimeZone())

  const businessDaysCountToday = countBusinessDays(
    startDate.toDate(getLocalTimeZone()),
    selectedDate,
  )
  console.log(`businessDaysCountToday ${businessDaysCountToday}`)
  if (businessDaysCountToday > 7) {
    return true
  } else {
    return false
  }

  // const startDate = new Date(this.props.startDate);
  // const endDate = new Date(this.props.endDate);
  //
  // const businessDaysUntilStart = countBusinessDays(todayDate, startDate);
  // console.log(`currentDate ${todayDate}`);
  // console.log(`startDate ${startDate}`);
  // console.log(`endDate ${endDate}`);
  // console.log(`businessDaysUntilStart ${businessDaysUntilStart}`);
  // if (isBefore(endDate, startDate)) {
  //   throw new EventEndDateBeforeStartDateFailure();
  // }

  // const businessDaysCount = this.countBusinessDays(startDate, endDate);
  // if (businessDaysCount > 7) {
  //   throw new EventSevenDaysBeforeStartDateFailure();
  // }
}

// const validate = (): boolean => {
//   const currentDate = new Date();
//   const startDate = new Date(this.props.startDate);
//   const endDate = new Date(this.props.endDate);
//
//   const businessDaysUntilStart = countBusinessDays(currentDate, startDate);
//   console.log(`currentDate ${currentDate}`);
//   console.log(`startDate ${startDate}`);
//   console.log(`endDate ${endDate}`);
//   console.log(`businessDaysUntilStart ${businessDaysUntilStart}`);
//   if (isBefore(endDate, startDate)) {
//     throw new EventEndDateBeforeStartDateFailure();
//   }
//
//   const businessDaysCountToday = this.countBusinessDays(currentDate, startDate);
//   if (businessDaysCountToday < 2) {
//     throw new EventStartDateTwoDaysAfterTodayFailure();
//   }
//
//   const businessDaysCount = this.countBusinessDays(startDate, endDate);
//   if (businessDaysCount > 7) {
//     throw new EventSevenDaysBeforeStartDateFailure();
//   }
// };
//

const eventTypesOptions = Array.from(eventType).map(([id, name]) => ({
  id,
  name,
}))
const goodTypeOptions = Array.from(goodType).map(([id, name]) => ({
  id,
  name,
}))
const eventTimesOptions: Item[] = Array.from(eventTimes).map(([id, name]) => ({
  id: Number(id),
  name,
}))
const formSchema = toTypedSchema(
  z.object({
    goodFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo de bien.'),
    termsAndConditionsFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo de tyc.'),
    name: z
      .string()
      .min(1, 'El nombre del evento es requerido.')
      .max(200, 'El nombre del evento no puede superar los 200 caracteres'),
    description: z.string().min(1, 'La descripción es requerida.'),
    type: z.string().min(1, 'El tipo de evento es requerido.'),
    goodType: z.string().min(1, 'El tipo de bien es requerido.'),
    startDate: z.string().min(1, 'La fecha de inicio es requerida.'),
    endDate: z.string().min(1, 'La fecha de fin es requerida.'),
    closingTime: z.number().min(1, 'El horario de cierre es requerido.'),
  }),
)
if (props.id) {
  const { data: organizationData } = await getEvent(props.id)

  form = useForm({
    validationSchema: formSchema,
    initialValues: organizationData.value,
  })
} else {
  form = useForm({ validationSchema: formSchema })
}

watch(form.values, (newValues) => {
  console.log('Form values:', newValues)
  console.log('Attached Files:', newValues.attachedFiles) // Revisa este log
})

const onSubmit = form.handleSubmit((values: any) => {
  const { ...restValues } = values

  const formattedValues = {
    ...restValues,
    organization: {
      id: props.orgid,
    },
  }
  if (props.id) {
    formattedValues.id = props.id
  }
  props.onsubmit(formattedValues)
})

const handleFilesChange = (files: File[]) => {
  form.values.attachedFiles = files.map((file) => file.name)
}
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">{{
      props.id ? 'Actualizar evento' : 'Crear evento'
    }}</SheetTitle>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form
      class="flex flex-col gap-4 flex-grow pt-5 pr-5 pl-5"
      @submit="onSubmit"
    >
      <FormField v-slot="{ componentField }" name="goodFiles">
        <FormItem>
          <FormControl>
            <InputFile
              v-model="form.values.goodFiles"
              title="Lista de bienes"
              instructions-text="Cargar máximo 10 elementos(xlsx, docx, pdf)"
              :limit-files="10"
              v-bind="componentField"
              @update:value="handleFilesChange"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="termsAndConditionsFiles">
        <FormItem>
          <FormControl>
            <InputFile
              v-model="form.values.attachedFiles"
              title="Términos y condiciones"
              :limit-files="10"
              instructions-text="Cargar maximo 10 elementos(xlsx, docx, pdf)"
              v-bind="componentField"
              @update:value="handleFilesChange"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormControl>
            <CustomInput
              type="text"
              label="Nombre del evento"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormControl>
            <Textarea type="text" label="Descripción" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="type">
        <FormItem>
          <FormControl>
            <CustomSelect
              v-bind="componentField"
              :disabled="!!props.id"
              :items="eventTypesOptions"
              placeholder="Tipo de evento"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="goodType">
        <FormItem>
          <FormControl>
            <CustomSelect
              v-bind="componentField"
              :disabled="!!props.id"
              :items="goodTypeOptions"
              placeholder="Tipo de bien"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="flex gap-2">
        <FormField v-slot="{ componentField }" name="startDate">
          <FormItem class="w-1/2">
            <FormControl>
              <DateInput
                class="my-2"
                label="Fecha de inicio"
                :value="componentField.modelValue"
                :min-value="
                  parseAbsolute(
                    addBusinessDays(new Date(), 2).toISOString(),
                    getLocalTimeZone(),
                  )
                "
                @update:model-value="componentField.onChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="endDate">
          <FormItem class="w-1/2">
            <FormControl>
              <DateInput
                class="my-2"
                label="Fecha de fin"
                :min-value="
                  form.values.startDate
                    ? parseDate(form.values.startDate)
                    : undefined
                "
                :max-value="
                  form.values.startDate
                    ? parseAbsolute(
                        addBusinessDays(
                          parseDate(form.values.startDate).toDate(
                            getLocalTimeZone(),
                          ),
                          6,
                        ).toISOString(),
                        getLocalTimeZone(),
                      )
                    : undefined
                "
                :value="componentField.modelValue"
                :disabled="!form.values.startDate"
                @update:model-value="componentField.onChange"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormField v-slot="{ componentField }" name="closingTime">
        <CustomSelect
          v-bind="componentField"
          :items="eventTimesOptions"
          placeholder="Horario de cierre"
        />
      </FormField>

      <SheetFooter class="mt-auto">
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'w-full h-10 text-base bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
        >
          {{ props.id ? 'Actualizar evento' : 'Crear evento' }}
        </Button>
      </SheetFooter>
    </form>
    <!-- </Form> -->
  </div>
</template>
