<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import BerlinFormSheet from '~/design-system/berlin/sheets/form/BerlinFormSheet.vue'
import { DocumentType } from '~/models/document-type'
import { UserGender } from '~/models/gender'
import { UserMaritalStatus } from '~/models/marital-status'
import { PersonType } from '~/models/person-type'
import { UserStatus } from '~/models/user'
import { UserType, type UserDto } from '~/types/Administrators'

const props = defineProps<{
  userId: string
  mode: 'create' | 'edit' | 'readonly'
}>()

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  commonName: z.string(),
  documentType: z.nativeEnum(DocumentType),
  documentIdentifier: z.string().max(50),
  phoneNumber: z.string().max(50),
  otp: z.string().max(10).nullable(),
  otpExpiry: z.date().nullable(),
  phoneCountryCode: z.string().max(50),
  type: z.nativeEnum(UserType),
  status: z.nativeEnum(UserStatus),
  personType: z.nativeEnum(PersonType).nullable(),
  gender: z.nativeEnum(UserGender).nullable(),
  maritalStatus: z.nativeEnum(UserMaritalStatus).nullable(),
  birthDate: z.date().nullable(),
  businessName: z.string().nullable(),
  legalRepresentative: z.string().nullable(),
  legalRepresentativeDocumentType: z.nativeEnum(DocumentType).nullable(),
  legalRepresentativeDocumentIdentifier: z.string().max(50).nullable(),
  taxAddress: z.string().nullable(),
  loginAttempts: z.number().nonnegative(),
  lastResetPasswordDelivery: z.date().nullable(),
  passwordUpdatedAt: z.date(),
  passwordExpirationNotifiedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  connectedAt: z.date().nullable(),
  suspensionReason: z.string().max(255).nullable(),
})

export type UserDtoV2 = z.infer<typeof UserSchema>

const userService = useUserService()
const user = ref<UserDtoV2 | null>(null)
const mode = ref(props.mode)
const fieldSchema = toTypedSchema(UserSchema)

const form = useForm({
  validateOnMount: true,
})

watch(
  () => props.userId,
  async (userId) => {
    if (userId) {
      mode.value = 'readonly'
      const response = await userService.viewUserDetailById(userId)
      user.value = response.data.value
      form.setValues(user.value)
    } else {
      mode.value = 'create'
      user.value = null
    }
  },
)

const titleFromMode = computed(() => {
  switch (mode.value) {
    case 'create':
      return 'Crear usuario'
    case 'edit':
      return 'Editar usuario'
    case 'readonly':
      return 'Detalle de usuario'
  }
})
</script>
<template>
  <BerlinFormSheet :title="titleFromMode" :is-open="false" @close="() => {}">
    <template #content> </template>
    <template #footer>
      <div class="w-full flex flex-row gap-2">
        <div class="flex-1">
          <Button
            v-if="mode === 'readonly'"
            class="w-full"
            @click="onSaveButtonPressed"
          >
            Editar
          </Button>
        </div>
        <div class="flex-1">
          <Button
            class="w-full"
            :disabled="mode !== 'readonly'"
            @click="onSaveButtonPressed"
          >
            Guardar
          </Button>
        </div>
        <div class="flex-1">
          <Button
            class="w-full"
            :disabled="mode !== 'readonly'"
            @click="onCancelButtonPressed"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </template>
  </BerlinFormSheet>
</template>
