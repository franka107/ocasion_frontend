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
import InputFile from '@/components/common/file/Input.vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue: boolean }>()
const formSchema = toTypedSchema(
  z.object({
    operationNumber: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese numero de operacion válido.'),
    transferedAt: z.string().nonempty('La fecha de transderencia es requerida'),
    amount: z
      .number()
      .positive('Debe ser un monto positivo.')
      .lte(999999, 'El monto no puede exceder los 6 dígitos.'),
    currency: z.string().min(1, 'Seleccione una moneda.'),
    attachedFiles: z
      .array(z.any())
      .min(1, 'Debe subir al menos un archivo')
      .max(3, 'Puede subir un máximo de 3 archivos'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const { requestRecharge } = useTopUpRequests()
const onSubmit = form.handleSubmit((values) => {
  console.log('Formulario enviado con los valores:', values)
  requestRecharge({
    ...values,
    sustentationFile: values.attachedFiles[0],
    transferedAt: new Date(values.transferedAt).toISOString(),
  })
  emit('update:modelValue', false) // Cierra el modal al enviar.
})
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
            >Retirar saldo</AlertDialogTitle
          >
        </AlertDialogHeader>
        <p class="text-[18px] font-[600] text-[#152A3C] px-6">
          Transacción N° 123456
        </p>
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
                <CustomInput
                  static-label
                  type="date"
                  label="Fecha de transferencia"
                  v-bind="componentField"
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
                <CustomSelect
                  v-bind="componentField"
                  :items="[{ id: 'USD', name: 'USD' }]"
                  static-label
                  placeholder="Moneda"
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
                  <span class="font-[600] text-[#F97316]"
                    >terminos y condiciones</span
                  >
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
            Retirar saldo
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  </AlertDialog>
</template>
