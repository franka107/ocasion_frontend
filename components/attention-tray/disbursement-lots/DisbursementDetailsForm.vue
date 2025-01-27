<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import {
  bankType,
  currencyType,
  accountType,
  paymentMethodType,
} from '@/constants/attention-tray'
const props = defineProps<{
  id: string | undefined | number
  onSubmit: (values: any) => void
}>()
const BASE_DIS_URL = '/finance/disbursement-management'
const emit = defineEmits(['update:modelValue'])

const banksOptions = Array.from(bankType).map(([id, name]) => ({
  id,
  name,
}))
const currencyOptions = Array.from(currencyType).map(([id, name]) => ({
  id,
  name,
}))

const accountTypeOptions = Array.from(accountType).map(([id, name]) => ({
  id,
  name,
}))

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
    destinationCCI: z
      .string()
      .regex(/^\d{10,20}$/, 'Ingrese un número de cuenta válido.'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {},
})

const paymentMethodOptions = Array.from(paymentMethodType).map(
  ([id, name]) => ({
    id,
    name,
  }),
)

const onSubmit = form.handleSubmit((values) => {
  console.log('Formulario enviado con los valores:', values)
  emit('update:modelValue', false)
})
if (props.id) {
  const { data } = await useAPI<any>(
    `${BASE_DIS_URL}/view-disbursement-lot-detail`,
    {
      method: 'GET',
      query: {
        id: props.id,
      },
    } as any,
  )
  console.log(data.value)
  form.setValues(data.value)
}
const cancelEdit = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <SheetHeader class="justify-between">
    <SheetTitle class="ml-2 text-[20px] font-[700] text-[#152A3C]">
      Detalle
    </SheetTitle>
    <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form
      class="flex flex-col gap-6 flex-grow pb-[32px] pt-[40px] px-6 gap-y-[24px]"
      @submit="onSubmit"
    >
      <section class="flex-grow">
        <div class="grid grid-cols-1 gap-4 mb-[24px]">
          <div class="flex gap-2">
            <!-- Monto -->
            <FormField v-slot="{ componentField }" name="chargeAccount">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomInput
                    v-bind="componentField"
                    type="number"
                    placeholder="0.00"
                    label="Cuenta cargo"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Moneda -->
            <FormField v-slot="{ componentField }" name="currency">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomSelect
                    v-bind="componentField"
                    :items="currencyOptions"
                    placeholder="Moneda"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- Banco -->
          <FormField v-slot="{ componentField }" name="bank">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="banksOptions"
                  placeholder="Banco"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="paymentMethod">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="paymentMethodOptions"
                  disabled
                  placeholder="Forma de pago"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="totalAmount">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="number"
                  placeholder="0.00"
                  label="Monto total"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- <FormField v-slot="{ componentField }" name="chargeAccount"> -->
          <!--   <FormItem> -->
          <!--     <FormControl> -->
          <!--       <CustomInput -->
          <!--         v-bind="componentField" -->
          <!--         label="Cuenta cargo" -->
          <!--         disabled -->
          <!--       /> -->
          <!--     </FormControl> -->
          <!--     <FormMessage /> -->
          <!--   </FormItem> -->
          <!-- </FormField> -->

          <!-- Tipo de cuenta -->
          <!-- <FormField v-slot="{ componentField }" name="accountType"> -->
          <!--   <FormItem> -->
          <!--     <FormControl> -->
          <!--       <CustomSelect -->
          <!--         v-bind="componentField" -->
          <!--         :items="accountTypeOptions" -->
          <!--         placeholder="Tipo de cuenta" -->
          <!--         disabled -->
          <!--       /> -->
          <!--     </FormControl> -->
          <!--     <FormMessage /> -->
          <!--   </FormItem> -->
          <!-- </FormField> -->
          <!-- Cuenta destino -->
          <!-- <FormField v-slot="{ componentField }" name="destinationAccount"> -->
          <!--   <FormItem> -->
          <!--     <FormControl> -->
          <!--       <CustomInput -->
          <!--         v-bind="componentField" -->
          <!--         type="text" -->
          <!--         placeholder="Ingrese número" -->
          <!--         label="Cuenta destino" -->
          <!--         disabled -->
          <!--       /> -->
          <!--     </FormControl> -->
          <!--     <FormMessage /> -->
          <!--   </FormItem> -->
          <!-- </FormField> -->
          <!-- Cuenta destino CCI -->
          <!-- <FormField v-slot="{ componentField }" name="destinationCCI"> -->
          <!--   <FormItem> -->
          <!--     <FormControl> -->
          <!--       <CustomInput -->
          <!--         v-bind="componentField" -->
          <!--         type="text" -->
          <!--         placeholder="Ingrese número" -->
          <!--         label="Cuenta destino (CCI)" -->
          <!--         disabled -->
          <!--       /> -->
          <!--     </FormControl> -->
          <!--     <FormMessage /> -->
          <!--   </FormItem> -->
          <!-- </FormField> -->
        </div>
      </section>
    </form>
  </div>
</template>
