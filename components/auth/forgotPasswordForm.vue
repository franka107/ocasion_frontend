<template>
  <BaseForm 
    title="Recuperar contraseña" 
    subtitle="Para comenzar, ingrese su correo para recuperar su contraseña."
    @submit="handleSubmit"
    submitText="Iniciar sesión"
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
      <div class="flex">
        <button
          @click="onSubmit"
          :class="buttonClass"
          :disabled="!isActive"
          class="w-[524px] h-[54px] rounded-[8px] opacity-100"
        >
          Continuar
        </button>
      </div>
    </div>
  </BaseForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseForm from '~/components/auth/baseForm.vue'
import InputWithLabel from '~/components/auth/inputWithLabel.vue'
import usePasswordRecovery from '~/composables/usePasswordRecovery'
import { useRouter } from 'vue-router'

const router = useRouter()
const {
  email,
  error,
  isActive,
  buttonClass,
  submitButtonClass,
  handleSubmit
} = usePasswordRecovery()

const onSubmit = async () => {
  // Solo realiza la redirección al login
  if (await handleSubmit()) {
    // Si handleSubmit es exitoso, redirige al login
    router.push('/auth/login')
  }
}
</script>

<style scoped>
/* Puedes definir estilos adicionales aquí si es necesario */
</style>
