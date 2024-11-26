<template>
  <ContentLayout title="Gráficos">
    <div
      class="flex flex-col lg:flex-row min-h-screen bg-background rounded-lg"
    >
      <div class=" border-b lg:border-r p-4">
        <div>
          <SimpleCalendar
            v-slot="{ }"
            v-model="selectedDate"
            class="p-3 rounded-md border"
          >
          </SimpleCalendar>
        </div>

        <div class="space-y-4 mt-4 ml-4">
            <h1 class="text-lg font-sans font-bold">Eventos</h1>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <CustomIcons
                  name="calendar-today"
                  class="h-4 w-4"
                ></CustomIcons>
                <span class="text-[#1F4E6D] text-base font-bold">Hoy</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-[#2463EB]"></div>
                <span class="text-[#2463EB]">En curso</span>
                <span class="ml-auto">{{ eventCounts.today.inProgressCount }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-[#DB2777]"></div>
                <span class="text-[#DB2777]">Finaliza</span>
                <span class="ml-auto">{{ eventCounts.today.finishedCount }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <CustomIcons
                  name="calendar-today"
                  class="h-4 w-4"
                ></CustomIcons>
                <span class="text-[#1F4E6D] font-inter text-base font-extrabold" >Mañana</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-[#16A34A]"></div>
                <span class="text-[#16A34A]">Inicia</span>
                <span class="ml-auto">{{ eventCounts.tomorrow.inProgressCount }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-[#DB2777]"></div>
                <span class="text-[#DB2777]">Finaliza</span>
                <span class="ml-auto">{{ eventCounts.tomorrow.finishedCount }}</span>
              </div>
            </div>

          <div>
            <h1 class="text-lg font-inter font-bold text-[#68686C]">
              Proximamente
            </h1>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                <span class="text-[#86868A]">En curso</span>
                <span class="ml-auto text-gray-400">{{ eventCounts.soon.inProgressCount }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                <span class="text-[#86868A]">Finaliza</span>
                <span class="ml-auto text-gray-400">{{ eventCounts.soon.finishedCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 p-4">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              class="lg:hidden"
               @click="openModal"
            >
              <CustomIcons name="icon" class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" @click="navigatePrevious">
              <CustomIcons name="ArrowRight" class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" @click="navigateNext">
              <CustomIcons name="ArrowLeft" class="h-4 w-4" />
            </Button>
            <h1 class="text-2xl font-bold">{{ selectedDateFormatted }}</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            class="hidden lg:flex border-black"
            @click="openModal"
          >
            <CustomIcons name="icon" class="h-4 w-4" />
          </Button>
        </div>

        <div v-if="events">
          <div
            v-if="events.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <Card
              v-for="event in events"
              :key="event.id"
              class=" w-[270px] h-[184px] bg-[#F3F8FC] shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <CardContent>
                <div class="flex text-xs gap-2 pt-3">
                  <span class="ml-auto font-semibold text-gray-700"
                    >Termina:</span
                  >
                  <Countdown
                    v-slot="{  hours, minutes, seconds }"
                    :time="getRemainingTimes(event.finishedAt)"
                  >
                    <span class="font-semibold text-gray-800"
                      >{{ hours }}:{{ minutes }}:{{ seconds }}</span
                    >
                  </Countdown>
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle class="text-[#20445E] font-semibold text-lg">{{
                  event.id
                }}</CardTitle>
                <CardDescription class="text-sm text-[#68686C]">{{
                  event.organization.name
                }}</CardDescription>
              </CardHeader>

              <CardFooter>
                <NuxtLink :to="`/dashboard/platform/events/${event.id}`">
                  <Button
                    variant="link"
                    class="text-[#F97316] p-0 h-auto hover:underline font-semibold"
                  >
                    Ir al evento
                  </Button>
                </NuxtLink>
              </CardFooter>
            </Card>
          </div>
          <div class="flex items-center  justify-center h-screen font-semibold" v-else>No hay eventos en este dia</div>
        </div>
        <div v-else>
          <p class="flex items-center  justify-center h-screen font-semibold">Cargando...</p>
        </div>
      </div>
    </div>
     <!-- Sheet para el filtro -->
     <SheetContent
      v-model:open="isSheetOpen"
      side="right"
      class="flex flex-col h-full"
      @pointer-down-outside="(e) => e.preventDefault()"
      @interact-outside="(e) => e.preventDefault()"
    >
      <SheetHeader>
        <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
          <X class="w-4 h-4 text-muted-foreground" />
        </SheetClose>
        <SheetTitle class="text-xl font-medium text-[#64748B]">
          Filtro
        </SheetTitle>
      </SheetHeader>
      <FilterCalendar
        v-model:open="isSheetOpen"
        :organizations="allOrganizations"
        :initial-form-values="filterFormValues"
        :on-submit="onSubmit"
      />
    </SheetContent>

  </ContentLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ChevronsLeft, ChevronsRight, Menu as MenuIcon, X } from 'lucide-vue-next'
import { useDateFormatter, useForwardPropsEmits } from 'radix-vue'
import { createDecade, createYear, toDate } from 'radix-vue/date'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'

import type { FilterFormSchema } from './components/filter-form-schema'
import type { Organization } from '~/models/organizations'
import { GlobalType } from '~/types/Common'

import Button from '~/components/ui/button/Button.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import Card from '~/components/ui/card/Card.vue'
import CardHeader from '~/components/ui/card/CardHeader.vue'
import CardTitle from '~/components/ui/card/CardTitle.vue'
import CardDescription from '~/components/ui/card/CardDescription.vue'
import CardContent from '~/components/ui/card/CardContent.vue'
import CardFooter from '~/components/ui/card/CardFooter.vue'
import {
  CalendarHeader,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
} from '~/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import SimpleCalendar from '~/components/ui/calendar/SimpleCalendar.vue'
import type { Event } from '~/types/Payment'
import { parseISO,isEqual, formatDistanceToNow, differenceInSeconds } from 'date-fns'
import FilterCalendar from './FilterCalendar.vue'
import { getCalculatedFilterFormSchema } from './month-select'
import { MonthSelect } from './month-select'

const allOrganizations = ref<Organization[]>([])
const fetchOrganizations = async () => {
  const { data } = await useAPI('/organization-management/find-organizations', {
    method: 'GET',
    default: () => [],
  })
  allOrganizations.value = data.value as any
}

const userSessionExtended = useUserSessionExtended()

if (userSessionExtended.globalType === GlobalType.Platform) {
  await fetchOrganizations()
}

const filterFormValues = ref<FilterFormSchema>({
  ...getCalculatedFilterFormSchema(MonthSelect.ThisMonth),
  organizations:
    userSessionExtended.globalType === GlobalType.Platform
      ? allOrganizations.value.map((org) => org.id)
      : undefined,
})
const isSheetOpen = ref(false)
const openModal = () => {
  isSheetOpen.value = true
}

const onSubmit = async (newValues) => {
  // Actualizar los valores del formulario de filtro
  filterFormValues.value = {
    ...getCalculatedFilterFormSchema(
      newValues.monthSelect,
      newValues.rangeStart,
      newValues.rangeEnd,
    ),
    organizations: newValues.organizations,
  }

  // Actualizar las organizaciones seleccionadas
  if (newValues.organizations?.length) {
    selectedOrganizations.value = allOrganizations.value.filter(org =>
      newValues.organizations.includes(org.id)
    )
  }

  // Recargar los eventos con los nuevos filtros
  //await fetchEvents()
  //await fetchEventCounts()

  // Cerrar el modal de filtros
  isSheetOpen.value = false
}
const selectedDate = ref<DateValue>(today(getLocalTimeZone()))
const events = ref<any[] | null>(null)

const selectedOrganizations = ref<Organization[]>([])

const eventCounts = ref({

  today: {
    inProgressCount: 0,
    finishedCount: 0
  },
  tomorrow: {
    inProgressCount: 0,
    finishedCount: 0
  },
  soon: {
    inProgressCount: 0,
    finishedCount: 0
  }
})
const getRemainingTimes = (finishedAtString) => {
  const finishedAt = parseISO(finishedAtString)
  const now = new Date()

  const totalSecondsRemaining = Math.floor((finishedAt - now) / 1000)

  if (totalSecondsRemaining <= 0) {
    return 0
  }

  const days = Math.floor(totalSecondsRemaining / (24 * 60 * 60))
  const hours = Math.floor((totalSecondsRemaining % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((totalSecondsRemaining % (60 * 60)) / 60)
  const seconds = totalSecondsRemaining % 60

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: totalSecondsRemaining
  }
}

const fetchEventCounts = async () => {
  console.log("Iniciando la solicitud al endpoint /event-management/get-events-count-for-calendar");

  const { data } = await useAPI('/event-management/get-events-count-for-calendar', {
    method: 'POST',
    body: {
      organizationIds: selectedOrganizations.value.map((e) => e.id),
    },
    default: () => ({
      today: { inProgressCount: 0, finishedCount: 0 },
      tomorrow: { inProgressCount: 0, finishedCount: 0 },
      soon: { inProgressCount: 0, finishedCount: 0 }
    }),
  })

  console.log("Respuesta recibida del endpoint:", data);

  if (data.value) {
    eventCounts.value = data.value
    console.log("eventCounts actualizado:", eventCounts.value);
  } else {
    console.warn("No se recibieron datos válidos del endpoint.");
  }
}
const fetchEvents = async (selectedDate?: Date | null) => {
  events.value = null // Mostrar estado de carga

  const { data } = await useAPI('/event-management/get-events-for-calendar', {
    method: 'POST',
    body: {
      selectedDate: selectedDate || null,
      organizationIds: filterFormValues.value.organizations,
      rangeStart: filterFormValues.value.rangeStart,
      rangeEnd: filterFormValues.value.rangeEnd
    },
    default: () => ([]),
  })

  if (data?.value && Array.isArray(data.value)) {
    events.value = data.value
  } else {
    events.value = []
    console.warn('No se encontraron eventos o los datos no son válidos')
  }
}

// Agregar un watcher para los cambios en los filtros
watch(
  () => filterFormValues.value,
  async (newValues) => {
    if (newValues) {
      await fetchEvents()
      await fetchEventCounts()
    }
  },
  { deep: true }
)

onMounted(async () => {
  await fetchOrganizations()
  await fetchEventCounts()
  //await fetchEvents()
})

watch(selectedDate, (newDate) => {
  fetchEvents(toDate(newDate))
})

const formatter = useDateFormatter('es')

const selectedDateFormatted = computed<string>(() => {
  const date = toDate(selectedDate.value)
  return formatter.custom(date, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, (c) => c.toUpperCase())
})
const updateMonth = (v: string) => {
  if (!v || !selectedDate.value) return

  const newMonth = Number(v)
  if (newMonth < 1 || newMonth > 12) {
    console.warn('Mes inválido')
    return
  }

  if (newMonth === selectedDate.value.month) return
  selectedDate.value = selectedDate.value.set({ month: newMonth })
}

const updateYear = (v: string) => {
  if (!v || !selectedDate.value) return

  const newYear = Number(v)
  if (newYear < 1900 || newYear > 2100) {
    console.warn('Año inválido')
    return
  }

  if (newYear === selectedDate.value.year) return
  selectedDate.value = selectedDate.value.set({ year: newYear })
}

const navigatePrevious = () => {
  const newDate = selectedDate.value.subtract({ days: 1 })
  if (newDate < today(getLocalTimeZone())) {
    console.warn('No puedes navegar a una fecha pasada')
    return
  }
  selectedDate.value = newDate
}

const navigateNext = () => {
  const today = new Date()
  const startValidDate = new Date(today.getFullYear(), 10, 20) // 20 de noviembre
  const nextYear = today.getFullYear() + 1
  const endValidDate = new Date(nextYear, 0, 31) // 31 de enero

  const newDate = selectedDate.value.add({ days: 1 })

  // Verificar si la nueva fecha está dentro del rango
  if (newDate > endValidDate) {
    console.warn('No puedes avanzar más allá del 31 de enero')
    return
  }


  selectedDate.value = newDate
}
const toggleSidebar = () => {
  console.log('Toggle sidebar')
}


</script>
