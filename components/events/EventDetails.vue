<template>
  <div
    class="flex py-4 px-10 rounded-xl min-h-[88px] items-center bg-white w-full mb-6"
  >
    <div class="h 10 w 10">
      <Button variant="ghost" @click="router.back">
        <CustomIcons name="BackArrow" class="w-6 h-6 text-primary" />
      </Button>
    </div>
    <div class="ml-7">
      <p class="text-xs text-[#49454F]">
        {{ eventDetail.organization.name }}
      </p>
      <h1 class="m text- font-bold text-primary">
        Evento - {{ params.eventId }}
      </h1>
    </div>

    <div class="ml-auto">
      <slot></slot>
    </div>
  </div>
  <div class="py-4 px-10 rounded-xl items-center bg-white w-full">
    <div class="grid md:grid-cols-[2fr_1fr] grid-cols-1 gap-6">
      <div>
        <h3 class="mb-5 text-sm text-[#676767]">Datos del evento</h3>
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
              :text="eventStatus.get(eventDetail.status)?.name || ''"
              :variant="eventStatus.get(eventStatus.status)?.color as any"
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
</template>
<script setup lang="ts">
import FakeInput from '../auth/FakeInput.vue'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import InputFile from '@/components/common/file/Input.vue'
import type { IEventLItem } from '@/types/Event'
import {
  eventType,
  goodType,
  eventTimes,
  eventStatus,
} from '@/constants/events'

const { params } = useRoute()
const router = useRouter()
const props = defineProps<{ eventDetail: IEventLItem }>()
const { eventDetail } = toRefs(props)
</script>
