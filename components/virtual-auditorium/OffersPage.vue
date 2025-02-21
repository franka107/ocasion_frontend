<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ToastAction, useToast } from '../ui/toast'
import OfferList from '~/components/virtual-auditorium/OfferList.vue'
import OfferDetailsItem from '~/components/virtual-auditorium/OfferDetailsItem.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type { OfferDto, OfferListItem } from '~/types/Offer'
import type { IDataResponse } from '~/types/Common'

/* Mover a un componente */
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
// const { socket } = useSocketIo()
const socketPlaceBidService = useSocketPlaceBidService()
const bidService = useBidService()

const OFFER_BASE_URL = '/offer-management'
const options = ['Todos', 'Finalizado', 'Por vencer']
const props = defineProps<{
  apiUrl: string
  onAnyBidPlace: () => void
}>()
const { apiUrl } = toRefs(props)
const { page, sortOptions } = useOfferAPI()
const filterOptions = ref('[]')

const { toast } = useToast()

const selectedOffer = ref<OfferDto | undefined>(undefined)
const { data: offerListData, refresh } = await useAPI<IDataResponse<OfferDto>>(
  () => `${OFFER_BASE_URL}/${apiUrl?.value}`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)
const offerList = computed<OfferDto[]>(() => offerListData.value.data)

const connectedRooms = ref<Set<string>>(new Set())

// Función para unirse a una sala
function joinOfferRoom(offerId: string) {
  if (!connectedRooms.value.has(offerId)) {
    socketPlaceBidService.joinOfferRoom(offerId)
    connectedRooms.value.add(offerId)
  }
}

// Función para salir de una sala
function leaveOfferRoom(offerId: string) {
  if (connectedRooms.value.has(offerId)) {
    socketPlaceBidService.leaveOfferRoom(offerId)
    connectedRooms.value.delete(offerId)
  }
}

watch(
  () => offerList.value.map((offer) => offer.id), // Array de IDs actuales
  (newOfferIds, oldOfferIds) => {
    const newSet = new Set(newOfferIds)
    const oldSet = new Set(oldOfferIds)

    // Salir de salas que ya no están visibles
    for (const offerId of oldSet) {
      if (!newSet.has(offerId)) {
        leaveOfferRoom(offerId)
      }
    }

    // Unirse a salas nuevas
    for (const offerId of newSet) {
      if (!oldSet.has(offerId)) {
        joinOfferRoom(offerId)
      }
    }
  },
  { immediate: true },
)

// Limpiar conexiones al desmontar
onUnmounted(() => {
  connectedRooms.value.forEach((offerId) => leaveOfferRoom(offerId))
})

// socketPlaceBidService.joinOfferRoom('offerId')

watch([apiUrl], () => {
  page.value = 1
  selectedOffer.value = undefined
  refresh()
})

socketPlaceBidService.onNewBidPlaced((offer) => {
  props.onAnyBidPlace()
  const offerIndex = offerList.value.findIndex(
    (offerItem) => offerItem.id === offer.id,
  )
  if (offerIndex !== -1) {
    offerList.value[offerIndex] = offer
    if (selectedOffer.value?.id === offerList.value[offerIndex].id) {
      selectedOffer.value = offer
    }
  }
})

const isMobile = ref(false)

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 1280
}
window.addEventListener('resize', checkIfMobile)
checkIfMobile()

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

const isModalOpen = ref(false)

const openModal = () => {
  if (isMobile.value) {
    isModalOpen.value = true
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

const openDetails = (offer: OfferListItem) => {
  console.log(`open-details`)
  console.log(offer)
  selectedOffer.value = offer
  if (isMobile.value) {
    isModalOpen.value = true
  }
}
</script>

<template>
  <section class="flex gap-x-4 w-full max-w-[1324px]">
    <div class="max-w-[901px] w-full">
      <div
        class="flex h-[56px] items-center text-[#152A3C] justify-end mb-[8px] gap-x-4 px-[8px]"
      >
        <label class="font-semibold text-sm md:text-base leading-6"
          >Ordenar por:</label
        >
        <Select>
          <SelectTrigger
            class="max-w-[180px] text-xs md:text-base font-normal border border-[#CBD5E1] rounded-md p-2 text-[#152A3C]"
          >
            <SelectValue placeholder="Todos" class="max-w-[180px]" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in options"
              :key="option"
              :value="option"
              class="flex justify-center text-center rounded-md font-medium text-xs md:text-sm p-2 text-[#152A3C] hover:bg-[#F1F5F9]"
            >
              {{ option }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <OfferList :offer-list="offerList" @on-select-offer="openDetails" />
      <CustomPagination
        v-model:page="page"
        class="mt-8"
        :total="offerListData.count"
        :limit="8"
      />
    </div>
    <OfferDetailsItem
      v-if="selectedOffer && !isMobile"
      class="hidden xl:block w-full max-w-[350px]"
      :offer="selectedOffer"
    />

    <!-- Modal OfferDetailItem móvil -->
    <AlertDialog
      :open="isModalOpen"
      class="z-[10] xl:hidden"
      @update:open="closeModal"
    >
      <AlertDialogContent
        class="z-[98] max-w-[400px] px-0 py-4 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar"
      >
        <AlertDialogHeader
          class="flex flex-row justify-between items-center border-b border-primary"
        >
          <AlertDialogTitle
            class="text-lg tracking-tight text-primary text-start font-semibold px-4"
            >Detalle de la oferta</AlertDialogTitle
          >
          <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
            <X class="w-4 h-4 text-muted-foreground" />
          </SheetClose>
        </AlertDialogHeader>
        <div class="px-4">
          <OfferDetailsItem v-if="selectedOffer" :offer="selectedOffer" />
        </div>
        <AlertDialogFooter class="px-4 mt-4 flex justify-end gap-4">
          <Button
            type="button"
            class="text-base font-semibold bg-white text-primary border border-primary hover:bg-accent"
            @click="closeModal"
            >Cerrar</Button
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
