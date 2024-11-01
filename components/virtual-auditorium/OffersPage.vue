<script setup lang="ts">
import AuditoriumList from '~/components/virtual-auditorium/AuditoriumList.vue'
import OfferDetailsItem from '~/components/virtual-auditorium/OfferDetailsItem.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
const options = ["Todos", "Finalizado", "Por vencer"];
</script>

<template>
    <section class="flex gap-x-[16px] w-full max-w-[1324px]">
        <div class="max-w-[901px]">
            <div class="flex h-[56px] items-center text-[#152A3C] justify-end mb-[8px] gap-x-[10px] px-[8px]">
                <label class="font-[600] text-[14px] md:text-[16px] leading-[24px]">Ordenar por:</label>
                <Select>
                    <SelectTrigger
                        class="max-w-[180px] text-[12px] md:text-[16px] font-[400] border border-[#CBD5E1] rounded-md p-2 text-[#152A3C]">
                        <SelectValue placeholder="Todos" class="max-w-[180px]"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="option in options" :key="option" :value="option"
                            class="flex justify-center text-center rounded-[8px] font-[500] text-[12px] md:text-[14px] p-[5px] text-[#152A3C] hover:bg-[#F1F5F9]">
                            {{ option }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <AuditoriumList />
            <CustomPagination 
              class="mt-[32px]"
             :total="1"
             :limit="1"
            />
        </div>
            <OfferDetailsItem  class="hidden xl:block"/>
    </section>
</template>
