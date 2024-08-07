<template>
    <NuxtLayout logo-subtitle="Acceso Super Admin">
      <BaseForm 
        title="Recuperar contraseña" 
        subtitle="Para comenzar, ingrese su usuario para establecer su contraseña."
        @submit="handleSubmit"
        submitText="Iniciar sesión"
        submitClass="w-full py-2 mt-4 bg-[#D9E3ED] text-black rounded  hover:bg-[#09314F] hover:text-white "
        titleClass="text-[#20445E]"
        subtitleClass=" text-xs text-[#68686C]"
      >
        <div class="space-y-4">
          <Input 
            v-model="email" 
            type="email" 
            placeholder="Ingresa tu correo"
            class="w-full p-2 border rounded border border-black"
          />
          <Button 
          @click="redirectToLogin" 
          type="button"
          class="w-full py-2 mt-4 bg-[#F1F5F9] text-gray-400 rounded hover:bg-[#09314F] hover:text-white"
        >
          Continuar
        </Button>
        </div>
      </BaseForm>
    </NuxtLayout>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import NuxtLayout from '~/components/auth/authForm.vue'
  import BaseForm from '~/components/auth/baseForm.vue'
  import Input from '~/components/ui/input/Input.vue'
  
  const email = ref('')
  
  const handleSubmit = () => {
    // Lógica para manejar el envío del formulario
    console.log('Enviar formulario de recuperación de contraseña')
  }
  
  const redirectToLogin = () => {
    // Lógica para redirigir al usuario a la página de inicio de sesión
    console.log('Redirigir a inicio de sesión')
  }
  </script>