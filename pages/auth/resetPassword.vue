<template>
  <NuxtLayout logo-subtitle="Acceso Super Admin">
    <BaseForm
      title="Recuperar contraseña"
      subtitle="Hemos enviado un enlace de recuperación al correo del usuario ingresado. Si no lo encuentras en tu bandeja de entrada, recuerda revisar tu carpeta de Spam."
      submit-text="Iniciar sesión"
      submit-class="w-full py-2 mt-4 bg-[#D9E3ED] text-black rounded hover:bg-[#09314F] hover:text-white"
      title-class="text-[#20445E]"
      subtitle-class="text-xs text-[#68686C]"
      @submit="handleSubmit"
    >
      <div class="space-y-4">
        <Button
          type="button"
          class="w-full py-2 mt-4 bg-background text-[#052339] rounded hover:bg-transparent"
          @click="volverAEnviar"
        >
          <img
            :src="emailIconSrc"
            alt="Ícono de correo"
            class="mr-2 h-3.5 w-4"
          />
          Volver a enviar
        </Button>
      </div>
    </BaseForm>
    <Dialog
      v-model:open="isDialogOpen"
      :icon-src="messageIconSrc"
      icon-alt="Icono de correo"
      title="Enlace reenviado"
      description="Hemos reenviado el enlace para restablecer la contraseña a su correo electrónico."
      button-text="Entendido"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NuxtLayout from '~/components/auth/authForm.vue'
import BaseForm from '~/components/auth/baseForm.vue'
import Button from '~/components/ui/button/Button.vue'
import Dialog from '~/components/auth/dialogForm.vue'
import emailIcon from '~/assets/icon/png/email-icon.png'
import messageIcon from '~/assets/icon/png/message-icon.png'

const isDialogOpen = ref(false)

const handleSubmit = () => {
  // Lógica para manejar el envío del formulario
  console.log('Enviar formulario de recuperación de contraseña')
}

const volverAEnviar = () => {
  // Lógica para reenviar el enlace
  console.log('Reenviar enlace')
  // Abrir el diálogo
  isDialogOpen.value = true
}
const closeDialog = () => {
  isDialogOpen.value = false
}

// Asignar las imágenes a variables
const emailIconSrc = emailIcon
const messageIconSrc = messageIcon
</script>
