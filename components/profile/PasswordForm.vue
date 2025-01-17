<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { UserItem } from '@/types/Profile'
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const props = defineProps<{
  userDetail: UserItem
  onPassword: (values: any) => void
  onRestore: (email: string) => void
}>()
const BASE_USER_URL = '/auth-management'

const { data: userDetail, refresh }: any = await useAPI<any>(
  `${BASE_USER_URL}/get-my-info`,
  {
    query: {},
    default: () => ({}),
  },
)
const { clear, user } = useUserSession()
const router = useRouter()

// console.log('USER',userDetail)
const isChange = ref(false)
const formSchema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
      newPassword: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[a-z]/, {
          message: 'Debe contener al menos una letra minúscula (a-z)',
        })
        .regex(/[A-Z]/, {
          message: 'Debe contener al menos una letra mayúscula (A-Z)',
        })
        .regex(/[0-9]/, { message: 'Debe contener al menos un número (0-9)' })
        .regex(/[@$!%*#?&]/, {
          message: 'Debe contener al menos un carácter especial (@$!%*#?&)',
        }),
      confirmPassword: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }),
)
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
})

const handleSignOut = async () => {
  await clear()
  router.push('/auth/login')
  await fetch('/api/auth/logout', {
    method: 'POST',
  })
}

const onSubmit = form.handleSubmit(async (values: any) => {
  const formattedValues = {
    ...values,
  }
  props.onPassword(formattedValues)
})
const startChange = () => {
  isChange.value = true
}
const cancelEdit = () => {
  isChange.value = false
  form.resetForm()
}
const handleRestorePasswordClick = () => {
  if (props.userDetail?.email) {
    props.onRestore(props.userDetail.email) // Pasar el email del usuario
  }
}
</script>
<template>
  <div class="w-full bg-white mt-4 px-[24px] pb-[32px]">
    <div
      class="flex flex-wrap flex-col md:flex-nowrap gap-x-[32px] w-[100%] bg-white rounded-xl pt-[24px]"
    >
      <div
        class="flex justify-between border-b-[1px] pb-[31.5px] border-[#E2E8F0] w-full"
      >
        <h1
          class="flex items-center text-[20px] font-[700] leading-[28px] text-primary"
        >
          Cambiar contraseña
        </h1>
        <div v-if="!isChange" class="h 10 w 10">
          <Button
            class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
            @click="startChange"
          >
            Cambiar
          </Button>
        </div>
      </div>
    </div>
    <form class="space-y-4" @submit="onSubmit">
      <div
        class="grid grid-cols-1 gap-4 md:grid-cols-2 text-[#0F172A] text-[14px] pt-[24px]"
      >
        <!-- Contraseña actual -->
        <div class="relative w-full">
          <FormField v-slot="{ componentField }" name="currentPassword">
            <FormItem>
              <FormControl>
                <CustomInput
                  show-tooltip
                  tooltip-content="Crea una contraseña que cumpla con los siguientes criterios:
                                                     • Al menos 8 caracteres
                                                     • Al menos una mayúscula
                                                     • Al menos una minúscula
                                                     • Al menos un número (0-9)
                                                     • Al menos un símbolo (@ , #, $, etc)"
                  static-label
                  :type="showCurrentPassword ? 'text' : 'password'"
                  label="Contraseña actual"
                  v-bind="componentField"
                  :disabled="!isChange"
                  show-password-icon
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div></div>
        <!-- Nueva contraseña -->
        <div class="relative w-full">
          <FormField v-slot="{ componentField }" name="newPassword">
            <FormItem>
              <FormControl>
                <CustomInput
                  show-tooltip
                  tooltip-content="Crea una contraseña que cumpla con los siguientes criterios:
                                                     • Al menos 8 caracteres
                                                     • Al menos una mayúscula
                                                     • Al menos una minúscula
                                                     • Al menos un número (0-9)
                                                     • Al menos un símbolo (@ , #, $, etc)"
                  static-label
                  :type="showNewPassword ? 'text' : 'password'"
                  label="Nueva contraseña"
                  v-bind="componentField"
                  :disabled="!isChange"
                  show-password-icon
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Confirmar contraseña -->
        <div class="relative w-full">
          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormControl>
                <CustomInput
                  show-tooltip
                  tooltip-content="Crea una contraseña que cumpla con los siguientes criterios:
                                                     • Al menos 8 caracteres
                                                     • Al menos una mayúscula
                                                     • Al menos una minúscula
                                                     • Al menos un número (0-9)
                                                     • Al menos un símbolo (@ , #, $, etc)"
                  static-label
                  type="password"
                  label="Confirmar contraseña"
                  v-bind="componentField"
                  :disabled="!isChange"
                  show-password-icon
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>
      <!-- Enlace para recuperar contraseña -->
      <Button
        variant="link"
        class="p-0"
        :disabled="!isChange"
        @click.prevent="handleRestorePasswordClick"
      >
        <p class="mt-[8px] text-[#052339] text-[14px] font-[600]">
          He olvidado mi contraseña actual
        </p>
      </Button>
      <div
        v-if="isChange"
        class="mt-4 px-6 flex flex-wrap md:flex-nowrap justify-center gap-y-[10px] gap-x-[10px] w-full"
      >
        <Button
          type="button"
          size="xl"
          class="text-[14px] md:text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent"
          @click.prevent="cancelEdit"
          >Cancelar</Button
        >
        <Button
          type="submit"
          :disabled="!form.meta.value.valid"
          :class="
            cn(
              'text-[14px] md:text-[16px] font-[600] bg-[#062339] hover:bg-gray-700',
              !form.meta.value.valid
                ? 'text-white'
                : 'hover:text-primary hover:bg-bgtheme',
            )
          "
          size="xl"
          >Confirmar</Button
        >
      </div>
    </form>
  </div>
</template>

