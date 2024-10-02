<template>
    <div class=" min-h-screen bg-white">
        <div
            class="flex justify-end px-[80px] leading-[26px] pt-[14px] pb-[20px] bg-bluePrimary gap-x-[8px] space-x-2 ">
            <h4 class="text-4 text-[#FFFFFF] font-[500]">Síguenos:</h4>
            <CustomIcons name="facebook" class="ml-auto" />
            <CustomIcons name="tiktok" class="ml-auto" />
            <CustomIcons name="whatsapp" class="ml-auto" />
        </div>
        <Menu />
        <div class="grid justify-center">
            <div class="max-w-[1280px] mx-[80px]">
                <h1 class="text-center text-bluePrimary my-[32px] text-[48px] font-[700] leading-[70px]">Sobre nosotros
                </h1>
            </div>
            <div class="w-[1280px] grid grid-cols-2 items-center justify-center mx-[80px] mb-[48px]">
                <div class="w-[631px]">
                    <h2 class="text-left text-[#2872A1] mt-[48px] mb-[10px] text-[18px] font-[700]">CONOCENOS</h2>
                    <h1 class="text-left text-bluePrimary mb-[18px] text-[40px] font-[700] leading-[50px]">¿Quiénes
                        <span class="text-[#F6313C]">somos?</span>
                    </h1>
                    <p class="w-[595.13px] text-[#68686C] text-[16px] font-[400]">En DeOcasion, redefinimos la
                        experiencia de compra y venta a través de nuestra innovadora
                        plataforma de subastas online. Desde nuestro lanzamiento, hemos dedicado nuestros esfuerzos a
                        ofrecer una experiencia única y enriquecedora, facilitando el acceso a productos de alta calidad
                        mediante un proceso de subasta seguro y transparente.</p>
                </div>
                <img src="/assets/img/nosotros.png" alt="Nosotros">
            </div>
        </div>
        <div class="grid justify-center my-[48px]">
            <div class="w-[1280px] grid justify-center px-[80px]">

                <h2 class="text-center text-[#2872A1] mt-[48px] mb-[10px] text-[18px] font-[700]">¿COMO FUNCIONA?</h2>
                <h1 class="text-center text-bluePrimary mb-[32px] text-[48px] font-[700] leading-[70px]">¡No hay que
                    tener miedo a las subastas! <span class="text-[#F6313C]">¡Es sencillo!</span></h1>
                <p class="text-[16px] text-[#737887] font-[400] mb-[32px]">
                    Las subastas virtuales podrán parecer peligrosas o sospechosas. Sin embargo, en DeOcasión, nos
                    aseguramos en que puedas contar con todas las garantías y seguridades para que tu experiencia sea la
                    mejor del mercado. Por ello, te recomendamos seguir las siguientes indicaciones
                </p>
                <img src="/assets/img/video-nosotros.png" alt="">
            </div>
        </div>
        <Footer />
    </div>
</template>
<script setup lang="ts">
import Menu from '@/components/landing/Menu.vue';
import Footer from '@/components/landing/Footer.vue';
</script>