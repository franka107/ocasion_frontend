<template>
  <NuxtLayout logo-subtitle="Acceso Super Admin">
    <BaseForm 
      title="Bienvenido" 
      subtitle="Inicia sesión con tus credenciales."
      submit-text="Ingresar"
      submit-class="text-gray-300 bg-[#F1F5F9] hover:bg-[#09314F] hover:text-white"
      @submit="handleSubmit"
    >
      <div class="space-y-4">
        <Input 
          v-model="email" 
          type="email" 
          placeholder="Ingresa tu correo"
        />
        <div class="relative">
          <Input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Contraseña"
          />
          <Button 
            @click="togglePassword" 
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center  bg-transparent hover:bg-transparent border-none"
          >
              <EyeClosedIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
              <EyeOpenIcon v-else class="h-5 w-5 text-gray-400" />
            </Button>
        </div>
      </div>
    </BaseForm>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NuxtLayout from '~/components/auth/authForm.vue'
import BaseForm from '~/components/auth/baseForm.vue'
import Input from '~/components/ui/input/Input.vue'
import Button from '~/components/ui/button/Button.vue'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-icons/vue'
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const  router = useRouter()
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
const { fetch, loggedIn } = useUserSession()
const handleSubmit = async() => {
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
</script>