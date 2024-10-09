<script setup lang="ts">
import { XCircle } from "lucide-vue-next";
</script>

<template>
  <div
    class="min-h-screen bg-background flex flex-col items-center justify-center p-4"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <XCircle class="mx-auto h-24 w-24 text-destructive" />
      <h1 class="text-4xl font-bold text-foreground">No autorizado</h1>
      <p class="text-xl text-muted-foreground">
        Lo sentimos, no estás autorizado para acceder a este recurso.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button variant="default"> Volver al inicio </Button>
        <Button variant="outline"> Iniciar sesión </Button>
      </div>
    </div>
  </div>
</template>
