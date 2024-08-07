<template>
  <NuxtLayout logo-subtitle="Acceso Super Admin">
    <BaseForm 
      title="Bienvenido" 
      subtitle="Inicia sesión con tus credenciales."
      submit-text="Ingresar"
      submit-class="text-gray-300 bg-primary hover:bg-[#09314F] hover:text-white"
      @submit="handleSubmit"
    >
      <div class="space-y-4">
        <Input 
          v-model="email" 
          type="email" 
          placeholder="Ingresa tu correo"
        />
        <div class="relative flex flex-col">
          <Input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Contraseña"
          />
          <div class="flex items-center mt-2">
            <Button 
              @click="togglePassword" 
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent hover:bg-transparent border-none"
            >
              <EyeClosedIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
              <EyeOpenIcon v-else class="h-5 w-5 text-gray-400" />
            </Button>
            <a href="" class="ml-auto font-semibold text-xs text-[#09314F] hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </BaseForm>
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NuxtLayout from '~/components/auth/authForm.vue'
import BaseForm from '~/components/auth/baseForm.vue'
import Input from '~/components/ui/input/Input.vue'
import Button from '~/components/ui/button/Button.vue'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-icons/vue'
import Dialog from '~/components/auth/dialogForm.vue'
import messageIcon from '~/assets/icon/png/priority-high.png'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isDialogOpen = ref(false)
const router = useRouter()
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
const { fetch, loggedIn } = useUserSession()
const handleSubmit = async() => {
  // Abre el diálogo cuando el usuario hace clic en "Ingresar"
  console.log('Enviar formulario de  contraseña')
  // isDialogOpen.value = true

  // Logic to handle form submission
  await $fetch("/api/auth/login", {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value
    },
  })
  await fetch()
  router.push("/dashboard")
}

const closeDialog = () => {
  isDialogOpen.value = false
}

const goToUpdatePassword = () => {
  console.log('Redirigiendo a la vista de actualización de contraseña')
  //closeDialog()
  router.push('/auth/updatePassword')
}

const messageIconSrc = messageIcon
</script>
