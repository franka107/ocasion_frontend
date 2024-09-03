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
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          v-model="password"
          :error="errors.password"
          :class="{ 'border-red-500': errors.password }"
        >
          <template #icon-right>
            <button
              @click="togglePassword()"
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
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
            @click.prevent="toggleForgotPassword"
            href="#"
            class="font-semibold text-sm text-primary hover:underline h-[20px] rounded-tl-[2px] opacity-100"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </BaseForm>
    <ForgotPasswordForm v-else @back="toggleForgotPassword" />
    <Dialog
      v-model:open="isSuspendedDialogOpen"
      :iconSrc="messageIconSrc"
      iconAlt="Icono de alerta"
      title="Cuenta suspendida"
      description="Tu cuenta se encuentra suspendida, por favor contacta al administrador para mayor informacion"
      buttonText="Aceptar"
      iconBgColor="bg-[#f53e3e]"
      @close="closeSuspendedDialog"
      @action="closeSuspendedDialog"
    />
    <Dialog
      v-model:open="isMaxAttemptsDialogOpen"
      :iconSrc="messageIconSrc"
      iconAlt="Icono de alerta"
      title="Alcanzo el límite de accesos"
      description="Ha alcanzado el límite de intentos. Se le ha enviado un correo para restaurar la contraseña."
      buttonText="Aceptar"
      iconBgColor="bg-[#f53e3e]"
      @close="closeMaxAttemptsDialog"
      @action="closeMaxAttemptsDialog"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthForm from "~/components/auth/authForm.vue";
import BaseForm from "~/components/auth/baseForm.vue";
import InputWithLabel from "~/components/auth/inputWithLabel.vue";
import Dialog from "~/components/auth/dialogForm.vue";
import ForgotPasswordForm from "~/components/auth/forgotPasswordForm.vue";
import { useLoginForm } from "~/composables/useLoginForm";
import messageIcon from "~/assets/icon/png/priority-high.png";

const {
  email,
  password,
  showPassword,
  closeMaxAttemptsDialog,
  closeSuspendedDialog,
  isSuspendedDialogOpen,
  showForgotPassword,
  isDialogOpen,
  isMaxAttemptsDialogOpen,
  errors,
  handleSubmit,
  togglePassword,
  toggleForgotPassword,
  closeDialog,
  goToUpdatePassword,
} = useLoginForm();

// Computa si el campo de correo electrónico tiene texto
const isActive = computed(() => email.value.length > 0);

const submitButtonClass = computed(() => {
  return isActive.value
    ? "w-full py-2 mt-4 bg-primary text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
    : "w-full py-2 mt-4 bg-gray-200 text-gray-400 rounded cursor-not-allowed";
});
const messageIconSrc = messageIcon;
</script>
