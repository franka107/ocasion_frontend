<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { UserItem } from '@/types/Profile'
import * as z from 'zod'
const props = defineProps<{
  userDetail: UserItem
  onEdit: (values: any) => void;
}>()
const isEditing = ref(false)
const getInitialValues = () => ({
  documentType: props.userDetail.documentType as 'DNI' | 'CE' | 'PT' || '',
  documentIdentifier: props.userDetail.documentIdentifier || '',
  firstName: props.userDetail.firstName || '',
  lastName: props.userDetail.lastName || '',
  gender: props.userDetail.gender as 'MALE'|'FEMALE' || '',
  maritalStatus: props.userDetail.maritalStatus as 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'DIVORCED' || '',
  birthDate: props.userDetail.birthDate || '',
  phoneNumber: props.userDetail.phoneNumber || '',
  email: props.userDetail.email || '',
});
const formSchema = toTypedSchema(
  z.object({
    documentType: z.enum(['DNI', 'CE', 'PT']),
    documentIdentifier: z
      .string()
      .regex(/^\d+$/, 'El documento debe contener solo dígitos.')
      .min(1, 'El documento del representante es requerido'),
    firstName: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido paterno es requerido'),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    maritalStatus: z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED']).optional(),
    birthDate: z.string().nonempty('La fecha de nacimiento es requerida').optional(),
    phoneNumber: z
      .string()
      .regex(/^\d+$/, 'El número de teléfono debe contener solo dígitos.')
      .min(9, 'El número de teléfono debe tener al menos 9 dígitos'),
    email: z.string().email('El correo electrónico no es válido').optional().nullable(),
  })
)
const form = useForm({
  validationSchema: formSchema,
  initialValues: getInitialValues()
})
if (props.userDetail) {
  form.setValues(getInitialValues());
}

const onSubmit = form.handleSubmit(async (values: any) => {
  const formattedValues = {
    ...values,
  }
  props.onEdit(formattedValues)
})
const startEditing = () => {
  isEditing.value = true
}
const cancelEdit = () => {
  isEditing.value = false;
  form.resetForm({ values: getInitialValues() });
};
const calculateAge = (birthDate: string) => {
  if (!birthDate) return '00';
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
};
</script>

<template>
  <div class="flex flex-row justify-between pt-[24px] pb-[26px] px-[24px] rounded-xl bg-white w-full">
    <div>
      <h1 class="text-[20px] font-[700] leading-[28px] text-primary mb-[16px] leading-[8px]">
        {{ userDetail.commonName }}
       </h1>
      <div class="flex item-center">
        <CustomIcons name="person-pin" class="w-6 h-6" />
        <p class="text-[14px] text-[#20445E] font-[700]">Usuario <span class="text-[#68686C] font-[500]">{{
          userDetail.email }}</span></p>
      </div>
    </div>
    <div class="h 10 w 10">
      <Button variant="default" @click="startEditing">
        Editar
      </Button>
    </div>
  </div>
  <div class="w-full mt-4 ">
    <div
      class="flex flex-wrap flex-col md:flex-nowrap gap-x-[32px] w-[100%] bg-white rounded-xl pt-[24px] pb-[32px] px-6 ">
      <h1 class=" text-[20px] font-[700] leading-[28px] text-primary border-b-[1px] pb-[31.5px] border-[#E2E8F0]">
        Datos del Perfil</h1>
      <form @submit="onSubmit">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 text-[#0F172A] text-[14px] pt-[24px]">
          <div class="flex gap-2">
            <!-- Tipo de Documento -->
            <FormField v-slot="{ componentField }" name="documentType">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomSelect v-bind="componentField" label="Tipo de Movimiento" :items="[
                    { id: 'DNI', name: 'DNI' },
                    { id: 'CE', name: 'CE' },
                    { id: 'PT', name: 'PT' },
                  ]"staticLabel placeholder="Tipo de Documento" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Número de Documento -->
            <FormField v-slot="{ componentField }" name="documentIdentifier">
              <FormItem class="w-full">
                <FormControl>
                  <CustomInput staticLabel type="text" label="N° documento" v-bind="componentField" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- Nombre  -->
          <FormField v-slot="{ componentField }" name="firstName">
            <FormItem>
              <FormControl>
                <CustomInput staticLabel type="text" label="Nombres" v-bind="componentField" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Apellido paterno  -->
          <FormField v-slot="{ componentField }" name="lastName">
            <FormItem>
              <FormControl>
                <CustomInput staticLabel type="text" label="Apellidos" v-bind="componentField" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div></div>

          <div class="flex gap-2">
            <!-- Sexo -->
            <FormField v-slot="{ componentField }" name="gender">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomSelect :items="[
                    { id: 'MALE', name: 'Masculino' },
                    { id: 'FEMALE', name: 'Femenino' },
                  ]"staticLabel placeholder="Sexo" v-bind="componentField" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Estado Civil -->
            <FormField v-slot="{ componentField }" name="maritalStatus">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomSelect :items="[
                    { id: 'SINGLE', name: 'Soltero' },
                    { id: 'MARRIED', name: 'Casado' },
                    { id: 'WIDOWED', name: 'Viudo' },
                    { id: 'DIVORCED', name: 'Divorciado' },
                  ]"staticLabel placeholder="Estado Civil" v-bind="componentField" :disabled="!isEditing" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="flex items-end gap-2">
            <!-- Fecha de Nacimiento -->
            <FormField v-slot="{ componentField }" name="birthDate">
              <FormItem class="w-1/2">
                <FormControl>
                  <CustomInput staticLabel type="date" label="Fecha de Nacimiento" v-bind="componentField" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <span class="mb-[8px] text-sm text-gray-500">EDAD:{{ calculateAge(form.values.birthDate || '') }}
              años</span>
          </div>
          <FormField v-slot="{ componentField }" name="phoneNumber">
            <FormItem>
              <FormControl>
                <CustomInput staticLabel type="tel" label="Número de Teléfono" v-bind="componentField" :disabled="!isEditing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormControl>
                <CustomInput staticLabel type="email" label="Correo" v-bind="componentField" :disabled="!isEditing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div v-if="isEditing"
          class="mt-4 px-6 flex flex-wrap md:flex-nowrap justify-center gap-y-[10px] gap-x-[10px] w-full">
          <Button @click.prevent="cancelEdit" type="button" size="xl"
            class="text-[14px] md:text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent">Cancelar</Button>
          <Button type="submit" :disabled="!form.meta.value.valid" :class="cn(
            'text-[14px] md:text-[16px] font-[600] bg-[#062339] hover:bg-gray-700',
            !form.meta.value.valid
              ? 'text-white'
              : 'hover:text-primary hover:bg-bgtheme',
          )
            " size="xl">Confirmar</Button>
        </div>
      </form>
    </div>
  </div>
</template>
