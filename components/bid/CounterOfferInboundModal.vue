<script setup lang="ts">
import type { CounterOfferDto } from '~/composables/useCounterOffer'
import BerlinStatusDialog, {
  type BerlinStatusDialogOpen,
} from '~/design-system/berlin/dialog/status/BerlinStatusDialog.vue'
import BerlinLoader from '~/design-system/berlin/loader/BerlinLoader.vue'

const props = defineProps<{
  counterOfferId: string | null
  onCounterOfferDialogChanged: (value: boolean) => void
  onAcceptedSuccess: () => void
  onRejectedSuccess: () => void
}>()

const counterOfferService = useCounterOffer()
const counterOffer = ref<CounterOfferDto | null>(null)
const isSubmitting = ref<boolean>(false)
const statusDialogOpen = ref<BerlinStatusDialogOpen | null>(null)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()

watch(
  () => props.counterOfferId,
  async (value, oldValue) => {
    if (value) {
      const response = await counterOfferService.viewDetail(value)
      counterOffer.value = response.data.value
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
      isSubmitting.value = true
      const { status, error } = await counterOfferService.acceptToParticipant(
        props.counterOfferId,
      )
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Proceso exitoso!',
          message: 'La contraoferta fue aceptada.',
          type: 'success',
        })
        isSubmitting.value = false
        props.onAcceptedSuccess()
      } else {
        const eMsg = getBackendError(error.value)
        updateConfirmModal({
          title: 'Problema al aceptar contraoferta',
          message: eMsg,
          type: 'error',
        })
        isSubmitting.value = false
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
      isSubmitting.value = true
      const { status, error } = await counterOfferService.rejectToParticipant(
        props.counterOfferId,
      )
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Proceso exitoso!',
          message: 'La contraoferta fue rechazada',
          type: 'success',
        })
        isSubmitting.value = false
        props.onRejectedSuccess()
      } else {
        const eMsg = getBackendError(error.value)
        updateConfirmModal({
          title: 'Problema al rechazar contraoferta',
          message: eMsg,
          type: 'error',
        })
        isSubmitting.value = false
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
            >Contraofertar puja</AlertDialogTitle
          >
        </AlertDialogHeader>
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
            :disabled="isSubmitting"
            size="xl"
            @click="onRejectButtonPressed"
          >
            <LoaderIcon v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Rechazar
          </Button>

          <Button
            type="submit"
            class="text-[16px] font-[600] mt-[16px]"
            :disabled="isSubmitting"
            size="xl"
            @click="onAcceptButtonPressed"
          >
            <LoaderIcon v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
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
