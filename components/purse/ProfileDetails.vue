<template>
    <div class="flex flex-row justify-between pt-[24px] pb-[26px] px-[24px] rounded-xl bg-white w-full">
        <div>
            <h1 class="text-[20px] font-[700] leading-[28px] text-primary mb-[16px] leading-[8px]">Jorge Palacios</h1>
            <div class="flex item-center">
                <CustomIcons name="person-pin" class="w-6 h-6" />
                <p class="text-[14px] text-[#20445E] font-[700]">Usuario <span class="text-[#68686C] font-[500]">MAPACHE508</span></p>
            </div>
        </div>
        <div class="h 10 w 10">
            <Button variant="default" @click="">
                Editar
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter();
</script>