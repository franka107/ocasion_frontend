<template>
  <BaseForm
    title="Recuperar contraseña"
    subtitle="Para comenzar, ingrese su correo para recuperar su contraseña."
    @submit="handleSubmit"
    submitText="Continuar"
    :submitClass="submitButtonClass"
    :isActive="true"
    titleClass="text-primary"
    subtitleClass="text-xs text-grayCustom"
  >
    <div>
      <InputWithLabel
        id="email"
        type="text"
        label="Correo electrónico"
        v-model="email"
        :error="error"
      />
    </div>
  </BaseForm>

  <Dialog
    v-model:open="isSuccessDialogOpen"
    :iconSrc="messageIcon"
    iconAlt="Icono de alerta"
    title="Contraseña caducada"
    description="Se envio un correo indicando el proceso de recuperación de contraseña. Por favor revise su bandeja de entrada."
    buttonText="Aceptar"
    iconBgColor="bg-[#00BB8E]"
    @close="closeSuccessDialog"
    @action="closeSuccessDialog"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseForm from "~/components/auth/baseForm.vue";
import messageIcon from "~/assets/icon/png/check-icon.png";
import InputWithLabel from "~/components/auth/inputWithLabel.vue";
import usePasswordRecovery from "~/composables/usePasswordRecovery";
import { useRouter } from "vue-router";
import Dialog from "~/components/auth/dialogForm.vue";

const router = useRouter();
const {
  email,
  error,
  isActive,
  buttonClass,
  submitButtonClass,
  isSuccessDialogOpen,
  closeSuccessDialog,
  handleSubmit,
} = usePasswordRecovery();
</script>

<style scoped>
/* Puedes definir estilos adicionales aquí si es necesario */
</style>
