<script setup lang="ts">
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';
import Menu from '@/components/landing/Menu.vue';
import Card from '@/components/landing/Card.vue';
import Advantage from '@/components/landing/Advantage.vue';
import Questions from '@/components/landing/Questions.vue';
import Contact from '@/components/landing/Contact.vue';
import Footer from '@/components/landing/Footer.vue';

const router = useRouter();
const handleAllEvents = async () => {
  router.push("/landing/all-events");
};
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="flex justify-end px-[80px] leading-[26px] pt-[14px] pb-[20px] bg-bluePrimary gap-x-[8px] space-x-2 ">
      <h4 class="text-4 text-[#FFFFFF] font-[500]">Síguenos:</h4>
      <CustomIcons name="facebook" class="ml-auto" />
      <CustomIcons name="tiktok" class="ml-auto" />
      <CustomIcons name="whatsapp" class="ml-auto" />
    </div>
    <Menu/>
    <!-- Carousel de imágenes -->
    <section class="">
      <!-- <Carousel class="container mx-auto"> -->
      <img src="/assets/img/fondo.png" alt="Imagen 1" class="w-[100%]" />
      <!-- </Carousel> -->
    </section>

    <!-- Sección de categorías -->
    <section class="pt-[48px] pb-[32px]">
      <div class="container mx-auto text-[18px]">
        <h2 class="text-bluePrimary leading-[24px] text-left  font-[700] mb-8">
          NAVEGA POR LAS CATEGORÍAS
        </h2>
        <div class="text-[#2872A1] font-[500] grid grid-cols-6 gap-5 text-center">
          <div class="space-y-4">
            <CustomIcons name="home-work" class="ml-auto" />
            <p>Inmuebles</p>
          </div>
          <div class="space-y-4">
            <CustomIcons name="home-work" class="ml-auto" />
            <p>Autos y Motos</p>
          </div>
          <div class="space-y-4">
            <CustomIcons name="home-work" class="ml-auto" />
            <p>Camiones y Autobuses</p>
          </div>
          <div class="space-y-4">
            <CustomIcons name="home-work" class="ml-auto" />
            <p>Maquinaria de Construcción</p>
          </div>
          <div class="space-y-4">
            <CustomIcons name="home-work" class="ml-auto" />
            <p>Chatarra y Residuos</p>
          </div>
          <div class="space-y-4">
            <CustomIcons name="home-work" class="ml-auto" />
            <p>Industrial, Maquinaria y Equipos</p>
          </div>
        </div>
      </div>
    </section>
    <section class="grid justify-center pt-[48px] pb-[32px]">
      <div class="container flex items-center justify-between mx-auto text-[18px]">
        <h2 class="text-bluePrimary leading-[24px] text-left  font-[700]">
          Destacados del día
        </h2>
        <button @click="handleAllEvents" class="text-[14px] font-[500] text-[#388EBF] ">Ver todos los eventos</button>
      </div>
      <Card />
    </section>
    <Advantage />
    <Questions />
    <Contact />
    <Footer />
  </div>
</template>

