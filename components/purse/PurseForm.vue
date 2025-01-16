<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  purseId: string | any
  title: string
}>()
const { landingUrl } = useRuntimeConfig().public

const purseDetails = ref<
  Array<{ id: string; amount: number; eventName: string, eventId: string }>
>([])

const fetchPurseDetails = async (purseId: string) => {
  try {
    const { data } = await useAPI(
      `/user-management/get-my-guaranteed-amounts`,
      {
        default: () => [],
        query: {
          filterOptions: JSON.stringify([
            { field: 'purse.id', type: 'equal', value: purseId },
          ]),
        },
      },
    )
    purseDetails.value = data.value.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      eventName: item.event.name,
      eventId: item.eventId,
    }))
  } catch (error) {
    console.error('Error al cargar los detalles del monedero', error)
  }
}
await fetchPurseDetails(props.purseId)

</script>

<template>
  <SheetHeader class="justify-between">
    <SheetTitle class="ml-2 text-[18px] font-[700] text-[#152A3C]">
      {{ title }}
    </SheetTitle>
    <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form
      class="flex flex-col gap-6 flex-grow p-6 gap-y-[24px]"
      @submit.prevent
    >
      <div
        class="p-[8px] rounded-[4px] bg-[#F3F8FC] leading-[20px] text-[#152A3C] font-[400] text-[14px]"
      >
        <p>Eventos con garantía en curso</p>
      </div>
      <ul>
        <li
          v-for="item in purseDetails"
          :key="item.id"
          class="flex flex-col mb-4"
        >
          <div class="flex flex-col">
            <div class="flex items-center">
              <div class="font-[700] text-sm text-[#20445E] pr-[4px]">
                EVENTO:
              </div>
              <div class="text-sm text-[#000000] font-[400]">
                {{ item.eventName }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="font-[700] text-sm text-[#20445E] pr-[4px]">
                MONTO:
              </div>
              <div class="text-sm text-[#000000] font-[400]">
                $ {{ item.amount }}
              </div>
            </div>
            <a
              :href="`${landingUrl}/events/${item.eventId}`"
              target="_blank"
              class="flex text-[#F97316] font-[400] text-[14px]">
              Ver evento
            </a>
          </div>
        </li>
      </ul>
    </form>
  </div>
</template>
