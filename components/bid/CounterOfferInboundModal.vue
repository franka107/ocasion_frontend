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
  currentAmount: number
  counterOfferAmount: number
  modelValue: boolean
  refreshTable: () => void
}>()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { counterOfferBid } = useBidAPI()
const formSchema = toTypedSchema(
  z.object({
    counterOfferAmount: z
      .number()
      .gte(1, { message: 'La contraoferta es requerida.' })
      .lte(999999, { message: 'El campo no puede exceder los 6 dígitos.' }),
  }),
)
const emit = defineEmits(['update:modelValue'])
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values: any) => {
  const { counterOfferAmount } = values
  handleSubmit({ id: props.id, counterOfferAmount })
  console.log('counterOfferAmount', counterOfferAmount)
})
const handleSubmit = async (values: any) => {
  openConfirmModal({
    title: 'Enviar Contraoferta de puja',
    message: '¿Estás seguro de que deseas enviar esta contraoferta?',
    callback: async () => {
      const { status, error }: any = await counterOfferBid(values)
      if (status.value === 'success') {
        emit('update:modelValue', false)
        props.refreshTable()
        updateConfirmModal({
          title: 'Contraoferta de puja enviada',
          message: 'La contraoferta ha sido enviada exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'La contraoferta no se pudo enviar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al enviar la contraoferta',
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
            >Contraofertar puja</AlertDialogTitle
          >
        </AlertDialogHeader>
        <div class="grid grid-cols-2 gap-3 px-6">
          <CustomInput
            class="h-14 w-full"
            type="number"
            label="Monto actual"
            :model-value="props.currentAmount"
            :disabled="true"
            label-offset
          />
          <CustomInput
            class="h-14 w-full"
            type="number"
            label="Monto de la contraoferta"
            :model-value="props.counterOfferAmount"
            :disabled="true"
            label-offset
          />
          <!-- <FormField v-slot="{ componentField }" name="counterOfferAmount"> -->
          <!--   <FormItem> -->
          <!--     <FormControl> -->
          <!--       <CustomInput -->
          <!--         class="h-14 w-full" -->
          <!--         type="number" -->
          <!--         label="Monto de contraoferta" -->
          <!--         v-bind="componentField" -->
          <!--         label-offset -->
          <!--       /> -->
          <!--     </FormControl> -->
          <!--     <FormMessage /> -->
          <!--   </FormItem> -->
          <!-- </FormField> -->
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
            variant="destructive"
            size="xl"
            :disabled="!form.meta.value.valid"
            >Rechazar</Button
          >
          <Button
            type="submit"
            class="text-[16px] font-[600] mt-[16px]"
            size="xl"
            :disabled="!form.meta.value.valid"
            >Aceptar</Button
          >
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
