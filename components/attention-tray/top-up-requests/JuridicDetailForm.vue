<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'

const props = defineProps<{
  participantId: string | number | undefined
}>()

const emit = defineEmits(['update:modelValue'])

const formSchema = toTypedSchema(
  z.object({
    businessName: z
      .string()
      .min(1, 'El nombre del negocio es requerido')
      .optional(),
    ruc: z
      .string()
      .regex(/^\d{11}$/, 'El RUC debe contener 11 dígitos')
      .optional(),
    legalRepresentative: z
      .string()
      .min(1, 'El representante legal es requerido')
      .optional(),
    billingEmail: z
      .string()
      .email('Debe ser un correo electrónico')
      .optional()
      .nullable(),
    documentType: z.enum(['DNI', 'CE', 'PT']),
    documentIdentifier: z
      .string()
      .regex(/^\d+$/, 'El documento debe contener solo dígitos.')
      .min(1, `El documento del representante es requerido`),
    taxAddress: z
      .string()
      .min(1, 'El Domicilio Fiscal es requerida')
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^\d+$/, 'El número de teléfono debe contener solo dígitos.')
      .min(9, 'El número de teléfono debe tener al menos 9 dígitos'),
    email: z.string().email('Debe ser un correo electrónico válido'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {},
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Formulario enviado con los valores:', values)
  emit('update:modelValue', false)
})

if (props.participantId) {
  const { data } = await useAPI<any>(`/user-management/get-user-detail`, {
    method: 'GET',
    query: {
      id: props.participantId,
    },
  } as any)
  console.log(data.value)
  form.setValues(data.value)
}
</script>

<template>
  <SheetHeader class="justify-between">
    <SheetTitle class="ml-2 text-[20px] font-[700] text-[#152A3C]">
      Detalle participante persona jurídica
    </SheetTitle>
    <SheetClose class="rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
  </SheetHeader>

  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <form
      class="flex flex-col gap-6 flex-grow pb-[32px] pt-[40px] px-6 gap-y-[24px]"
    >
      <section class="flex-grow">
        <div class="grid grid-cols-1 gap-4 mb-[24px]">
          <!-- Razón Social -->
          <FormField v-slot="{ componentField }" name="businessName">
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  label="Razón Social"
                  v-bind="componentField"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- RUC -->
          <FormField v-slot="{ componentField }" name="ruc">
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  label="RUC"
                  v-bind="componentField"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Representante Legal -->
          <FormField v-slot="{ componentField }" name="legalRepresentative">
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  label="Representante Legal"
                  v-bind="componentField"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="flex gap-2">
            <!-- Tipo de Documento -->
            <FormField v-slot="{ componentField }" name="documentType">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomSelect
                    v-bind="componentField"
                    :items="[
                      { id: 'DNI', name: 'DNI' },
                      { id: 'CE', name: 'CE' },
                      { id: 'PT', name: 'PT' },
                      { id: 'RUC', name: 'RUC' },
                    ]"
                    placeholder="Tipo de DOI"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Número de Documento -->
            <FormField v-slot="{ componentField }" name="documentIdentifier">
              <FormItem class="w-full">
                <FormControl>
                  <CustomInput
                    type="text"
                    label="Número de Documento"
                    v-bind="componentField"
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- Dirección Fiscal -->
          <FormField v-slot="{ componentField }" name="taxAddress">
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  label="Domicilio Fiscal"
                  v-bind="componentField"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem>
              <FormControl>
                <CustomInput
                  type="tel"
                  label="Número de Teléfono"
                  v-bind="componentField"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  label="Email"
                  v-bind="componentField"
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </section>
    </form>
  </div>
</template>
