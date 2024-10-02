<template>
  <div class="flex items-center py-4 px-10 rounded-xl bg-white w-full">
    <div class="h 10 w 10">
      <Button variant="ghost" @click="router.back">
        <CustomIcons name="BackArrow" class="w-6 h-6 text-primary" />
      </Button>
    </div>
    <div class="ml-7">
      <h1 class="mb-3 text-2xl font-bold text-primary">Gestión de eventos</h1>
      <p class="text-[18px] text-[#68686C]">Crea y gestiona tus eventos</p>
    </div>
  </div>
  
  <div class="mt-4 grid lg:grid-cols-[212px,_1fr,_1fr] sm:grid-cols-1 gap-x-4">
    <div class="bg-white rounded-xl p-6 lg:max-w-[212px] mt-3 lg:mt-0">
      <h2 class="text-xl font-semibold text-primary text-center">Eventos</h2>
      <div class="flex mt-8 mx-2 justify-between">
        <div class="text-center">
          <div class="text-[#64748B] text-sm">En linea</div>
          <div class="text-primary text-4xl mt-2">
            <pre>{{ data.status.onlineCount }}</pre>
          </div>
        </div>
        <div class="text-center">
          <div class="text-[#64748B] text-sm">Cerrados</div>
          <div class="text-primary text-4xl mt-2">{{ data.status.closedCount }}</div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-6 mt-3 lg:mt-0">
      <h2 class="text-xl font-semibold text-primary text-center">Bienes subastados</h2>
      <div class="flex mt-8 mx-2 justify-around flex-wrap gap-4">
        <div class="flex-1 min-w-[120px] text-center">
          <div class="text-[#64748B] text-sm">Cerrados</div>
          <div class="text-primary text-4xl mt-2">
            {{ data.actionedGoods.closedCount }}
          </div>
        </div>
        <div class="flex-1 min-w-[120px] text-center">
          <div class="text-[#64748B] text-sm">Ticket promedio</div>
          <div class="text-primary text-4xl mt-2">
            <sup>$</sup>{{ formatCurrency(data.actionedGoods.averageTicketAmount) }}
          </div>
        </div>
        <div class="flex-1 min-w-[120px] text-center">
          <div class="text-[#64748B] text-sm">Monto recaudado</div>
          <div class="text-primary text-4xl mt-2">
            <sup>$</sup>{{ formatCurrency(data.actionedGoods.amountRaised) }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-white rounded-xl p-6 mt-3 lg:mt-0">
      <h2 class="text-xl font-semibold text-primary text-center">Meta</h2>
      <div class="flex mt-8 mx-2 justify-around">
        <div class="text-center">
          <div class="text-[#64748B] text-sm">Meta esperada</div>
          <div class="text-primary text-4xl mt-2">
            <sup>$</sup>{{ formatCurrency(data.goal.goalAmount) }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-[#64748B] text-sm">Monto recaudado</div>
          <div class="text-primary text-4xl mt-2">
            <sup>$</sup>{{ formatCurrency(data.goal.amountRaised) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IOrganizationSummary } from "@/types/Event";
const router = useRouter();
defineProps<{ data: IOrganizationSummary }>();
</script>
