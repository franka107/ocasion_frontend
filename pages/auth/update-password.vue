<template>
  <AuthForm logo-subtitle="Acceso">
    <BaseForm
      title="Crear una nueva contraseña"
      submit-text="Continuar"
      :submit-class="submitButtonClass"
      :is-active="isActive"
      class="relative"
      @submit="handleSubmit"
    >
      <div class="mb-6 relative">
        <InputWithLabel
          id="password"
          v-model="password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
        >
          <template #icon-right>
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              @click="togglePasswordVisibility('password')"
            >
              <CustomIcons
                :name="showPassword ? 'EyeIcon' : 'EyeIconClosed'"
                class="w-10 h-10"
              />
            </button>
          </template>
        </InputWithLabel>
      </div>

      <div class="mb-6 relative">
        <InputWithLabel
          id="confirmPassword"
          v-model="confirmPassword"
          :type="showPasswordConfirm ? 'text' : 'password'"
          label="Confirmar contraseña"
        >
          <template #icon-right>
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              @click="togglePasswordVisibility('confirmPassword')"
            >
              <CustomIcons
                :name="showPasswordConfirm ? 'EyeIcon' : 'EyeIconClosed'"
                class="w-10 h-10"
              />
            </button>
          </template>
        </InputWithLabel>
        <p
          v-if="areDifferentPasswords"
          as="p"
          class="text-sm font-medium text-destructive"
        >
          Las contraseñas no coinciden
        </p>
      </div>

      <div
        v-if="showPasswordRequirements"
        class="text-custom-16 font-roboto text-gray-600 mt-4 bg-[#F8FAFC] p-4 rounded-md shadow-md mb-12"
      >
        <p class="text-base font-roboto mb-2">
          Tu contraseña debe tener al menos 3 de los siguientes requisitos:
        </p>
        <ul class="list-none pl-5 mt-2">
          <li
            v-for="(req, index) in passwordRequirements"
            :key="index"
            class="flex items-center mb-2"
          >
            <span :class="getRequirementClass(req)">{{ req }}</span>
          </li>
        </ul>
      </div>
    </BaseForm>

    <Dialog
      v-model:open="isDialogOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de alerta"
      title="Contraseña creada"
      description="La contraseña se ha creado correctamente."
      sub-description="Por favor inicie sesión"
      button-text="Aceptar"
      icon-bg-color="bg-[#00BB8E]"
      @close="closeDialog"
      @action="goToLogin"
    />

    <Dialog
      v-model:open="isErrorDialogOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de alerta"
      title="Error"
      description="Ocurrio un error al crear la contraseña."
      sub-description="El enlace es incorrecto o ha expirado."
      button-text="Aceptar"
      icon-bg-color="bg-[#ff0000]"
      @close="closeErrorDialog"
      @action="goToLogin"
    />
  </AuthForm>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AuthForm from '~/components/auth/authForm.vue'
import BaseForm from '~/components/auth/baseForm.vue'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import Dialog from '~/components/auth/dialogForm.vue'
import messageIcon from '~/assets/icon/png/check-icon.png'
import { useValidationForm } from '~/composables/useValidateForm'

const { password, validationResult } = useValidationForm()
const confirmPassword = ref('')
const isDialogOpen = ref(false)
const isErrorDialogOpen = ref(false)
const showPasswordRequirements = ref(false)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const passwordRequirements = [
  '✓ Al menos 8 caracteres',
  '✓ Letras minúsculas (a-z)',
  '✓ Letras mayúsculas (A-Z)',
  '✓ Números (0-9)',
  '✓ Caracteres especiales (@$!%*#?&)',
]
const route = useRoute()
const queryParams = route.query
const hash = queryParams.hash

const areDifferentPasswords = computed(
  () => password.value !== confirmPassword.value,
)
// Activar el botón cuando se ingrese cualquier carácter en el campo de contraseña
const isActive = computed(
  () =>
    password.value.length >= 8 &&
    confirmPassword.value.length >= 1 &&
    password.value === confirmPassword.value,
)

// Clase del botón de envío
const submitButtonClass = computed(() => {
  return isActive.value
    ? 'w-full py-2 mt-4 bg-primary text-white rounded focus:outline-none focus:ring-2 focus:ring-primary'
    : 'w-full py-2 mt-4 bg-gray-200 text-gray-400 rounded cursor-not-allowed'
})

// Manejar el envío del formulario
const handleSubmit = async () => {
  if (
    isActive.value &&
    validationResult.value.valid &&
    password.value === confirmPassword.value
  ) {
    console.log('Enviar formulario de contraseña')

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hash,
        password: password.value,
      }),
    })

    if (response.ok) {
      isDialogOpen.value = true
    } else {
      const errorBody = await response.json()
      const errorBack = errorBody.data.errors[0]
      isErrorDialogOpen.value = true
    }
  } else {
    console.log(
      'La contraseña no cumple con los requisitos o no coincide con la confirmación',
    )
  }
}

// Cerrar el diálogo
const closeDialog = () => {
  isDialogOpen.value = false
}

const closeErrorDialog = () => {
  isErrorDialogOpen.value = false
}
// Verificar si un requisito está cumplido
const isRequirementFulfilled = (requirement: string) => {
  const requirementMap = {
    '✓ Al menos 8 caracteres': password.value.length >= 8,
    '✓ Letras minúsculas (a-z)': /[a-z]/.test(password.value),
    '✓ Letras mayúsculas (A-Z)': /[A-Z]/.test(password.value),
    '✓ Números (0-9)': /[0-9]/.test(password.value),
    '✓ Caracteres especiales (@$!%*#?&)': /[@$!%*#?&]/.test(password.value),
  }

  return requirementMap[requirement] || false
}

// Obtener la clase de un requisito basado en su estado
const getRequirementClass = (requirement: string) => {
  return isRequirementFulfilled(requirement) ? 'text-primary' : 'text-red-500'
}

// Mostrar los requisitos de la contraseña si se ha ingresado algo
watch(password, (newVal) => {
  showPasswordRequirements.value = newVal.length > 0
})
watch(confirmPassword, (newVal) => {
  showPasswordRequirements.value = password.value.length > 0
})

const togglePasswordVisibility = (type: 'password' | 'confirmPassword') => {
  if (type === 'password') {
    showPassword.value = !showPassword.value
  } else if (type === 'confirmPassword') {
    showPasswordConfirm.value = !showPasswordConfirm.value
  }
}

const messageIconSrc = messageIcon

// Función para ir a la página de actualización de contraseña
const goToLogin = () => {
  navigateTo('/auth/login')
  console.log('Ir a la página de actualización de contraseña')
}
</script>
