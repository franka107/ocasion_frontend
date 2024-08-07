<template>
   <div class="flex-grow flex flex-col pt-6">
    <div class="flex space-x-4">
      <NuxtLink
        to="/dashboard/users/administrators"
        class="py-2 px-4 rounded-t-lg"
        :class="isActive('/dashboard/users/administrators') ? 'bg-white text-[#2D5979]': 'bg-[#DEE6EF] text-[#2D5979]'"
      >
        Administradores
      </NuxtLink>
      <NuxtLink
        to="/dashboard/users/organizations"
        class="py-2 px-4 rounded-t-lg"
        :class="isActive('/dashboard/users/organizations') ? 'bg-white text-[#2D5979]': 'bg-[#DEE6EF] text-[#2D5979]'"
      >
        Organizaciones
      </NuxtLink>
      <NuxtLink
        to="/dashboard/users/participants"
        class="py-2 px-4 rounded-t-lg"
        :class="isActive('/dashboard/users/participants') ? 'bg-white text-[#2D5979]': 'bg-[#DEE6EF] text-[#2D5979]'"
      >
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
