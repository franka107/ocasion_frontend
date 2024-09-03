<template>
    <section>
    <div>
      <CustomTable
        :data="offerData"
        :header="offerHeader"
        :search="offerSearch"
        @onSort="onSort"
        @onSearch="onSearch"
      >
        <template #action-button>
          <Button
            v-if="eventDetail?.status !== CREATED_STATUS"
            @click="
                () => {
                  offerId = undefined;
                  openModal = true;
                }
              "
            variant="default"
          >
            Crear oferta
          </Button>
          <Button
            v-else
            @click="handleViewBids"
            variant="default"
          >
            Ver pujas
          </Button>
        </template>
        <template #attachedFiles>
          <div class="w-10 h-10 flex items-center justify-center rounded-full bg-[#0B38590A]">
            <CustomIcons name="Clip" />
          </div>
        </template>
        <template #actions="{ row }">
          <div class="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 data-[state=open]:bg-accent"
                >
                  <CustomIcons name="VerticalDots" class="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                class="bg-primary text-white"
              >
                <DropdownMenuItem 
                 @click="
                      () => {
                        offerId = row.id;
                        openModal = true;
                      }
                ">
                  Editar
                  <CustomIcons name="Pen" class="ml-auto" />
                </DropdownMenuItem>
                <DropdownMenuItem @click="">
                  Debatir
                  <CustomIcons name="Reload" class="ml-auto" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
        <template #status="{ row }">
          <CustomChip
            :text="offerStatus.get(row.status)?.name || ''"
            :variant="offerStatus.get(row.status)?.color as any"
          ></CustomChip>
        </template>
      </CustomTable>  
    
    <SheetContent
          v-model:open="openModal"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <OfferForm
            :id="offerId"
            :eventId="String(route.params.eventId)"
            :rucId="String(route.params.rucId)"
            :onsubmit="offerId !== undefined ? handleEdit : handleCreate"
          />
    </SheetContent>
     </div>
    </section>
  </template>
  
  
  <script setup lang="ts">
  import { offerHeader, offerStatus, offerSearch } from "@/constants/offer";
  const { openConfirmModal, updateConfirmModal } = useConfirmModal();
  const { page, sortOptions, onSort, createOffer, editOffer } = useOfferAPI();  
  const route = useRoute();
  const { getEvent } = useEvent();
  const offerId = ref(undefined);
  const showBids = ref(false); 
  const offerData = ref([]);
  const openModal = ref(false);
  const BASE_OFFERS_URL = "/offer-management";
  const CREATED_STATUS = "CREATED";
  
  const filterOptions = ref(
  `[{ "field": "event.id", "type": "equal", "value": "${route.params.eventId}" }]`,
);
    const filterOptions2 = ref(
    `[{ "field": "id", "type": "like", "value": "${route.params.eventId}" }]`,
    );

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [{ field: "title", type: "like", value: item.title || "" }];
    filterOptions.value = JSON.stringify(filters);
  };
  Promise.all([
  getEvent(route.params.eventId as string),
  useAPI(`${BASE_OFFERS_URL}/find-offers`, {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions: "[]",
    },
  } as any),
    ]);
    // [] = await Promise.all
  const { data, refresh }: any = await useAPI(`${BASE_OFFERS_URL}/find-offers`, {
    query: {
        limit: 8,
        page,
        filterOptions,
        sortOptions,
    },
    } as any);

  const { data: eventDetail } = await getEvent(route.params.eventId as string);

  const handleCreate = async (values: any) => {
    openConfirmModal({
        title: "Crear Oferta",
        message: "¿Estás seguro de que deseas crear este Oferta?",
        callback: async () => {
        const { status, error }: any = await createOffer(values);
        if (status.value === "success") {
            openModal.value = false;
            refresh();
            updateConfirmModal({
            title: "Oferta creada",
            message: "La oferta ha sido creada exitosamente",
            type: "success",
            });
        } else {
            const eMsg =
            error.value.data?.errors?.[0].message ||
            error.value.data.message ||
            "La oferta no se pudo crear, intentalo más tarde";
            updateConfirmModal({
            title: "Error al crear Oferta",
            message: eMsg,
            type: "error",
            });
        }
        },
    });
    };

  const handleEdit = async (values: any) => {
    openConfirmModal({
        title: "Actualizar Oferta",
        message: "¿Estás seguro de que deseas actualizar este Oferta?",
        callback: async () => {
        const { status, error }: any = await editOffer(values);
        if (status.value === "success") {
            openModal.value = false;
            refresh();
            updateConfirmModal({
            title: "Oferta actualizada",
            message: "La oferta ha sido actualizado exitosamente",
            type: "success",
            });
        } else {
            const eMsg =
            error.value.data?.errors?.[0].message ||
            error.value.data.message ||
            "El evento no se pudo actualizar, intentalo más tarde";
            updateConfirmModal({
            title: "Error al crear evento",
            message: eMsg,
            type: "error",
            });
        }
        },
    });
    };
  
    // Datos de puja 
    const refreshBids = async () => {
    const { data: bidData }: any = await useAPI(`${BASE_OFFERS_URL}/find-offers-with-bid-paginated`, {
        query: {
        limit: 10,
        page,
        filterOptions2,
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
  </script>