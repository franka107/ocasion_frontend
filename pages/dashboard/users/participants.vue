<template>
  <div>
    <h1>Participants</h1>
    <div class="flex flex-col gap-5">
      <!-- <SheetTrigger>Open Form</SheetTrigger> -->
        <!-- Trigger para abrir Formulario 1 -->
        <SheetTrigger @click="openSheet('form1')">Open Form 1</SheetTrigger>

        <!-- Trigger para abrir Formulario 2 -->
        <SheetTrigger @click="openSheet('form2')">Open Form 2</SheetTrigger>
    </div>

    <!-- <UserForm /> -->
    <SheetContent v-if="currentSheet === 'form1'">
      <!-- Contenido para el primer Sheet -->
      <h1>Formulario 1 componente</h1>
    </SheetContent>
    <SheetContent v-if="currentSheet === 'form2'">
      <!-- Contenido para el segundo Sheet -->
      <h1>Formulario 2 componente</h1>
    </SheetContent>
  </div>
</template>

<script setup lang="ts">
import UserForm from "@/components/users/administrators/form.vue";
import { useSheetStore } from "@/composables/useSheetStore.js";

const { currentSheet, openSheet, closeSheet } = useSheetStore();
</script>
