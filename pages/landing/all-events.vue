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
                <h2 class="text-left text-[#2872A1] mt-[48px] mb-[16px] text-[18px] font-[700]">SUBASTAS</h2>
                <h1 class="text-left text-bluePrimary mb-[32px] text-[48px] font-[700] leading-[70px]">Todos los
                    <span class="text-[#F6313C]">Eventos</span>
                </h1>
            </div>
            <!-- Selectores -->
            <section class="flex text-bluePrimary text-[14px] mx-[80px] gap-4 p-4">
                <div class="flex flex-wrap gap-4">
                    <!-- Tipo de bien -->
                    <div class="flex flex-col">
                        <label for="tipoBien" class="font-[500] mb-1.5">Tipo de bien</label>
                        <select v-model="selectedTipoBien"
                            class="w-[303px] lg:w-[225px] xl:w-[303px] leading-[24px] text-[#94A3B8] font-[400] px-3 py-2 border border-[#CBD5E1] rounded-md">
                            <option value="">Seleccionar</option>
                            <option value="bien1">Bien 1</option>
                            <option value="bien2">Bien 2</option>
                        </select>
                    </div>

                    <!-- Tipo de evento -->
                    <div class="flex flex-col">
                        <label for="tipoEvento" class="font-[500] mb-1.5">Tipo de evento</label>
                        <select v-model="selectedTipoBien"
                            class="w-[303px] lg:w-[225px] xl:w-[303px] leading-[24px] text-[#94A3B8] font-[400] px-3 py-2 border border-[#CBD5E1] rounded-md">
                            <option value="">Seleccionar</option>
                            <option value="evento1">Evento 1</option>
                            <option value="evento2">Evento 2</option>
                        </select>
                    </div>

                    <!-- Organización -->
                    <div class="flex flex-col">
                        <label for="organizacion" class="font-[500] mb-1.5">Organización</label>
                        <select v-model="selectedTipoBien"
                            class="w-[303px] lg:w-[225px] xl:w-[303px] leading-[24px] text-[#94A3B8] font-[400] px-3 py-2 border border-[#CBD5E1] rounded-md">
                            <option value="">Seleccionar</option>
                            <option value="org1">Organización 1</option>
                            <option value="org2">Organización 2</option>
                        </select>
                    </div>
                </div>

                <!-- Botón de Borrar filtros -->
                <div class="flex items-end">
                    <Button type="button" @click="resetFilters"
                        class="text-[16px] font-[600] bg-white text-primary border border-primary hover:bg-accent">
                        Borrar filtros
                    </Button>
                </div>

            </section>
            <Card />
        </div>
        <Footer />
    </div>
</template>
<script setup lang="ts">
import Menu from '@/components/landing/Menu.vue';
import Card from '@/components/landing/Card.vue';
import Footer from '@/components/landing/Footer.vue';
const selectedTipoBien = ref<string>('');
const selectedTipoEvento = ref<string>('');
const selectedOrganizacion = ref<string>('');

const resetFilters = () => {
    selectedTipoBien.value = '';
    selectedTipoEvento.value = '';
    selectedOrganizacion.value = '';
};
</script>