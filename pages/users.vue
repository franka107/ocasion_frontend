<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-bold">Panel Super administrador</h2>
    <p class="text-gray-600">Gestiona eventos, usuarios y reportes</p>
  </div>
  <div class="flex-grow flex flex-col pt-6">
    <div class="flex space-x-4">
      <NuxtLink to="/users/administrators" class="py-2 px-4 rounded-t-lg" :class="{
        'bg-white text-[#2D5979]': isActive('/users/administrators'),
        'bg-[#DEE6EF] text-[#2D5979]': !isActive('/users/administrators'),
      }">
        Administradores
      </NuxtLink>
      <NuxtLink to="/users/organizations" class="py-2 px-4 rounded-t-lg" :class="{
        'bg-white text-[#2D5979]': isActive('/users/organizations'),
        'bg-[#DEE6EF] text-[#2D5979]': !isActive('/users/organizations'),
      }">
        Organizaciones
      </NuxtLink>
      <NuxtLink to="/users/participants" class="py-2 px-4 rounded-t-lg" :class="{
        'bg-white text-[#2D5979]': isActive('/users/participants'),
        'bg-[#DEE6EF] text-[#2D5979]': !isActive('/users/participants'),
      }">
        Participantes
      </NuxtLink>
    </div>
    <div class="bg-white shadow-md rounded-lg px-6 flex-1 flex justify-center items-center">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>
