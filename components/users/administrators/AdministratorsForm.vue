<script setup lang="ts">
import { ref, watch, defineProps, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { X } from 'lucide-vue-next'
import {
  UserType,
  type IAdminsLItem,
  Organization,
} from '@/types/Administrators'
import { userType } from '~/constants/administrators'

import CustomSelect from '~/components/ui/custom-select/CustomSelect.vue'
import CustomComboboxInput from '~/components/ui/custom-combobox-input/CustomComboboxInput.vue'

const BASE_ADM_URL = '/user-management'
const BASE_ORG_URL = '/organization-management'
const BASE_ROLE_URL = '/role-configuration'

const props = defineProps<{
  id: number | undefined
  onSubmit: (values: any) => void
}>()

const { getUser } = useAdmins()

// const userTypesOptions = Array.from(userType)
//   .map(([id, name]) => ({
//     id,
//     name,
//   }))
//   .filter((item) => item.id !== UserType.SuperAdmin)

const { data: userTypesOptions } = await useAPI<any[]>(
  `${BASE_ADM_URL}/get-user-types`,
  {} as any,
)

// Form schema
const administratorFormSchema = z
  .object({
    firstName: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido es requerido'),
    documentType: z.enum(['DNI', 'CE', 'PT']),
    documentIdentifier: z
      .string()
      .regex(/^\d+$/, 'El documento debe contener solo dígitos.')
      .min(1, `El documento del representante es requerido`),
    phoneNumber: z
      .string()
      .max(10, 'No puede superar los 10 digitos')
      .regex(/^\d+$/, 'El número de teléfono debe contener solo dígitos.')
      .optional()
      .nullable(),
    email: z
      .string()
      .email('El correo electrónico no es válido')
      .optional()
      .nullable(),
    type: z.string().min(1, 'Tipo de usuario es requerido'),
    organizations: z
      .union([
        z.array(z.string()).min(1, 'La organización es requerida'),
        z.string().min(1, 'La organización es requerida'),
      ])
      .optional()
      .nullable(), // Esto permite que organizations sea nullable

    roles: z.array(z.string()).min(1, 'El rol de usuario es requerido'),
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

    const requiredFields = [
      'firstName',
      'lastName',
      'documentType',
      'documentIdentifier',
      'phoneNumber',
      'type',
      'roles',
    ]
    requiredFields.forEach((field) => {
      if (!schema[field]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El campo ${field} es requerido.`,
          path: [field],
        })
      }
    })
    if (
      schema.type !== UserType.PlatformAdmin &&
      (!schema.organizations || schema.organizations.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La organización es requerida.',
        path: ['organizations'],
      })
    }
  })

const formSchema = toTypedSchema(administratorFormSchema)

interface AdministratorsForm
  extends Omit<IAdminsLItem, 'organizations' | 'roles'> {
  organizations?: string[]
  roles?: string[]
}

const organizations = ref<Array<Organization>>([])
const roles = ref<Array<{ id: string; name: string }>>([])
const rolesFiltered = computed(() =>
  roles.value.filter((role) => role.id !== 'SUPER_ADMIN'),
)

const userSession = useUserSession()
const loggedUserType = userSession.user.value?.user.type

const type =
  loggedUserType &&
  [UserType.SuperAdmin, UserType.PlatformUser, UserType.PlatformAdmin].includes(
    loggedUserType,
  )
    ? 'platform'
    : 'organization'

// Function to fetch organizations and roles
const fetchData = async (
  url: string,
  target: typeof organizations | typeof roles,
) => {
  try {
    const filters: FilterOption[] = []
    if (type === 'platform') {
      filters.push({ value: '', type: 'not', field: 'type' })
    }
    const { data } = await useAPI(url, { default: () => [] })
    target.value = data.value
  } catch (error) {
    console.error(`Error al cargar datos de ${url}:`, error)
  }
}

// Fetch organizations and roles

await fetchData(`${BASE_ROLE_URL}/find-roles`, roles)

const form = useForm({
  validationSchema: formSchema,
  initialValues: props.id
    ? await getUser(props.id).then(({ data: userData }) => {
        const organizationsFormatted = userData.value.organizations.map(
          (item: any) => item.id,
        )
        const rolesFormatted = userData.value.roles?.map((item: any) => item.id)
        return {
          ...userData.value,
          organizations: organizationsFormatted,
          roles: rolesFormatted,
        }
      })
    : undefined,
})

if (type === 'platform') {
  await Promise.all([
    fetchData(`${BASE_ORG_URL}/find-organizations`, organizations),
  ])
} else {
  const availableOrganizations = userSession.user.value?.user.organizations
  if (availableOrganizations) {
    organizations.value = availableOrganizations
    form.setFieldValue('organizations', availableOrganizations[0].id) // Set the role automatically
  }
}
// Computed property to determine if the organizations should be single-select
const isOrgSimpleSelect = computed(() =>
  ['ORGANIZATION_ADMIN', 'ORGANIZATION_USER'].includes(form.values.type),
)

const formattedOrganizations = computed(() => {
  return organizations.value.map((org) => ({
    value: org.id,
    label: org.name,
  }))
})

watch(form.values, (newValues) => {
  console.log('Form values:', newValues)
})

// Watcher to auto-select the role when the user type changes
watch(
  () => form.values.type,
  (newType) => {
    if (newType) {
      const matchingRole = roles.value.find((role) => role.id === newType)
      if (matchingRole) {
        form.setFieldValue('roles', [matchingRole.id]) // Set the role automatically
      }
    }
  },
)

// Submit handler
const onSubmit = form.handleSubmit((values: any) => {
  const { organizations, roles, ...restValues } = values
  const formattedValues = {
    ...restValues,
    organizations: Array.isArray(organizations)
      ? organizations.map((orgId: string) => ({ id: orgId }))
      : organizations
        ? [{ id: organizations }]
        : [],
    roles: roles.map((roleId: string) => ({ id: roleId })),
  }

  if (props.id) {
    formattedValues.id = props.id
  }

  props.onSubmit(formattedValues)
})
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]">{{
      props.id ? 'Actualizar datos de usuario' : 'Crear usuario'
    }}</SheetTitle>
  </SheetHeader>
  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- <Form> -->
    <form class="flex flex-col gap-4 flex-grow p-5" @submit="onSubmit">
      <div class="flex gap-2">
        <!-- Nombre  -->
        <FormField v-slot="{ componentField }" name="firstName">
          <FormItem class="w-1/2">
            <FormControl>
              <CustomInput
                type="text"
                label="Nombres"
                v-bind="componentField"
                :disabled="!!props.id"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Apellido-->
        <FormField v-slot="{ componentField }" name="lastName">
          <FormItem class="w-1/2">
            <FormControl>
              <CustomInput
                type="text"
                label="Apellidos"
                v-bind="componentField"
                :disabled="!!props.id"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

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
                ]"
                placeholder="Tipo de Documento"
                :disabled="!!props.id"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <!-- Número de Documento -->
        <FormField v-slot="{ componentField }" name="documentIdentifier">
          <FormItem class="w-1/2">
            <FormControl>
              <CustomInput
                type="text"
                label="N° documento"
                v-bind="componentField"
                :disabled="!!props.id"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <!-- Teléfono -->
      <FormField v-slot="{ componentField }" name="phoneNumber">
        <FormItem>
          <FormControl>
            <CustomInput
              type="text"
              label="Número de celular"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Correo de Facturación -->
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormControl>
            <CustomInput type="email" label="Correo" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Tipo de Usuario -->
      <FormField v-slot="{ componentField }" name="type">
        <FormItem>
          <FormControl>
            <CustomSelect
              v-bind="componentField"
              :disabled="
                [UserType.PlatformAdmin, UserType.OrganizationAdmin].includes(
                  loggedUserType,
                )
              "
              :items="
                userTypesOptions.filter(
                  (userType) => userType.id != 'SUPER_ADMIN',
                )
              "
              placeholder="Tipo de Usuario"
              @update:model-value="
                form.setFieldValue(
                  'organizations',
                  isOrgSimpleSelect ? '' : organizations.map((org) => org.id),
                )
              "
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <!-- Organización -->
      <!-- v-if="form.values.type !== UserType.PlatformAdmin" -->
      <FormField v-slot="{ componentField }" name="organizations">
        <FormItem>
          <FormControl class="w-full">
            <CustomComboboxInput
              :label="isOrgSimpleSelect ? 'Organización' : 'Organizaciones'"
              class="w-full truncate"
              :options="formattedOrganizations"
              :multiple="!isOrgSimpleSelect"
              :value="componentField.modelValue"
              @update:model-value="componentField.onChange"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <!-- <FormField -->
      <!--   v-if="type === 'platform'" -->
      <!--   v-slot="{ componentField }" -->
      <!--   name="organizations" -->
      <!-- > -->
      <!--   <FormItem> -->
      <!--     <FormControl> -->
      <!--       <CustomSelect -->
      <!--         v-bind="componentField" -->
      <!--         :multiple="!isOrgSimpleSelect" -->
      <!--         :items="formattedOrganizations" -->
      <!--         placeholder="Organización" -->
      <!--       /> -->
      <!--     </FormControl> -->
      <!--     <FormMessage /> -->
      <!--   </FormItem> -->
      <!-- </FormField> -->
      <!-- Rol Usuario -->
      <FormField v-slot="{ componentField }" name="roles">
        <FormItem>
          <FormControl>
            <CustomSelect
              v-bind="componentField"
              multiple
              :items="rolesFiltered"
              :disabled="
                [UserType.PlatformAdmin, UserType.OrganizationAdmin].includes(
                  form.values.type,
                )
              "
              placeholder="Rol Usuario"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <!-- Botón de Submit -->
      <SheetFooter class="mt-auto">
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'w-full h-10 text-base bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
        >
          {{ props.id ? 'Actualizar datos' : 'Crear usuario' }}
        </Button>
      </SheetFooter>
    </form>
  </div>
</template>
