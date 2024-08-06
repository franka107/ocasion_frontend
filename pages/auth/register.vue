<template>
    <NuxtLayout logo-subtitle="Acceso Admin">
      <BaseForm 
        title="Crea una nueva contraseña" 
        submit-text="Continuar"
        submit-class="text-gray-300 bg-[#F1F5F9] hover:bg-[#052339] hover:text-white"
        @submit="handleSubmit"
      >
        <div class="space-y-4 mt-4">
          <!-- Input Nueva Contraseña -->
          <div class="relative border rounded-md">
            <label for="password" class="absolute -top-3 left-3 bg-white px-1 text-gray-400 text-xs">Nueva contraseña</label>
            <Input 
              id="password"
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder=" "
              class="rounded-md border-none px-3 py-2"
            />
            <Button 
              @click="togglePassword" 
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent hover:bg-transparent border-none"
            >
              <EyeClosedIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
              <EyeOpenIcon v-else class="h-5 w-5 text-gray-400" />
            </Button>
          </div>
  
          <!-- Input Confirmar Contraseña -->
          <div class="relative border rounded-md">
            <label for="confirmPassword" class="absolute -top-3 left-3 bg-white px-1 text-gray-400 text-xs">Confirma tu contraseña</label>
            <Input 
              id="confirmPassword"
              v-model="confirmPassword" 
              type="password" 
              placeholder=" "
              class="rounded-md border-none px-3 py-2"
            />
          </div>
        </div>
  
        <!-- Requisitos de Contraseña -->
        <div v-if="showPasswordRequirements" class="text-xs text-gray-600 mt-4 bg-[#F8FAFC] p-4">
          <p>Tu contraseña debe tener al menos 3 de los siguientes requisitos:</p>
          <ul class="list-none pl-5 mt-2">
            <li v-for="req in passwordRequirements" :key="req" class="flex items-center">
              <CheckIcon class="h-4 w-4 text-green-500 mr-2" />
              {{ req }}
            </li>
          </ul>
        </div>
      </BaseForm>
    </NuxtLayout>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import NuxtLayout from '~/components/auth/authForm.vue'
  import BaseForm from '~/components/auth/baseForm.vue'
  import Input from '~/components/ui/input/Input.vue'
  import { Button } from '@/components/ui/button'
  import { EyeOpenIcon, EyeClosedIcon, CheckIcon } from '@radix-icons/vue'
  
  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)
  const showPasswordRequirements = ref(false)
  
  const passwordRequirements = [
    'Al menos 8 caracteres',
    'Letras minúsculas (a-z)',
    'Letras mayúsculas (A-Z)',
    'Números (0-9)',
    'Caracteres especiales (@$!%*#?&)'
  ]
  
  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }
  
  const handleSubmit = () => {
    // Lógica para manejar el envío del formulario
  }
  
  // Observa los cambios en la contraseña para mostrar u ocultar los requisitos
  watch(password, (newVal) => {
    showPasswordRequirements.value = newVal.length > 0
  })
  </script>
  