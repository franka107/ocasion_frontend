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
import { useDisbursement } from '@/composables/useDisbursement'
import {
  bankType,
  paymentMethodType,
  currencyType,
  paymentMediumType,
} from '@/constants/attention-tray'
const { generatelPreviewDisbursement, generatelDisbursement } =
  useDisbursement()
const emit = defineEmits(['update:modelValue'])
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const props = defineProps<{
  id?: string
  modelValue: boolean
  bank: string
  onSubmit: (values: any) => void
  refreshTable: () => void
}>()
const resumenMensaje = `
    **Cod lote:** 0000
    **N° solicitudes:** 00
    **Suma de monto a desembolsar:** 0.00
    **Banco de origen:** BBVA
    **Cuenta de origen:** 0000 0000 0000 0000
`
const paymentMethodOptions = Array.from(paymentMethodType).map(
  ([id, name]) => ({
    id,
    name,
  }),
)

const banksOptions = Array.from(bankType).map(([id, name]) => ({
  id,
  name,
}))

const currencyOptions = Array.from(currencyType).map(([id, name]) => ({
  id,
  name,
}))

const paymentMediumOptions = Array.from(paymentMediumType).map(
  ([id, name]) => ({
    id,
    name,
  }),
)

const formSchema = toTypedSchema(
  z.object({
    paymentMethod: z.string().min(1, 'Seleccione una forma de pago.'),
    bank: z.string().min(1, 'Seleccione un banco'),
    currency: z.string().min(1, 'Seleccione una moneda.'),
    chargeAccount: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese un número de cuenta válido.'),
    paymentMedium: z.string().min(1, 'Seleccione un medio de pago.'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values) => {
  const { paymentMethod, bank, currency, chargeAccount, paymentMedium } = values
  console.log('Formulario enviado con los valores:', values)
  handleSubmit({
    id: props.id,
    paymentMethod,
    bank,
    currency,
    chargeAccount,
    paymentMedium,
  })
  emit('update:modelValue', false)
})
const handleSubmit = async (values: any) => {
  openConfirmModal({
    title: 'Resumen del desembolso',
    message: `
      ¿Está seguro de generar el lote del desembolso?
    `,
    // ${values.resumenMensaje}
    callback: async () => {
      const { status, error }: any = await generatelPreviewDisbursement(values)
      if (status.value === 'success') {
        emit('update:modelValue', false)
        props.refreshTable()
        updateConfirmModal({
          title: 'Desembolso generado',
          message: 'El desembolso ha sido generado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El desembolso no se pudo generar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al generar desembolso',
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
    <AlertDialogContent class="z-[98] h-auto max-w-[670px] px-0">
      <form
        class="flex flex-col gap-6 flex-grow max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/50"
        @submit="onSubmit"
      >
        <!-- Título -->
        <AlertDialogHeader class="border-b border-primary">
          <AlertDialogTitle
            class="text-xl tracking-[-0.5px] text-primary text-start font-[600] px-6 pb-[18px]"
            >Generar lote de desembolso</AlertDialogTitle
          >
        </AlertDialogHeader>
        <div class="grid grid-cols-2 gap-2 xl:gap-4 px-6">
          <!-- Forma de pago -->
          <FormField v-slot="{ componentField }" name="paymentMethod">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="paymentMethodOptions"
                  placeholder="Forma de pago"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Banco -->
          <FormField v-slot="{ componentField }" name="bank">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="banksOptions"
                  placeholder="Banco"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Moneda -->
          <FormField v-slot="{ componentField }" name="currency">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="currencyOptions"
                  placeholder="Moneda"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Cuenta cargo -->
          <FormField v-slot="{ componentField }" name="chargeAccount">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  label="Cuenta cargo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Medio de pago -->
          <FormField v-slot="{ componentField }" name="paymentMedium">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="paymentMediumOptions"
                  placeholder="Medio de pago"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Botones -->
        <AlertDialogFooter class="px-6">
          <Button
            type="button"
            size="xl"
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent mt-[16px]"
            @click="emit('update:modelValue', false)"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="xl"
            class="text-[16px] font-[600] mt-[16px]"
            :disabled="!form.meta.value.valid"
          >
            Generar
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
