<template>
  <BaseForm
    title="Recuperar contraseña"
    subtitle="Para comenzar, ingrese su correo para recuperar su contraseña."
    submit-text="Continuar"
    :submit-class="submitButtonClass"
    :is-active="true"
    title-class="text-primary"
    subtitle-class="text-xs text-grayCustom"
    @submit="handleSubmit"
  >
    <div>
      <InputWithLabel
        id="email"
        v-model="email"
        type="text"
        label="Correo electrónico"
        :error="error"
      />
    </div>
  </BaseForm>

  <Dialog
    v-model:open="isSuccessDialogOpen"
    :icon-src="messageIcon"
    icon-alt="Icono de alerta"
    title="Contraseña caducada"
    description="Se envio un correo indicando el proceso de recuperación de contraseña. Por favor revise su bandeja de entrada."
    button-text="Aceptar"
    icon-bg-color="bg-[#00BB8E]"
    @close="closeSuccessDialog"
    @action="closeSuccessDialog"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseForm from '~/components/auth/baseForm.vue'
import messageIcon from '~/assets/icon/png/check-icon.png'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import usePasswordRecovery from '~/composables/usePasswordRecovery'
import Dialog from '~/components/auth/dialogForm.vue'

const router = useRouter()
const {
  email,
  error,
  isActive,
  buttonClass,
  submitButtonClass,
  isSuccessDialogOpen,
  closeSuccessDialog,
  handleSubmit,
} = usePasswordRecovery()
</script>

<style scoped>
/* Puedes definir estilos adicionales aquí si es necesario */
</style>
