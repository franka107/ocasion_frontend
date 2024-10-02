<template>
    <section class="container mx-auto px-5 py-8">
      <div class="grid grid-cols-3 gap-[80px] justify-center">
        <div v-for="(step, index) in steps" :key="index" class="bg-[#F3F8FC] p-4 rounded-lg shadow-md w-[350px] h-[246px] text-center flex flex-col items-center justify-center">
          <CustomIcons :name="step.icon" class="mb-4" />
          <h3 class="text-[#152A3C] font-[600] text-[20x] mb-[8px] ">{{ step.title }}</h3>
          <p class="text-[#152A3C] font-[400] font-Roboto text-[14px]">{{ step.description }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';
  
  const steps = [
    {
      icon: 'register',
      title: 'Jerome Bell',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Proin at sodales nunc, eu mollis dui. Quisque vitae sodales risus. Etiam rhoncus elementum efficitur. Nunc a tortor quis tortor vestibulum bibendum. Fusce sit amet augue augue. Nullam hendrerit libero eget ex fringilla, at pharetra felis congue.',
    },
    {
      icon: 'register',
      title: 'Jerome Bell',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Proin at sodales nunc, eu mollis dui. Quisque vitae sodales risus. Etiam rhoncus elementum efficitur. Nunc a tortor quis tortor vestibulum bibendum. Fusce sit amet augue augue. Nullam hendrerit libero eget ex fringilla, at pharetra felis congue.',
    },
    {
      icon: 'register',
      title: 'Jerome Bell',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Proin at sodales nunc, eu mollis dui. Quisque vitae sodales risus. Etiam rhoncus elementum efficitur. Nunc a tortor quis tortor vestibulum bibendum. Fusce sit amet augue augue. Nullam hendrerit libero eget ex fringilla, at pharetra felis congue.',
    },
    
  ];
  </script>
  