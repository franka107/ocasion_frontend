<template>
  <ContentLayout title="Organizaciones">
  <div class="bg-white shadow-sm rounded-lg p-6">
    <h2 class="text-xl font-bold">Panel Super administrador</h2>
    <p class="text-gray-600">Gestiona eventos, usuarios y reportes</p>
  </div>    
  <div class="flex-grow flex flex-col pt-6">
    <div class="flex space-x-4 text-sm font-medium leading-5">
      <NuxtLink
        to="/backoffice/users/administrators"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/backoffice/users/administrators')
              ? 'bg-white text-primary'
              : 'bg-blue/[0.07] text-primary/50'
          )
        "
      >
        Administradores
      </NuxtLink>
      <NuxtLink
        to="/backoffice/users/organizations"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/backoffice/users/organizations')
              ? 'bg-white text-primary'
              : 'bg-blue/[0.07] text-primary/50'
          )
        "
      >
        Organizaciones
      </NuxtLink>
      <NuxtLink
        to="/backoffice/users/participants"
        class="py-2 px-4 rounded-t-lg"
        :class="
          cn('',
            isActive('/backoffice/users/participants')
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
  </ContentLayout>
</template>

<script setup lang="ts">
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue';
import ContentLayout from '~/layouts/default/ContentLayout.vue';

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>
