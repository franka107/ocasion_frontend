<script setup lang="ts">
import { ref } from 'vue';

const selectedValue = ref('0.00');
const buttons = ref([
  "+ $ 50.00",
  "+ $ 100.00",
  "+ $ 150.00",
  "+ $ 200.00",
  "+ $ 250.00"
]);
</script>
<template>
    <section class="flex justify-center ">
        <div class="grid grid-cols-1 mx-auto">
            <div class="max-w-[350px] max-h-[394px] flex flex-col shadow-[0px_0px_4px_0px_#0000001A] bg-white rounded-[8px] overflow-hidden">
                <!-- Contador en cajitas -->
                <div class="text-[#FFFFFF] text-[14px] leading-[16.41px] font-[500] bg-[#C7E0F0] text-center py-[8px]">
                    <div class="flex items-center space-x-2 justify-center text-[#152A3C] text-[10px] font-[600]">
                        <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center">
                            00<span class="text-[#F6313C] ml-[3px]">d</span>
                        </div>
                        <span>:</span>
                        <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center">
                            00<span class="text-[#F6313C] ml-[3px]">h</span>
                        </div>
                        <span>:</span>
                        <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center ">
                            00<span class="text-[#F6313C] ml-[3px]">m</span>
                        </div>
                        <span>:</span>
                        <div class="w-[36px] h-[20px] border border-[#152A3C] rounded-[8px] flex items-center justify-center">
                            00<span class="text-[#F6313C] ml-[3px]">s</span>
                        </div>
                    </div>
                </div>
                <!-- Información de la tarjeta -->
                <div class="px-[8px] pt-[20px] pb-[16px]">
                    <div class="flex justify-between text-[#20445E] text-[12px] leading-[25px]">
                        <p class="font-[600] mb-[16px]">Nombre evento</p>
                        <p class="font-[400]">00 ofertas</p>
                    </div>
                    <h2 class="text-[#152A3C] text-[14px] font-[700] leading-[24px] pb-[16px]">
                        Sedan - Marca: Kia Modelo: Soluto 1.4 MT - LX FULL Año 2020
                    </h2>
                    <div class="flex flex-col">
                        <div class="flex gap-x-[4px] leading-[16px]">
                            <p class="text-[#68686C] text-[12px] font-[600] text-center mb-[4px] flex items-center ">
                                Valor actual
                            </p>
                            <CustomIcons name="Info" class="mt-[1.5px] w-4 h-4 text-primary" />
                        </div>
                        <p class="font-[700] text-[14px] text-[#20445E] mb-[16px]">USD $0.000,00</p>
                    </div>
                    <div class="flex justify-between mb-[16px]">
                        <Select v-model="selectedValue" class="h-[40px]">
                            <SelectTrigger class="w-[216px]">
                                <SelectValue placeholder="0.00" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0.00" disabled class="text-gray-400">0.00</SelectItem>
                                <SelectItem value="10.00">10.00</SelectItem>
                                <SelectItem value="20.00">20.00</SelectItem>
                                <SelectItem value="30.00">30.00</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button @click="" type="button" variant="default" class="py-[10px] px-[24px]">
                            Ofertar
                        </Button>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex gap-x-[4px] leading-[16px]">
                            <p class="text-[#68686C] text-[14px] font-[600] text-center mb-[8px] flex items-center ">
                                Acciones rápidas
                            </p>
                            <CustomIcons name="Info" class="mt-[1.5px] w-4 h-4 text-primary" />
                        </div>
                        <div class="flex flex-col items-center">
                            <div class="flex flex-wrap justify-center gap-y-[8px] gap-x-[16px] px-[22.5px]">
                            <Button
                                v-for="(button, index) in buttons"
                                :key="index"
                                type="button"
                                class="w-[83px] h-[34px] px-4 py-1 text-[14px] border border-bluePrimary text-bluePrimary font-[600] hover:text-white hover:bg-bluePrimary rounded-[8px] bg-white"
                            >
                                {{ button }}
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>