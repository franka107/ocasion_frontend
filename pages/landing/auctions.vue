<template>
    <section>
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
                    <h1 class="text-center text-bluePrimary my-[32px] text-[48px] font-[700] leading-[70px]">Subastas
                    </h1>
                </div>
                <div class="w-[1280px] grid grid-cols-2 items-center justify-center mx-[80px] mb-[48px]">
                    <div class="w-[625px]">
                        <h2 class="text-left text-[#2872A1] mt-[48px] mb-[10px] text-[18px] font-[700]">SUBASTAS</h2>
                        <h1 class="text-left text-bluePrimary mb-[18px] text-[40px] font-[700] leading-[50px]">Subastas
                            online seguras y
                            <span class="text-[#F6313C]">de confianza</span>
                        </h1>
                        <p class="w-[595.13px] text-[#68686C] text-[16px] font-[400]">En DeOcasion, nos especializamos
                            en subastas online, proporcionando una forma emocionante y eficiente de adquirir productos
                            al mejor precio. Ofrecemos una amplia gama de artículos, desde bienes de consumo hasta
                            artículos especializados, con un proceso de subasta justo y competitivo. Priorizamos la
                            seguridad de nuestros usuarios mediante rigurosos protocolos para proteger tu información y
                            garantizar transacciones seguras, asegurando una experiencia confiable y sin preocupaciones.
                        </p>
                    </div>
                    <img src="/assets/img/subastas1.png" alt="Nosotros">
                </div>
            </div>
            <div class="grid justify-center">
                <div class="max-w-[1280px] mx-[80px]">
                    <h1 class="text-center text-bluePrimary my-[32px] text-[48px] font-[700] leading-[70px]">Subastas
                    </h1>
                </div>
                <div class="w-[1280px] grid grid-cols-2 items-center justify-center mx-[80px] mb-[48px]">
                    <img src="/assets/img/subastas2.png" alt="Nosotros">
                    <div class="w-[625px]">
                        <h2 class="text-left text-[#2872A1] mt-[48px] mb-[10px] text-[18px] font-[700]">SUBASTAS</h2>
                        <h1 class="text-left text-bluePrimary mb-[18px] text-[40px] font-[700] leading-[50px]">Respaldo
                            financiero
                            <span class="text-[#F6313C]">sólido</span>
                        </h1>
                        <p class="w-[595.13px] text-[#68686C] text-[16px] font-[400]">Contamos con un respaldo
                            financiero con más de 16 años en el sector financiero, lo que avala nuestra estabilidad y
                            capacidad para ofrecer un servicio excepcional. Esta sólida base financiera nos permite
                            innovar y mejorar continuamente, asegurando que nuestros usuarios disfruten de una
                            experiencia de subasta sin igual.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <section class="max-h-[553px] bg-[eeeeee]">
            <div class="grid justify-center my-[48px]">
                <div class="w-[1280px] grid justify-center px-[80px]">
                    <h2 class="text-center text-[#2872A1] mb-[10px] text-[18px] font-[700]">PASOS A SEGUIR
                    </h2>
                    <h1 class="text-center text-bluePrimary text-[48px] font-[700] leading-[70px]">¿Cómo participar de <span class="text-[#F6313C]">nuestras subastas?</span></h1>
                </div>
            </div>
            <CardAuctions/>
        </section>
        <div class="h-[553px] bg-white ">
            <h2 class="text-center text-[#2872A1] pt-[48px] mb-[10px] text-[18px] font-[700]">TESTIMONIOS</h2>
            <h1 class="text-center text-bluePrimary mb-[32px] text-[48px] font-[700] leading-[70px]">Lo que
                dicen <span class="text-[#F6313C]">los clientes</span></h1>
            <CardTestimonials/>
        </div>
        <Footer />
    </section>

</template>
<script setup lang="ts">
import Menu from '@/components/landing/Menu.vue';
import Footer from '@/components/landing/Footer.vue';
import CardAuctions from '@/components/landing/CardAuctions.vue';
import CardTestimonials from '@/components/landing/CardTestimonials.vue';
</script>