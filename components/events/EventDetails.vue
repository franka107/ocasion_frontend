<template>
  <div
    class="flex py-4 px-10 rounded-xl min-h-[88px] items-center bg-white w-full mb-6"
  >
    <div class="h-10 w-10">
      <Button variant="ghost" @click="router.back">
        <CustomIcons name="BackArrow" class="w-6 h-6 text-primary" />
      </Button>
    </div>
    <div class="ml-7">
      <p class="text-xs text-[#49454F]">
        {{ eventDetail.organization.name }}
      </p>
      <h1 class="m-0 text-xl font-bold text-primary">
        Evento - {{ params.eventId }}
      </h1>
    </div>
    <div class="ml-auto">
      <slot></slot>
    </div>
  </div>



  <div class="py-4 px-10 rounded-xl items-center bg-white w-full">
    <div class="flex justify-between items-center relative">
      <h3
        class="p-2 text-sm text-[#676767] transition-all duration-300 w-full"
        :class="{
          'transform translate-x-[45%]': !showContent,
          'translate-x-0': showContent
        }"
      >
        Datos del evento
      </h3>
      <button
        @click="toggleContent"
        class="text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-5 h-5 transition-transform duration-200"
          :class="showContent ? 'rotate-180' : 'rotate-0'"
        >
          <path
            fill-rule="evenodd"
            d="M12 15.5a.75.75 0 01-.53-.22l-6-6a.75.75 0 111.06-1.06L12 13.69l5.47-5.47a.75.75 0 111.06 1.06l-6 6a.75.75 0 01-.53.22z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div
      class="transition-all duration-300 overflow-hidden"
      :class="{
        'max-h-[1000px] opacity-100': showContent,
        'max-h-0 opacity-0': !showContent
      }"
    >
      <div class="grid md:grid-cols-[2fr_1fr] grid-cols-1 gap-6 mt-4">
        <div>
          <div
            class="grid grid-cols-[repeat(auto-fill,_minmax(240px,1fr))] md:grid-cols-2 gap-5"
          >
            <InputWithLabel
              read-field
              label="Nombre del evento"
              :model-value="eventDetail.name"
            />
            <InputWithLabel
              read-field
              label="Tipo de Evento"
              :model-value="eventType.get(eventDetail.type)"
            />
            <div
              class="grid grid-cols-[repeat(auto-fill,_minmax(120px,1fr))] md:grid-cols-2 gap-5"
            >
              <InputWithLabel
                read-field
                label="Fecha de Inicio"
                :model-value="eventDetail.startDate"
              />
              <InputWithLabel
                read-field
                label="Fecha de cierre"
                :model-value="eventDetail.endDate"
              />
            </div>
            <InputWithLabel
              read-field
              label="Tipo de bien"
              :model-value="goodType.get(eventDetail.goodType)"
            />
            <FakeInput read-field label="Estado">
              <CustomChip
                :text="eventStatusRecord[eventDetail.status as EventStatus].name || ''"
                :variant="eventStatusRecord[eventDetail.status as EventStatus].color as any"
              ></CustomChip>
            </FakeInput>
            <InputWithLabel
              read-field
              label="Horario de cierre"
              :model-value="eventTimes.get(String(eventDetail.closingTime))"
            />
          </div>
        </div>
        <div>
          <h3 class="mb-5 text-sm text-[#676767]">Archivos subidos</h3>
          <FormField name="attachedFiles">
            <FormItem>
              <FormControl>
                <InputFile
                  v-model="eventDetail.goodFiles"
                  disabled
                  hide-remove-icon
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FakeInput from '../auth/FakeInput.vue'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import InputFile from '@/components/common/file/Input.vue'
import type { EventStatus, EventDto } from '@/types/Event'
import {
  eventType,
  goodType,
  eventTimes,
  eventStatus,
  eventStatusRecord,
} from '@/constants/events'

const { params } = useRoute()
const router = useRouter()
const props = defineProps<{ eventDetail: EventDto }>()
const { eventDetail } = toRefs(props)


const showContent = ref(true)

const toggleContent = () => {
  showContent.value = !showContent.value
}
</script>

<style scoped>
button svg {
  transition: transform 0.2s ease-in-out;
  border: 0.5px solid gray;
  border-radius: 20%;
}

.transform {
  transition: all 0.3s ease-in-out;
}

/* Aseguramos que la transición sea suave */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
