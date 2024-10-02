<template>
    <section class="container mx-auto px-5 py-8">
      <div class="grid grid-cols-4 gap-[80px] justify-center">
        <div v-for="(step, index) in steps" :key="index" class="bg-[#FFFFFF] p-4 rounded-lg shadow-md w-[250px] h-[250px] text-center flex flex-col items-center justify-center">
          <CustomIcons :name="step.icon" class="mb-4" />
          <h3 class="text-[#20445E] font-[600] text-[24px] mb-[8px] ">{{ step.title }}</h3>
          <p class="text-[#68686C] font-[400] font-Roboto text-[14px]">{{ step.description }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';
  
  const steps = [
    {
      icon: 'register',
      title: 'Regístrate',
      description: 'Regístrate gratis en nuestra web para poder participar de las subastas.',
    },
    {
      icon: 'register',
      title: 'Elige',
      description: 'Elige la subasta de tu interés. "Participar en puja".',
    },
    {
      icon: 'register',
      title: 'Revisa',
      description: 'Revisa los resultados en "Mis pujas".',
    },
    {
      icon: 'register',
      title: '¡Listo!',
      description: 'Si ganaste la subasta, realiza el pago y recibe tu producto.',
    },
  ];
  </script>
  