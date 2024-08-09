<template>
    <div class="py-4 px-10 rounded-xl bg-white w-full">
        <h1 class="mb-3 text-2xl font-bold text-primary">Gestión de eventos</h1>
        <p class="text-[18px] text-[#68686C]">Crea y gestiona tus eventos</p>
    </div>
    <div class="mt-4 grid grid-cols-[212px,_1fr,_1fr] gap-x-4">
        <div class="bg-white rounded-xl p-6 max-w-[212px]">
            <h2 class="text-xl font-semibold text-primary">Eventos</h2>
            <div class="flex mt-8 mx-2 justify-between">
                <div>
                    <div class="text-[#64748B] text-sm">En linea</div>
                    <div class="text-primary text-4xl"><pre>{{ data.status.onlineCount }}</pre></div>
                </div>
                <div>
                    <div class="text-[#64748B] text-sm">Cerrados</div>
                    <div class="text-primary text-4xl">{{ data.status.closedCount }}</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-6">
            <h2 class="text-xl font-semibold text-primary">Bienes subastados</h2>
            <div class="flex mt-8 mx-2 justify-around">
                <div>
                    <div class="text-[#64748B] text-sm">Cerrados</div>
                    <div class="text-primary text-4xl">{{ data.actionedGoods.closedCount }}</div>
                </div>
                <div>
                    <div class="text-[#64748B] text-sm">Ticket promedio</div>
                    <div class="text-primary text-4xl"><sup>S/</sup>{{ formatCurrency(data.actionedGoods.averageTicketAmount) }}</div>
                </div>
                <div>
                    <div class="text-[#64748B] text-sm">Monto recaudado</div>
                    <div class="text-primary text-4xl"><sup>S/</sup>{{ formatCurrency(data.actionedGoods.amountRaised) }}</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-6 ">
            <h2 class="text-xl font-semibold text-primary">Meta</h2>
            <div class="flex mt-8 mx-2 justify-around">
                <div>
                    <div class="text-[#64748B] text-sm">Ticket promedio</div>
                    <div class="text-primary text-4xl"><sup>S/</sup>{{ formatCurrency(data.goal.goalAmount) }}</div>
                </div>
                <div>
                    <div class="text-[#64748B] text-sm">Monto recaudado</div>
                    <div class="text-primary text-4xl"><sup>S/</sup>{{ formatCurrency(data.goal.amountRaised) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { IOrganizationSummary } from '@/types/Event';

defineProps<{data: IOrganizationSummary}>()

</script>