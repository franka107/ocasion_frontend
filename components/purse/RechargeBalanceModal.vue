<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date'
import dayjs from 'dayjs'
import DateInput from '../ui/date-input/DateInput.vue'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import InputFile from '@/components/common/file/Input.vue'

const emit = defineEmits(['update:modelValue'])
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const openUserModal = ref(false)
const props = defineProps<{
  modelValue: boolean
  refreshHistoryTransactionTable: () => void
}>()
const { landingUrl } = useRuntimeConfig().public
const formSchema = toTypedSchema(
  z.object({
    operationNumber: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese numero de operacion válido.'),
    transferedAt: z.string().min(1, 'La fecha de envio es requerida.'),
    amount: z
      .number()
      .min(10, 'El monto debe ser al menos 10.00.')
      .max(1000, 'El monto no puede exceder 1,000.00.'),
    currency: z.string().default('USD'),
    attachedFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(3, 'Puede subir un máximo de 3 archivos'),
    termsAndConditions: z
      .boolean()
      .refine((val) => val === true, 'Debe aceptar los términos y condiciones'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    currency: 'USD',
    transferedAt: dayjs(new Date()).format('YYYY-MM-DD'),
  },
})
const { requestRecharge } = useTopUpRequests()
const onSubmit = form.handleSubmit((values) => {
  openConfirmModal({
    title: 'Solicitud de recarga',
    message: '¿Estás seguro de que deseas realizar una solicitud de recarga?',
    callback: async () => {
      const { status, error }: any = await requestRecharge({
        ...values,
        sustentationFile: values.attachedFiles[0],
        transferedAt: values.transferedAt,
      })
      emit('update:modelValue', false) // Cierra el modal al enviar.
      if (status.value === 'success') {
        openUserModal.value = false
        updateConfirmModal({
          title: 'Solicitud de recarga realizada',
          message: 'La solicitud de recarga ha sido realizada exitosamente',
          type: 'success',
        })
        props.refreshHistoryTransactionTable()
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'No se pudo realizar la solicitud de recarga, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al realizar la solicitud de recarga',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      form.resetForm({
        values: {
          currency: 'USD',
          transferedAt: dayjs(new Date()).format('YYYY-MM-DD'),
        },
      })
    }
  },
)
</script>

<template>
  <AlertDialog
    :open="modelValue"
    class=""
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
            >Recargar saldo</AlertDialogTitle
          >
        </AlertDialogHeader>
        <!-- <p class="text-[18px] font-[600] text-[#152A3C] px-6"> -->
        <!--   Transacción N° 123456 -->
        <!-- </p> -->
        <!-- Formulario -->
        <div class="grid grid-cols-2 gap-4 px-6">
          <!-- N° operación -->
          <FormField v-slot="{ componentField }" name="operationNumber">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Ingrese número"
                  static-label
                  label="N° operación"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Fecha de Transferencia -->
          <FormField v-slot="{ componentField }" name="transferedAt">
            <FormItem>
              <FormControl>
                <DateInput
                  label="Fecha de transferencia"
                  static-label
                  :value="componentField.modelValue"
                  :max-value="
                    parseAbsolute(new Date().toISOString(), getLocalTimeZone())
                  "
                  @update:model-value="componentField.onChange"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Monto -->
          <FormField v-slot="{ componentField }" name="amount">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="number"
                  placeholder="0.00"
                  static-label
                  label="Ingresa monto"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Moneda -->
          <FormField v-slot="{ componentField }" name="currency">
            <FormItem>
              <FormControl>
                <!-- <CustomSelect
                  v-bind="componentField"
                  :disabled="true"
                  :items="[{ id: 'USD', name: 'USD' }]"
                  static-label
                  placeholder="Moneda"
                /> -->
                <CustomInput
                  v-bind="componentField"
                  v-model="form.values.currency"
                  type="text"
                  :disabled="true"
                  static-label
                  value="USD"
                  readonly
                  label="Moneda"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Sustento -->
        <div class="px-6">
          <h2 class="font-[600] text-[14px] text-[#152A3C mb-4">SUSTENTO</h2>
          <FormField
            v-slot="{ componentField }"
            name="attachedFiles"
            class="max-h-[156px]"
          >
            <FormItem>
              <FormControl>
                <InputFile
                  v-model="form.values.attachedFiles"
                  title="Archivos adjuntos"
                  instructions-text="Cargar máximo 3 elementos(xlsx, docx, pdf)"
                  :limit-files="3"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Aviso -->
        <div class="px-6">
          <!-- Aceptación de Terminos y Condiciones -->
          <FormField v-slot="{ componentField }" name="termsAndConditions">
            <FormItem class="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  :checked="componentField.modelValue"
                  v-bind="componentField"
                  @update:checked="componentField.onChange"
                />
                <label
                  class="font-[400] text-[14px] m-[0px] space-y-0 text-[#152A3C]"
                  >Aceptar
                  <a
                    target="_blank"
                    class="font-[600] text-[#F97316] hover:underline"
                    :href="`${landingUrl}/terms-and-conditions`"
                  >
                    terminos y condiciones
                  </a>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="rounded-[8px] bg-[#F3F8FC] p-4 mt-[18px]">
            <h2 class="font-[700] text-[#152A3C] text-[14px]">Aviso</h2>
            <ul
              class="font-[400] text-[12px] text-[#45454F] mt-[12px] space-y-2"
            >
              <li>
                • La cuenta de destino de DeOcasión es
                <b>en Dólares.</b> Cualquier transacción en otro tipo de moneda
                estará sujeto al tipo de cambio del banco de su cuenta.
              </li>
              <li>
                • El número de cuenta de DeOcasión es del banco: BCP:
                123456789012, CCI: 0110123456789012(números de cuenta pendiente
                de definir)
              </li>
              <li>
                • El tiempo de revisión de la solicitud es de 3 días útiles.
              </li>
              <li>
                • La comisión de transferencia estará sujeto a las condiciones
                del banco y serán asumidas por el cliente.
              </li>
            </ul>
          </div>
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
            Recargar saldo
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
