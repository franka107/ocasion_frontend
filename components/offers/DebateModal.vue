<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const props = defineProps<{
  id: string
  name: string
  appraisal: number
  modelValue: boolean
  refreshTable: () => void
}>()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { discussOffer } = useOfferAPI()
const formSchema = toTypedSchema(
  z.object({
    counterProposalAmount: z
      .number()
      .gte(1, { message: 'La contrapropuesta es requerida.' })
      .lte(999999, { message: 'El campo no puede exceder los 6 dígitos.' }),
  }),
)
const emit = defineEmits(['update:modelValue'])
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values: any) => {
  const { counterProposalAmount } = values
  handleSubmit({ offerId: props.id, counterProposalAmount })
  console.log('counterProposalAmount', counterProposalAmount)
})
const handleSubmit = async (values: any) => {
  openConfirmModal({
    title: 'Enviar debate de oferta',
    message: '¿Estás seguro de que deseas enviar este debate de oferta?',
    callback: async () => {
      const { status, error }: any = await discussOffer(values)
      if (status.value === 'success') {
        emit('update:modelValue', false)
        props.refreshTable()
        updateConfirmModal({
          title: 'Debate de oferta enviado',
          message: 'El debate de oferta ha sido enviada exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'La oferta no se pudo enviar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear Oferta',
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
            >Debate de precios</AlertDialogTitle
          >
        </AlertDialogHeader>

        <Alert variant="destructive">
          <ExclamationTriangleIcon class="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
        <div class="grid grid-cols-2 gap-3 px-6">
          <CustomInput
            class="h-14 w-full"
            type="string"
            label="Título de la oferta"
            :model-value="props.name"
            :disabled="true"
            label-offset
          />
          <CustomInput
            class="h-14 w-full"
            type="number"
            label="Tasación"
            :model-value="props.appraisal"
            :disabled="true"
            label-offset
          >
          </CustomInput>
          <FormField v-slot="{ componentField }" name="counterProposalAmount">
            <FormItem>
              <FormControl>
                <CustomInput
                  class="h-14 w-full"
                  type="number"
                  label="Contrapropuesta"
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
