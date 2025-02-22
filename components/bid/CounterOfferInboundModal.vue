<script setup lang="ts">
import { InfoIcon } from 'lucide-vue-next'
import AlertDescription from '../ui/alert/AlertDescription.vue'
import type { CounterOfferDto } from '~/composables/useCounterOffer'
import BerlinStatusDialog, {
  type BerlinStatusDialogOpen,
} from '~/design-system/berlin/dialog/status/BerlinStatusDialog.vue'
import BerlinLoader from '~/design-system/berlin/loader/BerlinLoader.vue'
import { BidStatus } from '~/types/Bids'

const props = defineProps<{
  counterOfferId: string | null
  onCounterOfferDialogChanged: (value: boolean) => void
  onAcceptedSuccess: () => void
  onRejectedSuccess: () => void
}>()

const counterOfferService = useCounterOffer()
const counterOffer = ref<CounterOfferDto | null>(null)
const isActionsDisabled = ref<boolean>(false)
const statusDialogOpen = ref<BerlinStatusDialogOpen | null>(null)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()

const counterOfferWasRejected = computed(() => {
  return counterOffer.value && counterOffer.value.status === 'REJECTED'
})

const counterOfferWasConfirmed = computed(() => {
  return counterOffer.value && counterOffer.value.status === 'ACCEPTED'
})

const cannotBeActioned = computed(() => {
  return (
    counterOfferWasRejected.value ||
    counterOfferWasConfirmed.value ||
    bidWasActioned.value
  )
})

const bidWasActioned = computed(() => {
  return (
    counterOffer.value && counterOffer.value.bid.status !== BidStatus.Debated
  )
})

const alertTitle = computed(() => {
  if (counterOfferWasRejected.value) {
    return 'Contraoferta rechazada o expirada'
  }
  if (counterOfferWasConfirmed.value) {
    return 'Contraoferta confirmada'
  }
  if (bidWasActioned.value) {
    return 'Puja expirada'
  }
  return 'Contraofertar puja'
})

const alertMessage = computed(() => {
  if (counterOfferWasConfirmed.value) {
    return 'Esta contraoferta ya ha sido confirmada y ya no puede ser accionada.'
  }
  if (counterOfferWasRejected.value) {
    return 'Esta contraoferta ha sido rechazada o expiró.'
  }
  if (bidWasActioned.value) {
    return 'Esta puja ha expirado y no puede ser contraofertada.'
  }
  return 'Esta contraoferta ha expirado y no puede ser aceptada o rechazada.'
})

const fetchCounterOffer = async (id: string) => {
  counterOffer.value = null
  if (!props.counterOfferId) return
  const response = await counterOfferService.viewDetail(id)
  counterOffer.value = response.data.value
}

watch(
  () => props.counterOfferId,
  async (value, oldValue) => {
    if (value) {
      fetchCounterOffer(value)
    } else {
      counterOffer.value = null
    }
  },
)

const onAcceptButtonPressed = async () => {
  if (!props.counterOfferId) return
  openConfirmModal({
    title: 'Aceptar contraoferta',
    message: `¿Está seguro que desea aceptar la contraoferta?`,
    callback: async () => {
      if (!props.counterOfferId) return
      isActionsDisabled.value = true
      const { status, error } = await counterOfferService.acceptToParticipant(
        props.counterOfferId,
      )
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Proceso exitoso!',
          message: 'La contraoferta fue aceptada.',
          type: 'success',
        })
        isActionsDisabled.value = false
        fetchCounterOffer(props.counterOfferId)
        props.onAcceptedSuccess()
      } else {
        const eMsg = getBackendError(error.value)
        updateConfirmModal({
          title: 'Problema al aceptar contraoferta',
          message: eMsg,
          type: 'error',
        })
        isActionsDisabled.value = false
      }
    },
  })
}

const onRejectButtonPressed = async () => {
  if (!props.counterOfferId) return
  openConfirmModal({
    title: 'Rechazar contraoferta',
    message: `¿Está seguro que desea rechazar la contraoferta?`,
    callback: async () => {
      if (!props.counterOfferId) return
      isActionsDisabled.value = true
      const { status, error } = await counterOfferService.rejectToParticipant(
        props.counterOfferId,
      )
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Proceso exitoso!',
          message: 'La contraoferta fue rechazada',
          type: 'success',
        })
        isActionsDisabled.value = false
        fetchCounterOffer(props.counterOfferId)
        props.onRejectedSuccess()
      } else {
        const eMsg = getBackendError(error.value)
        updateConfirmModal({
          title: 'Problema al rechazar contraoferta',
          message: eMsg,
          type: 'error',
        })
        isActionsDisabled.value = false
      }
    },
  })
}
</script>

<template>
  <AlertDialog
    :open="props.counterOfferId !== null"
    class="z-[30]"
    @update:open="(event) => props.onCounterOfferDialogChanged(event)"
  >
    <AlertDialogContent class="z-[98] max-w-[600px] px-0">
      <div v-if="counterOffer">
        <AlertDialogHeader class="border-b border-primary">
          <AlertDialogTitle
            class="text-xl tracking-[-0.5px] text-primary text-start mb-[18px] font-[600] px-6"
            >Contraofertar puja
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div class="pt-6 px-6">
          <Alert
            v-if="
              counterOfferWasRejected ||
              counterOfferWasConfirmed ||
              bidWasActioned
            "
          >
            <InfoIcon />
            <AlertTitle> {{ alertTitle }} </AlertTitle>
            <AlertDescription>
              {{ alertMessage }}
            </AlertDescription>
          </Alert>
        </div>

        <div class="grid grid-cols-2 gap-3 px-6 pt-6">
          <CustomInput
            class="h-14 w-full"
            type="number"
            label="Monto actual"
            :model-value="counterOffer.bid.amount"
            :disabled="true"
            label-offset
          />
          <CustomInput
            class="h-14 w-full"
            type="number"
            label="Monto de la contraoferta"
            :model-value="counterOffer.amount"
            :disabled="true"
            label-offset
          />
        </div>

        <AlertDialogFooter class="px-6">
          <Button
            type="button"
            size="xl"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent mt-[16px]"
            @click="
              () => {
                props.onCounterOfferDialogChanged(false)
              }
            "
            >Cancelar</Button
          >
          <Button
            type="submit"
            class="text-[16px] font-[600] mt-[16px]"
            variant="destructive"
            :disabled="isActionsDisabled || cannotBeActioned"
            size="xl"
            @click="onRejectButtonPressed"
          >
            <LoaderIcon
              v-if="isActionsDisabled"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Rechazar
          </Button>

          <Button
            type="submit"
            class="text-[16px] font-[600] mt-[16px]"
            :disabled="isActionsDisabled || cannotBeActioned"
            size="xl"
            @click="onAcceptButtonPressed"
          >
            <LoaderIcon
              v-if="isActionsDisabled"
              class="mr-2 h-4 w-4 animate-spin"
            />
            Aceptar
          </Button>
        </AlertDialogFooter>
      </div>
      <div v-else>
        <BerlinLoader />
      </div>
    </AlertDialogContent>
  </AlertDialog>
  <BerlinStatusDialog
    :open="statusDialogOpen"
    @close="
      () => {
        statusDialogOpen = null
      }
    "
  />
</template>
