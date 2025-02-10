<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import InputFile from '@/components/common/file/Input.vue'
import { bankType, currencyType, accountType } from '@/constants/attention-tray'
const props = defineProps<{
  id: string | undefined | number
  onAuthorize: (values: any) => void
  onReject: (values: any) => void
}>()

const emit = defineEmits([
  'update:modelValue',
  'open-reject-modal',
  'on-reject',
])
const currentMode = ref<'reject' | 'authorize'>('authorize')
const BASE_ACC_URL = '/finance/account-validation'
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
    destinationAccountNumber: z
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

// const onSubmit = form.handleSubmit((values) => {
//   console.log('Formulario enviado con los valores:', values);
//   emit('update:modelValue', false);
// });

if (props.id) {
  const { data } = await useAPI<any>(
    `${BASE_ACC_URL}/view-account-validation-detail`,
    {
      method: 'GET',
      query: {
        id: props.id,
      },
    } as any,
  )
  const formattedValues = {
    ...data.value,
    accountType: data.value.retireRequest?.accountType,
    destinationCCI: data.value.retireRequest?.destinationCCI,
    amount: data.value.retireRequest.amount,
  }
  form.setValues(formattedValues)
}
const cancelEdit = () => {
  emit('update:modelValue', false)
}
const onSubmit = async (e: any) => {
  e.preventDefault()
  let formattedValues = null
  if (currentMode.value === 'reject') {
    const { valid } = await form.validate()
    if (valid) {
      const {
        amount,
        currency,
        accountType,
        destinationAccountNumber,
        destinationCCI,
      } = form.values
      formattedValues = {
        amount,
        currency,
        accountType,
        destinationAccountNumber,
        destinationCCI,
      }
      props.onReject(formattedValues)
    }
  } else if (currentMode.value === 'authorize') {
    const formattedValues = {
      id: props.id,
    }
    props.onAuthorize(formattedValues)
  }
}
const handleReject = () => {
  props.onReject({ id: props.id, reason: 'Rechazo manual' })
  // emit('on-reject', { id: props.id, reason: 'Rechazo manual' })
}
</script>

<template>
  <SheetHeader class="justify-between">
    <SheetTitle class="ml-2 text-[20px] font-[700] text-[#152A3C]">
      Detalle de cuenta
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
            <FormField v-slot="{ componentField }" name="amount">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomInput
                    v-bind="componentField"
                    type="number"
                    placeholder="0.00"
                    label="Monto"
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
          <!-- Tipo de cuenta -->
          <FormField v-slot="{ componentField }" name="accountType">
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="accountTypeOptions"
                  placeholder="Tipo de cuenta"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Cuenta destino -->
          <FormField
            v-slot="{ componentField }"
            name="destinationAccountNumber"
          >
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Ingrese número"
                  label="Cuenta destino"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Cuenta destino CCI -->
          <FormField v-slot="{ componentField }" name="destinationCCI">
            <FormItem>
              <FormControl>
                <CustomInput
                  v-bind="componentField"
                  type="text"
                  placeholder="Ingrese número"
                  label="Cuenta destino (CCI)"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </section>
      <div
        class="mt-4 flex flex-wrap md:flex-nowrap justify-center gap-y-[10px] gap-x-[16px] w-full"
      >
        <Button
          type="button"
          size="xl"
          class="w-full max-w-[223px] text-[14px] md:text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
          @click="handleReject"
          >Rechazar</Button
        >
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'w-full max-w-[223px] text-[14px] md:text-[16px] font-[600] bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
          size="xl"
          >Aprobar</Button
        >
      </div>
    </form>
  </div>
</template>
