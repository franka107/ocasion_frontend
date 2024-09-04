<!-- src/components/events/BidTable.vue -->
<template>
    <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
      <CustomTable
        :data="bidsData"
        :header="bidsHeader"
        :search="bidsSearch"
        @onSort="onSort"
        @onSearch="onSearch"
      >
        <template #action-button>
          <Button @click="" variant="default" class="bg-white text-primary border border-primary hover:bg-accent">Rechazar puja</Button>
          <Button @click="" class="bg-white text-primary border border-primary hover:bg-accent">Aceptar puja</Button>
          <Button @click="" variant="default">Contraofertar</Button>
        </template>
        <template #actions="{ row }">
          <div class="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="sm" class="h-8 data-[state=open]:bg-accent">
                  <CustomIcons name="VerticalDots" class="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" class="bg-primary text-white">
                <DropdownMenuItem @click="() => {bidsId = undefined;openModal = true;} ">
                  Historial de puja 
                  <CustomIcons name="Reload" class="ml-auto" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #status="{ row }">
          <CustomChip :text="BidStatus.get(row.status) || ''"></CustomChip>
        </template>
      </CustomTable>
      <!-- Formulario de Pujas -->
      <!-- <SheetContent class="flex flex-col h-full" v-model:open="openModal">
        <BindsForm
          :id="bidsId"
          :onSubmit="bidsId !== undefined ? handleViewBidHistory "
        />
      </SheetContent>
        <CustomPagination
        class="mt-5 mb-[19px]"
        :total="data.count"
        :limit="data.limit"
        v-model:page="page"
        />  -->
  </div>
    
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import CustomTable from '../ui/custom-table/CustomTable.vue';
  import Button from '../ui/button/Button.vue';
  import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue';
  import { bidsHeader, bidsSearch, BidStatus } from '@/constants/bids';
  import type { OfferWithBidDto } from '~/types/Bids';
  const BASE_OFFERS_URL = "/offer-management";
  const route = useRoute();
  const bidsId = ref<number | undefined>(undefined);
  const showBids = ref(false); 
  const openModal = ref(false);
  const { page, sortOptions, onSort} = useOfferAPI();
  const bidData = ref([]); 
  const filterOptions = ref(
    `[{ "field": "id", "type": "like", "value": "${route.params.eventId}" }]`,
    );
  const onSearch = (item: { [key: string]: string }) => {
    const filters = [{ field: "tile", type: "like", value: item.title || "" }];
    filterOptions.value = JSON.stringify(filters);
  };
  const bidsData = computed(() => bidData.value.map((item: OfferWithBidDto) => ({
    code: "1",
    date: "DD/MM/AAAA 12:20",
    amount:"10000",
    ...item,
   })),
  );
  // Datos de puja 
  const refreshBids = async () => {
    const { data: bidData }: any = await useAPI(`${BASE_OFFERS_URL}/find-offers-with-bid-paginated`, {
        query: {
        limit: 10,
        page,
        filterOptions,
        sortOptions,
        },
    } as any);
    // bidData.value = bidData.data;
    console.log("Data1", bidData.value); 
  };

  //Funcion cambia vista de pujas
  const handleViewBids = async () => {
    await refreshBids();
    showBids.value = true; 
    console.log("Bids view enabled", showBids.value);
  };
  
//   const handleViewBidHistory = () => {
//     // Lógica para ver el historial de pujas
//   };
  
  </script>
  