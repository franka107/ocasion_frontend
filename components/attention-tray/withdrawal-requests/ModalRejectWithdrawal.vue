<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { ExclamationTriangleIcon } from '@radix-icons/vue'
import { X } from 'lucide-vue-next'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { rejectionReasonType } from '@/constants/attention-tray'
const { rejectWithdrawal } = useWithdrawalRequests()
const openAnnulModal = ref(false)
const props = defineProps<{
  id: string
  modelValue: boolean
  refreshTable: () => void
}>()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const emit = defineEmits(['update:modelValue'])
const rejectionReasonOptions = Array.from(rejectionReasonType).map(
  ([id, name]) => ({
    id,
    name,
  }),
)
const formSchema = toTypedSchema(
  z.object({
    rejection: z.string().min(1, 'Seleccione un motivo.'),
    comment: z.string().min(1, 'El comentario es requerido.'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values: any) => {
  const { rejection, comment } = values
  handleReject({ rejectId: props.id, rejection, comment })
  console.log('onsubmit', rejection, comment)
})
const cancelEdit = () => {
  emit('update:modelValue', false)
}
const handleReject = async (values: any) => {
  openConfirmModal({
    title: 'Rechazar solicitud de retiro',
    message: '¿Está seguro que desea rechazar la solicitud de retiro?',
    callback: async () => {
      const payload = {
        id: props.id,
        rejectionReason: values.rejection,
        rejectionDetails: values.comment,
      }
      const { status, error }: any = await rejectWithdrawal(payload)
      if (status.value === 'success') {
        openAnnulModal.value = false
        props.refreshTable()
        updateConfirmModal({
          title: 'Solicitud de retiro rechazada',
          message: 'Se ha rechazado la solicitud de retiro',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El solicitud de retiro no se pudo rechazar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al rechazar la solicitud de retiro',
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
    <AlertDialogContent class="z-[98] max-w-[409px] px-0">
      <form class="flex flex-col gap-6 flex-grow" @submit="onSubmit">
        <div>
          <AlertDialogHeader class="flex items-center">
            <CustomIcons name="Warning" class="w-[32px] h-[32px]" />
            <AlertDialogTitle
              class="text-xl tracking-[-0.5px] text-primary text-start mb-[18px] font-[600] px-6"
              >Rechazar solicitud</AlertDialogTitle
            >
          </AlertDialogHeader>
        </div>
        <div class="grid grid-cols-1 gap-3 px-6">
          <p class="text-[14px] font-[500] text-[#68686C]">
            ¿Está seguro que desea rechazar la solicitud de retiro? Si es asi
            por favor ingresar el motivo de rechazo.
          </p>
          <!-- Motivo de Rechazo -->
          <FormField v-slot="{ componentField }" name="rejection">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="rejectionReasonOptions"
                  placeholder="Forma de pago"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Comentario -->
          <FormField v-slot="{ componentField }" name="comment">
            <FormItem>
              <FormControl>
                <Textarea
                  type="text"
                  label="Comentarios"
                  v-bind="componentField"
                />
                <FormMessage />
              </FormControl>
            </FormItem>
          </FormField>
        </div>
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
