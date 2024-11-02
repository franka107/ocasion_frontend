<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import Dialog from '~/components/auth/dialogForm.vue'
import NuxtLayout from '~/components/auth/authForm.vue'
import BaseForm from '~/components/auth/baseForm.vue'
import CustomInput from '~/components/ui/custom-input/CustomInput.vue'
import CustomSelect from '~/components/ui/custom-select/CustomSelect.vue'
import messageIcon from '~/assets/icon/png/check-icon.png'
import priorityHigh from '~/assets/icon/png/priority-high.png'
import CheckBox from '~/components/ui/checkbox/Checkbox.vue'

const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { authSignIn } = useAuthManagement()

const isSuccessDialogOpen = ref(false)
const isErrorDialogOpen = ref(false)
const errorDialogMessage = ref('')

const closeSuccessDialog = () => {
  isSuccessDialogOpen.value = false
}

const closeErrorDialog = () => {
  isErrorDialogOpen.value = false
}
const isSubmitting = ref(false)
const registerFormSchema = z.object({
  personType: z.enum(['NATURAL_PERSON', 'JURIDIC_PERSON']),

  firstName: z.string().min(1, 'El nombre es requerido').optional(),
  lastName: z.string().min(1, 'El apellido es requerido').optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED']).optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  birthDate: z.string().nonempty('La fecha de nacimiento es requerida').optional(),

  businessName: z.string().min(1, 'El nombre del negocio es requerido').optional(),
  ruc: z
    .string()
    .regex(/^\d{11}$/, 'El RUC debe contener 11 dígitos')
    .optional(),
  legalRepresentative: z.string().min(1, 'El representante legal es requerido').optional(),
  taxAddress: z.string().min(1, 'El Domicilio Fiscal es requerida').optional(),

  email: z.string().email('Debe ser un correo electrónico válido'),
  phoneNumber: z.string().min(9, 'El número de teléfono debe tener al menos 9 dígitos'),
  representative: z
    .object({
      documentType: z.enum(['DNI', 'CE', 'PT']),
      documentIdentifier: z
        .string()
        .regex(/^\d+$/, 'El documento debe contener solo dígitos.')
        .min(1, 'El documento del representante es requerido'),
    })
    .partial()
    .superRefine((schema, ctx) => {
      if (
        schema.documentType === 'DNI' &&
        schema.documentIdentifier?.length !== 8
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El dni debe contener 8 digitos',
          path: ['documentIdentifier'],
        })
      }
      if (
        schema.documentType !== 'DNI' &&
        schema.documentIdentifier?.length !== 9
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El ${schema.documentType} debe contener 9 digitos`,
          path: ['documentIdentifier'],
        })
      }
    }),
  areConditionsAccepted: z.boolean().refine(val => val === true, 'Debe aceptar los términos y condiciones'),
})

type RegisterForm = z.infer<typeof registerFormSchema>

const formSchema = toTypedSchema(registerFormSchema)
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    representative: {
      documentType: 'DNI',
    },
    gender: 'MALE',
    maritalStatus: 'SINGLE',
    areConditionsAccepted: false,
    personType: 'NATURAL_PERSON',
  },
})

const onSubmit = form.handleSubmit(async (values: RegisterForm) => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const { representative, ...restValues } = values
    const formattedValues = {
      ...restValues,
      documentType: representative.documentType,
      documentIdentifier: representative.documentIdentifier,
    }

    await handleSignIn(formattedValues)
  } finally {
    isSubmitting.value = false
  }
})

const handleSignIn = async (values: any) => {
  const { status, error }: any = await authSignIn(values)
  if (status.value === 'success') {
    isSuccessDialogOpen.value = true
  } else {
    const eMsg =
      error.value.data?.errors?.[0].message ||
      error.value.data.message ||
      'No se puedo continuar con el proceso de registro. \nTe recomendamos intentarlo nuevamente.'
    errorDialogMessage.value = eMsg
    isErrorDialogOpen.value = true
  }
}

const personType = computed(() => form.values.personType);
const showNaturalPersonFields = computed(() => personType.value === 'NATURAL_PERSON');
const showJuridicPersonFields = computed(() => personType.value === 'JURIDIC_PERSON');

</script>

<template>
  <NuxtLayout logo-subtitle="">
    <BaseForm
      class="w-[750px]"
      title="Registro"
      subtitle="Crea tu cuenta y comienza a subastar o pujar."
      submit-text="Crear cuenta"
      submit-class="text-gray-300 bg-[#F1F5F9] hover:bg-[#052339] hover:text-white"
      :is-active="form.meta.value.valid"
      :is-loading="isSubmitting"
      @submit="onSubmit"
    >
      <div class="space-y-4 mt-6">
        <!-- Tipo de Persona -->
        <FormField v-slot="{ componentField }" name="personType">
          <FormItem class="flex gap-2 space-y-0 my-8">
            <FormControl>
              <FormLabel class="font-bold">Selecciona:</FormLabel>
              <RadioGroup class="flex flex-row" v-bind="componentField">
                <FormItem class="flex items-center space-y-0 gap-x-1">
                  <FormControl>
                    <RadioGroupItem value="NATURAL_PERSON" />
                  </FormControl>
                  <FormLabel class="font-normal">Persona Natural</FormLabel>
                </FormItem>
                <FormItem class="flex items-center space-y-0 gap-x-1">
                  <FormControl>
                    <RadioGroupItem value="JURIDIC_PERSON" />
                  </FormControl>
                  <FormLabel class="font-normal">Persona Jurídica</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <template v-if="showNaturalPersonFields">
          <div class="grid grid-cols-2 gap-4">
            <!-- Nombre -->
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem>
                <FormControl>
                  <CustomInput type="text" label="Nombre" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Apellido -->
            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem>
                <FormControl>
                  <CustomInput type="text" label="Apellido" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Estado Civil -->
            <FormField v-slot="{ componentField }" name="maritalStatus">
              <FormItem>
                <FormControl>
                  <CustomSelect
                    :items="[
                      { id: 'SINGLE', name: 'Soltero' },
                      { id: 'MARRIED', name: 'Casado' },
                      { id: 'WIDOWED', name: 'Viudo' },
                      { id: 'DIVORCED', name: 'Divorciado' },
                    ]"
                    placeholder="Estado Civil"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Sexo -->
            <FormField v-slot="{ componentField }" name="gender">
              <FormItem>
                <FormControl>
                  <CustomSelect
                    :items="[
                      { id: 'MALE', name: 'Masculino' },
                      { id: 'FEMALE', name: 'Femenino' },
                    ]"
                    placeholder="Sexo"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Fecha de Nacimiento -->
            <FormField v-slot="{ componentField }" name="birthDate">
              <FormItem>
                <FormControl>
                  <CustomInput type="date" label="Fecha de Nacimiento" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </template>

        <template v-if="showJuridicPersonFields">
          <!-- Razón Social -->
          <FormField v-slot="{ componentField }" name="businessName">
            <FormItem>
              <FormControl>
                <CustomInput type="text" label="Razón Social" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- RUC -->
          <FormField v-slot="{ componentField }" name="ruc">
            <FormItem>
              <FormControl>
                <CustomInput type="text" label="RUC" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Representante Legal -->
          <FormField v-slot="{ componentField }" name="legalRepresentative">
            <FormItem>
              <FormControl>
                <CustomInput type="text" label="Representante Legal" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Dirección Fiscal -->
          <FormField v-slot="{ componentField }" name="taxAddress">
            <FormItem>
              <FormControl>
                <CustomInput type="text" label="Domicilio Fiscal" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </template>


        <div class="grid grid-cols-2 gap-4">

          <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem>
              <FormControl>
                <CustomInput type="tel" label="Número de Teléfono" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormControl>
                <CustomInput type="email" label="Email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Tipo de Documento -->
          <FormField
            v-slot="{ componentField }"
            name="representative.documentType"
          >
            <FormItem>
              <FormControl>
                <CustomSelect
                  v-bind="componentField"
                  :items="[
                    { id: 'DNI', name: 'DNI' },
                    { id: 'CE', name: 'CE' },
                    { id: 'PT', name: 'PT' },
                  ]"
                  placeholder="Tipo de DOI"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Número de Documento -->
          <FormField
            v-slot="{ componentField }"
            name="representative.documentIdentifier"
          >
            <FormItem>
              <FormControl>
                <CustomInput
                  type="text"
                  label="Número de Documento"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Aceptación de Condiciones -->
        <FormField v-slot="{ componentField }" name="areConditionsAccepted">
          <FormItem class="flex items-center gap-2">
            <FormControl>
              <Checkbox
                :checked="componentField.modelValue"
                v-bind="componentField"
                @update:checked="componentField.onChange"
              />
              <label class="text-[14px]"
                >He leído, conozco las condiciones para el tratamiento de mis
                datos personales y doy mi consentimiento, en su caso, tal y como
                se describe en
                <b>Aviso de privacidad y Términos de uso</b></label
              >
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </BaseForm>

    <Dialog
      v-model:open="isSuccessDialogOpen"
      :icon-src="messageIcon"
      icon-alt="Icono de alerta"
      title="Registro exitoso"
      description="Revise su bandeja de entrada para continuar con el proceso de registro"
      button-text="Aceptar"
      icon-bg-color="bg-[#00BB8E]"
      @close="closeSuccessDialog"
      @action="closeSuccessDialog"
    />

    <Dialog
      v-model:open="isErrorDialogOpen"
      :icon-src="priorityHigh"
      icon-alt="Icono de alerta"
      title="Error"
      :description="errorDialogMessage"
      button-text="Aceptar"
      icon-bg-color="bg-[#FBBF24]"
      @close="closeErrorDialog"
      @action="closeErrorDialog"
    />
  </NuxtLayout>
</template>
