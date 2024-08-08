<template>
  <div class="flex-grow flex flex-col pt-6">
    <div class="flex space-x-4 text-sm font-medium leading-5">
      <NuxtLink
        to="/dashboard/users/administrators"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/dashboard/users/administrators')
              ? 'bg-white text-primary'
              : 'bg-blue/[0.07] text-primary/50'
          )
        "
      >
        Administradores
      </NuxtLink>
      <NuxtLink
        to="/dashboard/users/organizations"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/dashboard/users/organizations')
              ? 'bg-white text-primary'
              : 'bg-blue/[0.07] text-primary/50'
          )
        "
      >
        Organizaciones
      </NuxtLink>
      <NuxtLink
        to="/dashboard/users/participants"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/dashboard/users/participants')
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
