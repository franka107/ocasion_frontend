<script setup lang="ts">
const props = defineProps<{
    offerDetail: any
}>()
const users = ref([
    { name: 'Usuario 1', offer: '$0.100,00' },
    { name: 'Usuario 2', offer: '$0.200,00' },
    { name: 'Usuario 3', offer: '$0.300,00' },
    { name: 'Usuario 4', offer: '$0.400,00' },
])
</script>
<template>
    <div class="text-left">
        <h2
            class="text-[#152A3C] text-[17px] md:text-[20px] font-[700] py-[16px] uppercase tracking-tight leading-[28px]">
            {{ offerDetail.title }} - MARCA:{{
                offerDetail.carModel.carBrand.name
            }}
            MODELO:{{ offerDetail.carModel.name }} - AÑO {{ offerDetail.year }}
        </h2>
        <div class="grid gap-y-[8px] font-[400] text-[#454446] text-[14px]">
            <div class="flex gap-x-[8px]">
                <CustomIcons name="home-work-detail" class="mb-[1px]" />
                <p class="leading-[24px]">{{ offerDetail.organization.name }}</p>
            </div>
            <div class="flex gap-x-[8px]">
                <CustomIcons name="location" class="w-[16px] mb-[1px]" />
                <p class="leading-[24px]">{{ offerDetail.address.district.name }}</p>
            </div>
        </div>
        <div class="grid pt-[24px] pb-[16px] gap-y-[8px] border-b-2 border-[#E6E6E7]">
            <p class="font-[700] leading-[24px]">OFERTA INICIAL</p>
            <p class="font-[700] text-[22px] md:text-[24px] leading-[32px]">
                USD${{ offerDetail.initialValue }}
            </p>
        </div>
        <div class="grid gap-y-[16px] font-[400] text-[#152A3C] text-[14px] mt-4">
            <div class="flex text-[14px] leading-[12px] gap-x-[8px]">
                <h3 class="font-[700] uppercase">Puja ganadora</h3>
                <p class="font-[500]">USD $0.000,00</p>
            </div>
            <div class="grid gap-y-[12px]">
                <h3 class="leading-[14px] font-[700] uppercase">Puja anteriores</h3>
                <div v-for="user in users" :key="user.name">
                    <div class="flex justify-between leading-[10px] font-[400]">
                        <p>{{ user.name }}</p>
                        <span>USD {{ user.offer }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
