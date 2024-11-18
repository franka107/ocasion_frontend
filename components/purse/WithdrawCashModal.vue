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


const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue: boolean }>()
const formSchema = toTypedSchema(
  z.object({
    amount: z
      .number()
      .positive('Debe ser un monto positivo.')
      .lte(999999, 'El monto no puede exceder los 6 dígitos.'),
    currency: z.string().min(1, 'Seleccione una moneda.'),
    bank: z.string().min(1, 'Seleccione un banco.'),
    accountType: z.string().min(1, 'Seleccione un tipo de cuenta.'),
    destinationAccount: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese un número de cuenta válido.'),
    cciAccount: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese un número de cuenta válido.'),
    termsAndConditions: z.boolean().refine(val => val === true, 'Debe aceptar los términos y condiciones'),
  }),
)
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit((values) => {
  console.log('Formulario enviado con los valores:', values)
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
      <form class="flex flex-col gap-6 flex-grow max-h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/50" @submit="onSubmit">
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
        <div class="grid grid-cols-2 gap-2 xl:gap-4 px-6">
          <!-- Monto -->
          <FormField v-slot="{ componentField }" name="amount">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="number"
                  placeholder="0.00"
                  staticLabel
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
                  :items="[ { id: 'USD', name: 'USD' } ]"
                  staticLabel
                  placeholder="Moneda"
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
                  :items="[ { id: 'Bank1', name: 'Banco 1' }, { id: 'Bank2', name: 'Banco 2' } ]"
                  staticLabel
                  placeholder="Banco"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Tipo de cuenta -->
          <FormField v-slot="{ componentField }" name="accountType">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="[ { id: 'Savings', name: 'Ahorros' }, { id: 'Checking', name: 'Corriente' } ]"
                  staticLabel
                  placeholder="Tipo de cuenta"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
           <!-- Cuenta destino -->
           <FormField v-slot="{ componentField }" name="destinationAccount">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Ingrese número"
                  staticLabel
                  label="Cuenta destino"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Cuenta destino CCI -->
          <FormField v-slot="{ componentField }" name="cciAccount">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Ingrese número"
                  staticLabel
                  label="Cuenta destino (CCI)"
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
              <label class="font-[400] text-[14px] m-[0px] space-y-0 text-[#152A3C]"
                >Aceptar <span class="font-[600] text-[#F97316]">terminos y condiciones</span>
              </label
              >
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="rounded-[8px] bg-[#F3F8FC] p-4 mt-[18px]">
          <h2 class="font-[700] text-[#152A3C] text-[14px]">Aviso</h2>
          <ul class="font-[400] text-[12px] text-[#45454F] mt-[12px] space-y-2">
            <li>
              • La cuenta de destino del solicitante debe ser <b>en Dólares.</b> Cualquier transacción en otro tipo de moneda estará sujeto al tipo de cambio del banco de su cuenta.
            </li>
            <li>
              • El tiempo de revisión de la solicitud es de 3 días útiles.
            </li>
            <li>
              • La comisión de transferencia estará sujeto a las condiciones del banco y serán asumidas por el cliente.
            </li>
            <li>
              • En caso se encuentre rechazada la solicitud, no se procederá con el desembolso. Asimismo, tendrá que generar una nueva solicitud.
            </li>
            <li>
              • La cuenta destino debe estar a nombre del titular de la cuenta.
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
