<template>
    <div class="flex items-center pt-[24px] pb-[28px] px-10 rounded-xl bg-white w-full">
        <h1 class="text-[20px] font-[700] leading-[28px] text-primary">Mi monedero</h1>
    </div>

    <div class="w-full mt-4 gap-x-4">
        <div class="flex flex-wrap md:flex-nowrap justify-center gap-y-[32px] gap-x-[32px] w-[100%] bg-white rounded-xl px-[16px] py-6 ">
            <div v-for="(card, index) in cardsData" :key="index"
                class="max-w-[356px]  bg-[#F3F8FC] p-4 flex flex-col rounded-[8px] w-full">
                <h4 class="text-[16px] text-[#20445E] font-[500] leading-[10px] mb-[16px]">{{ card.subtitle }}</h4>
                <h3 class="text-[20px] text-[#152A3C] font-bold leading-[14px] mb-[16px]">{{ card.amount }}</h3>
                <p class="font-[400] text-[12px] text-[#86868A] leading-[15px]">{{ card.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();
const cardsData = ref([
    {
        subtitle: 'Saldo disponible',
        amount: '$0.00',
        description: 'Saldo que ha cargado y que puede disponer para uso de garantía en participación de eventos.',
    },
    {
        subtitle: 'Saldo garantizado',
        amount: '$0.00',
        description: 'Saldo que está siendo utilizado como garantía para la participación de uno o más eventos (no puede disponerse).',
    },
    {
        subtitle: 'Saldo Total',
        amount: '$0.00',
        description: 'Suma del saldo que tiene el Monedero.',
    },
])
</script>