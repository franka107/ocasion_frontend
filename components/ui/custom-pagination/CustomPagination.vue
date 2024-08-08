<template>
    <div class="w-full flex justify-between">
        <div class="flex flex-row items-center">
            <span class="text-[#475569]">Total de registros</span>
            <div class="ml-2  bg-white rounded-[8px] text-primary w-[34px] h-[36px] flex justify-center items-center">5</div>
        </div>
        <div class="flex flex-row gap-x-[6px]">
            <button :class="`${btnSyles} w-[78px]`"><CustomIcons name="ArrowLeft" class="rotate-180 mr-1 w-6 h-6"/><span>Back</span></button>
                <button :class="`${btnSyles} w-[34px]`">1</button>
                <button :class="`${btnSyles} w-[34px]`">2</button>
                <button :class="`${btnSyles} w-[34px]`">3</button>
                <button :class="`${btnSyles} w-[34px]`">4</button>
                <button :class="`${btnSyles} w-[34px]`">5</button>
            <button :class="`${btnSyles} w-[78px] `"><span>Next</span> <CustomIcons name="ArrowLeft" class="ml-1 w-6 h-6" /></button>
        </div>
    </div>
    </template>
<script setup lang="ts">
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';

const btnSyles = 'flex justify-center items-center bg-white text-primary hover:bg-primary hover:text-white rounded-[8px] h-[36px]';
</script>

