<template>
  <AuthForm logo-subtitle="Acceso Super Admin">
    <BaseForm 
      v-if="!showForgotPassword" 
      title="Bienvenido" 
      subtitle="Inicia sesión con tus credenciales."
      submit-text="Ingresar"
      :submitClass="submitButtonClass"
      :isActive="isActive"
      @submit="handleSubmit"
    >
      <div class="mb-6 relative">
        <InputWithLabel 
          id="email"
          type="email"
          label="Correo electrónico"
          v-model="email"
          :error="errors.email"
          :class="{ 'border-red-500': errors.email }"
        />
      </div>
      <div class="mb-6 relative">
        <InputWithLabel 
          id="password"
          type="password"
          label="Contraseña"
          v-model="password"
          :error="errors.password"
          :class="{ 'border-red-500': errors.password }"
        />
        <div class="flex justify-end mt-2">
          <a
            @click.prevent="toggleForgotPassword" 
            href="#" 
            class="font-semibold text-xs text-primary hover:underline w-[161px] h-[20px] rounded-tl-[2px] opacity-100"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </BaseForm>
    <ForgotPasswordForm 
      v-else 
      @back="toggleForgotPassword" 
    />
    <Dialog 
      v-model:open="isDialogOpen"
      :iconSrc="messageIconSrc"
      iconAlt="Icono de alerta"
      title="Contraseña caducada"
      description="La contraseña actual ha caducado, por favor actualice su contraseña"
      buttonText="Aceptar"
      iconBgColor="bg-[#FBBF24]"
      @close="closeDialog"
      @action="goToUpdatePassword"
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
  showForgotPassword,
  isDialogOpen,
  errors,
  handleSubmit,
  togglePassword,
  toggleForgotPassword,
  closeDialog,
  goToUpdatePassword
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
