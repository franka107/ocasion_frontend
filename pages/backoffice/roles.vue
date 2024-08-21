<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-bold">Panel Super admin</h2>
    <p class="text-gray-600">Gestiona eventos, usuarios y reportes</p>
  </div>    
  <div class="flex-grow flex flex-col pt-6">
    <div class="flex space-x-4 text-sm font-medium leading-5">
      <NuxtLink
        to="/backoffice/roles/administrators"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/backoffice/roles/administrators')
              ? 'bg-white text-primary'
              : 'bg-blue/[0.07] text-primary/50'
          )
        "
      >
        Administradores
      </NuxtLink>
      <NuxtLink
        to="/backoffice/roles/organizations"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/backoffice/roles/organizations')
              ? 'bg-white text-primary'
              : 'bg-blue/[0.07] text-primary/50'
          )
        "
      >
        Organizaciones
      </NuxtLink>
      <NuxtLink
        to="/backoffice/roles/participants"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/backoffice/roles/participants')
              ? 'bg-white text-primary'
              : 'bg-blue/[0.07] text-primary/50'
          )
        "
      >
        Participantes
      </NuxtLink>
    </div>
    <div
      class="flex justify-center flex-grow"
    >
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
