<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import PricePanel from '../common/PricePanel.vue'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const props = defineProps<{
  offerId: string
  offerTitle: string
  oldAppraisal: number
  counterProposalAmount: number | null
  newAppraisal: number
  modelValue: boolean
  refreshTable: () => void
}>()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { modifyOfferAppraisal } = useOfferAPI()
const formSchema = toTypedSchema(
  z.object({
    newAppraisal: z
      .number()
      .gte(1, { message: 'La nueva tasacion es requerida.' }),
  }),
)
const emit = defineEmits(['update:modelValue'])
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values: any) => {
  const { newAppraisal } = values
  handleSubmit({ offerId: props.offerId, newAppraisal })
  console.log('newAppraisal', newAppraisal)
})
const handleSubmit = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar Nueva Tasacion',
    message: '¿Estás seguro de que deseas actualizar la tasación de la oferta?',
    callback: async () => {
      const { status, error }: any = await modifyOfferAppraisal(values)
      if (status.value === 'success') {
        emit('update:modelValue', false)
        props.refreshTable()
        updateConfirmModal({
          title: 'Tasacion actualizada',
          message: 'La tasacion a sido actualizada exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'No se pudo modificar la tasacion, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al modificar la tasacion',
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
    <AlertDialogContent class="z-[98] max-w-[600px] px-0">
      <form class="flex flex-col gap-10 flex-grow" @submit="onSubmit">
        <AlertDialogHeader class="border-b border-primary">
          <AlertDialogTitle
            class="text-xl tracking-[-0.5px] text-primary text-start mb-[18px] font-[600] px-6"
            >Cambio de tasación</AlertDialogTitle
          >
        </AlertDialogHeader>

        <PricePanel
          v-if="props.counterProposalAmount"
          class="mx-6 mt-6"
          label="Valor propuesto por la organización"
          :price="props.counterProposalAmount"
        />
        <div class="px-6">
          <CustomInput
            class="h-14 w-full"
            type="string"
            label="Nombre del evento"
            :model-value="props.offerTitle"
            :disabled="true"
            label-offset
          />
        </div>
        <div class="grid grid-cols-2 gap-3 px-6">
          <CustomInput
            class="h-14 w-full"
            type="number"
            label="Tasación actual"
            :model-value="props.oldAppraisal"
            :disabled="true"
            label-offset
          />
          <FormField v-slot="{ componentField }" name="newAppraisal">
            <FormItem>
              <FormControl>
                <CustomInput
                  class="h-14 w-full"
                  type="number"
                  label="Nuevo valor de tasacion"
                  v-bind="componentField"
                  label-offset
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <AlertDialogFooter class="px-6">
          <Button
            type="button"
            size="xl"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent mt-[16px]"
            @click="
              () => {
                emit('update:modelValue', false)
              }
            "
            >Cancelar</Button
          >
          <Button
            type="submit"
            class="text-[16px] font-[600] mt-[16px]"
            size="xl"
            :disabled="!form.meta.value.valid"
            >Confirmar</Button
          >
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
