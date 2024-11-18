<template>
  <ContentLayout title="Gráficos">
    <div class="flex flex-col lg:flex-row min-h-screen bg-background rounded-lg">
      <div class="lg:w-80 border-b lg:border-r p-4">
        <div>
          <SimpleCalendar
            v-slot="{ date, grid, weekDays }"
             v-model="selectedDate"
            class="p-3 rounded-md border"
          >
           
          </SimpleCalendar>
        </div>

        <div class="space-y-4 mt-4">
        <div>
          <h1 class="text-lg font-sans font-bold">Eventos</h1>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <CustomIcons name="calendar-today" class="h-4 w-4"></CustomIcons>
              <span>Hoy</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <div class="w-2 h-2 rounded-full bg-[#2463EB]"></div>
              <span class="text-[#2463EB]">En curso</span>
              <span class="ml-auto">5</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <div class="w-2 h-2 rounded-full bg-[#DB2777]"></div>
              <span class="text-[#DB2777]">Finaliza</span>
              <span class="ml-auto">4</span>
            </div>
          </div>
        </div>
        <div>
          <h1 class="text-lg font-inter font-bold text-gray-400">Proximamente</h1>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <div class="w-2 h-2 rounded-full bg-gray-400"></div>
              <span class="text-gray-400">En curso</span>
              <span class="ml-auto text-gray-400">5</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <div class="w-2 h-2 rounded-full bg-gray-400"></div>
              <span class="text-gray-400">Finaliza</span>
              <span class="ml-auto text-gray-400">4</span>
            </div>
          </div>
        </div>
      </div>

      </div>
      <div class="flex-1 p-4">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Button variant="outline" size="icon" class="lg:hidden" @click="toggleSidebar">
              <CustomIcons name="icon"  class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" @click="navigatePrevious">
              <CustomIcons name="ArrowRight" class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" @click="navigateNext">
              <CustomIcons name="ArrowLeft" class="h-4 w-4" />
            </Button>
            <h1 class="text-2xl font-bold">{{ selectedDateFormatted }}</h1>
          </div>
          <Button variant="outline" size="icon" class="hidden lg:flex border-black ">
            <CustomIcons name="icon" class="h-4 w-4" />
          </Button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            v-for="i in 5" 
            :key="i" 
            class="bg-gray-100 shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <CardContent>
              <div class="flex text-xs gap-2 pt-3">
                <span class="ml-auto font-semibold text-gray-700">Termina:</span>
                <span class="font-semibold text-gray-800">02:00:00</span>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle class="text-[#20445E] font-semibold text-lg">Código del evento</CardTitle>
              <CardDescription class="text-sm text-gray-500">Organización</CardDescription>
            </CardHeader>

            <CardFooter>
              <Button variant="link" class="text-[#F97316] p-0 h-auto hover:underline font-semibold">
                Ir al evento
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  </ContentLayout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ChevronsLeft, ChevronsRight, Menu as MenuIcon } from 'lucide-vue-next'
import { useDateFormatter, useForwardPropsEmits } from 'radix-vue'
import { createDecade, createYear, toDate } from 'radix-vue/date'
import { DateValue, getLocalTimeZone, today } from '@internationalized/date'

import Button from '~/components/ui/button/Button.vue'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import Card from '~/components/ui/card/Card.vue'
import CardHeader from '~/components/ui/card/CardHeader.vue'
import CardTitle from '~/components/ui/card/CardTitle.vue'
import CardDescription from '~/components/ui/card/CardDescription.vue'
import CardContent from '~/components/ui/card/CardContent.vue'
import CardFooter from '~/components/ui/card/CardFooter.vue'
import { 
   CalendarHeader, CalendarHeading, CalendarGrid, 
  CalendarGridHead, CalendarGridBody, CalendarGridRow, 
  CalendarHeadCell, CalendarCell, CalendarCellTrigger 
} from '~/components/ui/calendar'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '~/components/ui/select'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import SimpleCalendar from '~/components/ui/calendar/SimpleCalendar.vue'

const selectedDate = ref<DateValue>(today(getLocalTimeZone()))

const formatter = useDateFormatter('es')

const selectedDateFormatted = computed<string>(() => {
  return toDate(selectedDate.value).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase()
})

const updateMonth = (v: string) => {
  if (!v || !selectedDate.value) return
  if (Number(v) === selectedDate.value.month) return
  selectedDate.value = selectedDate.value.set({ month: Number(v) })
}

const updateYear = (v: string) => {
  if (!v || !selectedDate.value) return
  if (Number(v) === selectedDate.value.year) return
  selectedDate.value = selectedDate.value.set({ year: Number(v) })
}

const navigatePrevious = () => {
  selectedDate.value = selectedDate.value.subtract({ days: 1 })
}

const navigateNext = () => {
  selectedDate.value = selectedDate.value.add({ days: 1 })
}

const toggleSidebar = () => {
  console.log('Toggle sidebar')
}
</script>