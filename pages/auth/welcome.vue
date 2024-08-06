<template>
    <div class="min-h-screen flex items-center justify-center bg-white p-4">
      <div class="text-center">
        <img 
          src="~/assets/icon/png/icon-check.png" 
          alt="Check icon" 
          class="mx-auto mb-4 w-16 h-16"
        />
        <h1 class="text-3xl font-bold text-[#09314F] mb-2">¡Genial!</h1>
        <p class="text-xl text-[#09314F] mb-6">Ya eres parte de Deocasión</p>
        <Button 
          class="bg-[#09314F] text-white px-6 py-2 rounded-md hover:bg-blue-800 w-full max-w-xs"
          @click="handleLogin"
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Button } from '@/components/ui/button'
  
  const handleLogin = () => {
    // Lógica para manejar el inicio de sesión
  }
  </script>