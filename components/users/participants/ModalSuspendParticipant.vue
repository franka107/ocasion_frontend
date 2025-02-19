<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { ExclamationTriangleIcon } from '@radix-icons/vue'
import { X } from 'lucide-vue-next'
import { rejectionReasonType } from '@/constants/attention-tray'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { OfferDto } from '~/types/Offer'
import OfferOption from '~/components/offers/offer-option/OfferOption.vue'
const { rejectRechargeRequest } = useTopUpRequests()
const openAnnulModal = ref(false)
const props = defineProps<{
  id: string
  modelValue: boolean
  refreshTable: () => void
}>()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const formSchema = toTypedSchema(
  z.object({
    suspensionReason: z.string().min(1, 'El comentario es requerido.'),
  }),
)
const emit = defineEmits(['update:modelValue'])
const form = useForm({
  validationSchema: formSchema,
})
const onConfirmButtonPressed = form.handleSubmit((values: any) => {
  handleReject({ suspensionReason: values.suspensionReason })
})

const cancelEdit = () => {
  userActiveOffers.value = null
  emit('update:modelValue', false)
}

const suspendParticipantAccount = async (
  userId: string,
  suspensionReason: string,
) => {
  const data = await useAPI(`/auth-management/suspend-participant-account`, {
    method: 'POST',
    body: {
      userId,
      suspensionReason,
    },
  } as any)
  return data
}

const userActiveOffers = ref<OfferDto[] | null>([])

const viewUserActiveOffers = async (userId: string) => {
  const data = await useAPI(`/offer-management/view-user-active-offers`, {
    method: 'GET',
    query: {
      userId,
    },
  } as any)
  return data
}

const refProps = toRefs(props)

watch(refProps.id, async (newValue, oldValue) => {
  if (newValue.length > 0) {
    const activeOffersRequest = await viewUserActiveOffers(props.id)
    userActiveOffers.value = activeOffersRequest.data.value as any
  }
})

const handleReject = async (params: { suspensionReason: string }) => {
  openConfirmModal({
    title: 'Suspender participante',
    message: '¿Está seguro que deseas suspender a este participante?',
    callback: async () => {
      const { status, error }: any = await suspendParticipantAccount(
        props.id,
        params.suspensionReason,
      )

      if (status.value === 'success') {
        openAnnulModal.value = false
        props.refreshTable()
        updateConfirmModal({
          title: 'Participante suspendido',
          message: 'Se ha suspendido al participante satisfactoriamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0]?.message ||
          error.value.data?.message ||
          'El participante no pudo ser suspendido, inténtalo más tarde.'
        updateConfirmModal({
          title: 'Error al suspender al participante',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>

<template>
  <AlertDialog
    :open="modelValue"
    class="z-[30]"
    @update:open="(event) => emit('update:modelValue', event)"
  >
    <AlertDialogContent class="z-[98] px-0">
      <form
        class="flex flex-col gap-6 flex-grow"
        @submit="onConfirmButtonPressed"
      >
        <div>
          <AlertDialogHeader class="flex items-center">
            <CustomIcons name="Warning" class="w-[32px] h-[32px]" />
            <AlertDialogTitle
              class="text-xl tracking-[-0.5px] text-primary text-start mb-[18px] font-[600] px-6"
              >Suspender participante</AlertDialogTitle
            >
          </AlertDialogHeader>
        </div>
        <div class="grid grid-cols-1 gap-3 px-6">
          <p class="text-[14px] font-[500] text-[#68686C]">
            ¿Está seguro que desea suspender a este partcipante? Si es asi por
            favor ingresar el motivo de la suspensión.
          </p>
          <!-- Comentario -->
          <FormField v-slot="{ componentField }" name="suspensionReason">
            <FormItem>
              <FormControl>
                <Textarea type="text" label="Razón" v-bind="componentField" />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
        </div>

        <div v-if="userActiveOffers" class="px-6">
          <p>Ofertas activas: {{ userActiveOffers.length }}</p>

          <div v-if="userActiveOffers.length > 0" class="">
            <div class="max-h-60 overflow-y-auto space-y-4">
              <div
                v-for="offer in userActiveOffers"
                :key="offer.id"
                class="overflow-hidden"
              >
                <OfferOption
                  class=""
                  :offer="offer"
                  :display-props="['id', 'status', 'endTime']"
                />
              </div>
            </div>
          </div>

          <p v-else class="text-gray-500 italic">
            El usuario no está en ninguna oferta activa.
          </p>
        </div>
        <p v-else class="text-gray-500 italic px-6">Cargando...</p>

        <AlertDialogFooter class="px-6">
          <Button
            type="button"
            size="xl"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
            @click.prevent="cancelEdit"
            >Cancelar</Button
          >
          <Button
            type="submit"
            class="text-[16px] font-[600]"
            size="xl"
            :disabled="!form.meta.value.valid"
            >Confirmar</Button
          >
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
