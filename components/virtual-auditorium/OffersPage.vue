<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ToastAction, useToast } from '../ui/toast'
import OfferList from '~/components/virtual-auditorium/OfferList.vue'
import OfferDetailsItem from '~/components/virtual-auditorium/OfferDetailsItem.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type { OfferListItem } from '~/types/Offer'
import type { IDataResponse } from '~/types/Common'

/* Mover a un componente */
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
const { socket } = useSocketIo()

const onPlaceBid = ({
  offerId,
  amount,
}: {
  offerId: string
  amount: number
}) => {
  socket.emit('placeBid', { offerId, amount })
}

const OFFER_BASE_URL = '/offer-management'
const options = ['Todos', 'Finalizado', 'Por vencer']
const props = defineProps({
  apiUrl: String,
})
const { apiUrl } = toRefs(props)
const { page, sortOptions } = useOfferAPI()
const filterOptions = ref('[]')

const { toast } = useToast()

const selectedOffer = ref<OfferListItem | undefined>(undefined)
const { data: offerListData, refresh } = await useAPI<
  IDataResponse<OfferListItem>
>(() => `${OFFER_BASE_URL}/${apiUrl?.value}`, {
  query: {
    limit: 8,
    page,
    filterOptions,
    sortOptions,
  },
} as any)
const offerList = computed<OfferListItem[]>(() => offerListData.value.data)
watch([apiUrl], () => {
  page.value = 1
  selectedOffer.value = undefined
  refresh()
})

socket.on('error', (data) => {
  const mainError = data.errors[0]
  if (mainError.code === 'AUCTION_MANAGEMENT.USER_NOT_SUBSCRIBED') {
    return
  }
  toast({
    title: 'Problema al pujar',
    description: mainError.message,
    variant: 'default',
    class: 'border-red',
    // action: h(
    //   ToastAction,
    //   {
    //     altText: 'Try again',
    //   },
    //   {
    //     default: () => 'Try again',
    //   },
    // ),
  })
})
socket.on('offerUpdated', (newOffer: OfferListItem) => {
  const offerIndex = offerList.value.findIndex(
    (offerItem) => offerItem.id === newOffer.id,
  )
  console.log(newOffer)
  if (offerIndex !== -1) {
    offerList.value[offerIndex] = newOffer
    if (selectedOffer.value?.id === offerList.value[offerIndex].id) {
      selectedOffer.value = newOffer
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
      <OfferList
        :offer-list="offerList"
        @on-select-offer="
          openDetails
        "
      />
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
      :on-place-bid="onPlaceBid"
      :socket="socket"
    />

    <!-- Modal OfferDetailItem móvil -->
    <AlertDialog
      :open="isModalOpen"
      class="z-[30] xl:hidden"
      @update:open="closeModal"
    >
      <AlertDialogContent class="z-[98] max-w-[400px] px-0 py-4  overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
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
          <OfferDetailsItem
            v-if="selectedOffer"
            :offer="selectedOffer"
            :socket="socket"
            :on-place-bid="onPlaceBid"
          />
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
