<script setup lang="ts">
import { ref } from "vue";
import { X } from "lucide-vue-next";
const props = defineProps<{ offerId: string }>();
const dateHistory = ref<
  Array<{
    id: string;
    user: { fullName: string };
    initialAmount: number;
    modifiedAmount: number;
    createdAt: string;
  }>
>([]);

const fetchBidHistory = async (offerId: string) => {
  try {
    const { data } = await useAPI("/audit/find-audit-histories", {
      default: () => [],
      query: {
        filterOptions: JSON.stringify([
          { field: "offer.id", type: "equal", value: offerId },
        ]),
      },
    });
    dateHistory.value = data.value.map((item: any) => ({
      id: item.id,
      user: item.user,
      initialAmount: item.initialAmount,
      modifiedAmount: item.modifiedAmount,
      createdAt: new Date(item.createdAt).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));
  } catch (error) {
    console.error("Error al cargar historial", error);
  }
};
await fetchBidHistory(props.offerId);
</script>

<template>
  <SheetHeader>
    <SheetClose class="mr-4 rounded-full p-3 hover:bg-[#f1f5f9]">
      <X class="w-4 h-4 text-muted-foreground" />
    </SheetClose>
    <SheetTitle class="text-xl font-medium text-[#64748B]"
      >Historial de tasaciones
    </SheetTitle>
  </SheetHeader>
  <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col">
    <!-- Formulario Historial-->
    <form class="flex flex-col gap-4 flex-grow p-5" @submit.prevent>
      <div class="mt-4">
        <ul class="space-y-6">
          <li v-for="item in dateHistory" :key="item.id" class="flex flex-col">
            <div class="flex items-center mb-[16px]">
              <CustomIcons name="Circle" class="mr-[4px]" />
              <div class="text-[#68686C] text-xs">{{ item.createdAt }}</div>
            </div>
            <div
              class="border-l-2 border-dashed border-[#225B82] pl-3 ml-[4px]"
            >
              <div class="flex items-center">
                <div class="text-xs text-[#225B82] font-semibold pr-[8px]">
                  USUARIO
                </div>
                <div class="text-sm text-[#152A3C] font-[500]">
                  {{ item.user.fullName }}
                </div>
              </div>
              <div
                class="flex justify-between text-xs text-[#225B82] font-[500]"
              >
                <div>MONTO INICIAL</div>
                <div>MONTO MODIFICADO</div>
              </div>
              <div class="flex justify-between">
                <div class="text-[#152A3C] font-[500]">
                  $ {{ item.initialAmount.toLocaleString() }}
                </div>
                <div class="text-[#152A3C] font-[500]">
                  $ {{ item.modifiedAmount.toLocaleString() }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>
