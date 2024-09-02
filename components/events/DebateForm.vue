
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OfferListItem } from "~/types/Offer";
const { discussOffer } = useOfferAPI();
const { openConfirmModal, updateConfirmModal } = useConfirmModal();
const openDiscussModal = ref(false);
const selectedOffer = ref<OfferListItem | null>(null);
const counterProposal = ref<number | null>(null);
const refresh = () => {

};
const closeDiscussModal = () => {
  openDiscussModal.value = false;
  counterProposal.value = null;
};

const handleConfirmDiscuss = ( appraisal: string,name: string) => {
  openConfirmModal({
    title: "Discutir oferta",
    message: `¿Estás seguro de querer discutir la oferta con un monto de contrapropuesta de ${name}?`,
    callback: async () => {
  
      const { status, error }: any = await discussOffer(JSON.stringify(appraisal));

      if (status === "success") {
        updateConfirmModal({
          title: "¡Oferta discutida exitosamente!",
          message: "La oferta ha sido discutida con éxito.",
          type: "success",
        });
        if (refresh) {
          await refresh();
        }
      } else {
        updateConfirmModal({
          title: "Error al discutir la oferta",
          message: "No se pudo discutir la oferta. \nTe recomendamos intentarlo nuevamente.",
          type: "error",
        });
        console.error("Error al discutir la oferta", error);
      }
    },
  });
};
</script>

<template>
    <SheetContent
        v-model:open="openDiscussModal"
        class="flex flex-col h-full"
        @pointer-down-outside="(e: Event) => e.preventDefault()"
        @interact-outside="(e: Event) => e.preventDefault()"
    >
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Debate de precios</h2>
        <hr class="mb-4"/>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Nombre del evento</label>
          <input
            type="text"
            class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            :value="selectedOffer?.eventName"
            disabled
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Tasación</label>
          <input
            type="text"
            class="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            :value="selectedOffer?.valuation"
            disabled
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Contrapropuesta</label>
          <input
            type="number"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            v-model="counterProposal"
          />
        </div>
        <div class="flex justify-end space-x-4">
          <Button @click="closeDiscussModal" variant="default">Cancelar</Button>
          <Button @click="handleConfirmDiscuss" variant="primary">Confirmar</Button>
        </div>
      </div>
    </SheetContent>
  </template>