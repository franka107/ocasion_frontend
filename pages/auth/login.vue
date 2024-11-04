<template>
  <AuthForm logo-subtitle="Acceso">
    <BaseForm
      v-if="!showForgotPassword"
      title="Bienvenido"
      subtitle="Inicia sesión con tus credenciales."
      submit-text="Ingresar"
      :submit-class="submitButtonClass"
      :is-active="isActive"
      :is-loading="isLoading"
      @submit="handleSubmit"
    >
      <div class="mb-6 relative">
        <InputWithLabel
          id="email"
          v-model="email"
          type="email"
          label="Correo electrónico"
          :error="errors.email"
          :class="{ 'border-red-500': errors.email }"
        />
      </div>
      <div class="mb-6 relative">
        <InputWithLabel
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          :error="errors.password"
          :class="{ 'border-red-500': errors.password }"
        >
          <template #icon-right>
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              @click="togglePassword()"
            >
              <CustomIcons
                :name="showPassword ? 'EyeIcon' : 'EyeIconClosed'"
                class="w-10 h-10"
              />
            </button>
          </template>
        </InputWithLabel>
        <div class="flex justify-end mt-2">
          <a
            href="#"
            class="font-semibold text-sm text-primary hover:underline h-[20px] rounded-tl-[2px] opacity-100"
            @click.prevent="toggleForgotPassword"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </BaseForm>
    <ForgotPasswordForm v-else @back="toggleForgotPassword" />
    <Dialog
      v-model:open="dialogState.isSuspendedDialogOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de alerta"
      title="Cuenta suspendida"
      description="Tu cuenta se encuentra suspendida, por favor contacta al administrador para mayor informacion"
      button-text="Aceptar"
      icon-bg-color="bg-[#f53e3e]"
      @close="closeDialog('isSuspendedDialogOpen')"
      @action="closeDialog('isSuspendedDialogOpen')"
    />
    <Dialog
      v-model:open="dialogState.isMaxAttemptsDialogOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de alerta"
      title="Alcanzo el límite de accesos"
      description="Ha alcanzado el límite de intentos. Se le ha enviado un correo para restaurar la contraseña."
      button-text="Aceptar"
      icon-bg-color="bg-[#f53e3e]"
      @close="closeDialog('isMaxAttemptsDialogOpen')"
      @action="closeDialog('isMaxAttemptsDialogOpen')"
    />
    <Dialog
      v-model:open="dialogState.isIncorrectCredentialsOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de alerta"
      title="Credenciales  incorrectas"
      description="El correo electrónico o la contraseña son incorrectos. Por favor, vuelva a intentarlo."
      button-text="Aceptar"
      icon-bg-color="bg-[#f53e3e]"
      @close="closeDialog('isIncorrectCredentialsOpen')"
      @action="closeDialog('isIncorrectCredentialsOpen')"
    />
    <Dialog
      v-model:open="dialogState.isDialogOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de alerta"
      title="Contraseña caducada"
      description="La contraseña actual ha caducado, por favor actualice su contraseña"
      button-text="Aceptar"
      icon-bg-color="bg-[#FBBF24]"
      @close="closeDialog('isDialogOpen')"
      @action="goToUpdatePassword"
    />
    <Dialog
      v-model:open="dialogState.isCommonErrorDialogOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de alerta"
      title="Error"
      :description="commonErrorDialogMessage"
      button-text="Aceptar"
      icon-bg-color="bg-[#FBBF24]"
      @close="closeDialog('isCommonErrorDialogOpen')"
      @action="closeDialog('isCommonErrorDialogOpen')"
    />
  </AuthForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthForm from '~/components/auth/authForm.vue'
import BaseForm from '~/components/auth/baseForm.vue'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import Dialog from '~/components/auth/dialogForm.vue'
import ForgotPasswordForm from '~/components/auth/forgotPasswordForm.vue'
import { useLoginForm } from '~/composables/useLoginForm'
import messageIcon from '~/assets/icon/png/priority-high.png'

const {
  email,
  password,
  showPassword,
  dialogState,

  showForgotPassword,

  errors,
  handleSubmit,
  togglePassword,
  toggleForgotPassword,
  closeDialog,
  goToUpdatePassword,
  isLoading,
  commonErrorDialogMessage,
} = useLoginForm()

// Computa si el campo de correo electrónico tiene texto
const isActive = computed(() => email.value.length > 0)

const submitButtonClass = computed(() => {
  return isActive.value
    ? 'w-full py-2 mt-4 bg-primary text-white rounded focus:outline-none focus:ring-2 focus:ring-primary'
    : 'w-full py-2 mt-4 bg-gray-200 text-gray-400 rounded cursor-not-allowed'
})
const messageIconSrc = messageIcon
</script>
