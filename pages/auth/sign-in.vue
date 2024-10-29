<script setup lang="ts">
import { ref, watch, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import NuxtLayout from '~/components/auth/authForm.vue'
import BaseForm from '~/components/auth/baseForm.vue'
import CustomInput from '~/components/ui/custom-input/CustomInput.vue'
import CustomSelect from '~/components/ui/custom-select/CustomSelect.vue'
import CheckBox from '~/components/ui/checkbox/Checkbox.vue'

const { openConfirmModal, updateConfirmModal } = useConfirmModal()

const {
  authSignIn
} = useAuthManagement()

const openModal = ref(false)

let form: any

const registerFormSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  representative: z.object({
      documentType: z.enum(['DNI', 'CE', 'PT']),
      documentIdentifier: z
        .string()
        .regex(/^\d+$/, 'El documento debe contener solo dígitos.')
        .min(1, `El documento del representante es requerido`),
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
      return true
    }),
  gender: z.enum(['MALE', 'FEMALE']),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED']),
  email: z.string().email('Debe ser un correo electrónico válido'),
  birthDate: z.string().nonempty('La fecha de nacimiento es requerida'),
  phoneNumber: z.string().min(9, 'El número de teléfono debe tener al menos 10 dígitos'),
  areConditionsAccepted: z.boolean().refine(val => val === true, 'Debe aceptar los términos y condiciones'),
  personType: z.enum(['NATURAL_PERSON', 'JURIDIC_PERSON']),
});

type RegisterForm = z.infer<typeof registerFormSchema>

const formSchema = toTypedSchema(registerFormSchema)
  form = useForm({
    validationSchema: formSchema,
    initialValues: {
      gender: 'MALE',
      maritalStatus: 'SINGLE',
      areConditionsAccepted: false,
      personType: 'NATURAL_PERSON',
  },
  })

  watch(form.values, (newValues) => {
  console.log('Form values:', newValues)
  console.log('Attached Files:', newValues.attachedFiles) // Revisa este log
})
const onSubmit = form.handleSubmit((values: RegisterForm) => {
  const {  ...restValues } = values
  const formattedValues = {
    ...restValues,
    documentType: restValues.representative.documentType,
    documentIdentifier:
      restValues.representative.documentIdentifier,
  }
  handleCreate(formattedValues);
});


const handleCreate = async (values: any) => {
  openConfirmModal({
    title: 'Crear organización',
    message: '¿Estás seguro de que deseas crear esta organización?',
    callback: async () => {
      const { status, error }: any = await authSignIn(values)
      if (status.value === 'success') {
        openModal.value = false
        updateConfirmModal({
          title: 'Registrado',
          message: 'El registro se realizó exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El registro no se pudo crear, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al registrarse',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
<template>
  <NuxtLayout logo-subtitle="">
    <BaseForm
      class="w-[700px]"
      title="Registro"
      subtitle="Crea tu cuenta y comienza a subastar o pujar."
      submit-text="Continuar"
      submit-class="text-gray-300 bg-[#F1F5F9] hover:bg-[#052339] hover:text-white bg-red-500"
      @submit="onSubmit"
    >
      <div class="space-y-4 mt-6">

        <!-- Tipo de Persona -->
        <FormField v-slot="{ componentField }" name="personType">
          <FormItem>
            <FormControl>
              <!-- <CheckBox
                :items="[
                  { id: 'NATURAL_PERSON', name: 'Persona Natural' },
                  { id: 'JURIDIC_PERSON', name: 'Persona Jurídica' }
                ]"
                placeholder="Tipo de Persona"
                v-bind="componentField"
              /> -->
              <CheckBox
              v-model="componentField.modelValue"
            />
            <label>Acepto los términos y condiciones</label>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Nombre -->
        <FormField v-slot="{ componentField }" name="firstName">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Nombre"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Apellido -->
        <FormField v-slot="{ componentField }" name="lastName">
          <FormItem>
            <FormControl>
              <CustomInput
                type="text"
                label="Apellido"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Tipo de Documento -->
        <FormField v-slot="{ componentField }" name="representative.documentType">
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
        <FormField v-slot="{ componentField }" name="representative.documentNumber">
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

        <!-- Género -->
        <FormField v-slot="{ componentField }" name="gender">
          <FormItem>
            <FormControl>
              <CustomSelect
                :items="[
                  { id: 'MALE', name: 'Masculino' },
                  { id: 'FEMALE', name: 'Femenino' }
                ]"
                placeholder="Sexo"
                v-bind="componentField"
              />
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
                  { id: 'DIVORCED', name: 'Divorciado' }
                ]"
                placeholder="Estado Civil"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Email -->
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormControl>
              <CustomInput
                type="email"
                label="Email"
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
              <CustomInput
                type="date"
                label="Fecha de Nacimiento"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Número de Teléfono -->
        <FormField v-slot="{ componentField }" name="phoneNumber">
          <FormItem>
            <FormControl>
              <CustomInput
                type="tel"
                label="Número de Teléfono"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Aceptación de Condiciones -->
        <FormField v-slot="{ componentField }" name="areConditionsAccepted">
          <FormItem>
            <FormControl>
              <Checkbox
                :checked="componentField.modelValue"
                @update:checked="componentField.onChange"
              />
              <label>Acepto los términos y condiciones</label>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

      </div>
    </BaseForm>
  </NuxtLayout>
</template>
