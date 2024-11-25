<template>
    <ContentLayout title="Reporte de validación de cuentas">
      <CustomSimpleCard
        title="Listado de validación de cuentas"
        class="mb-6"
        sub-title="Vizualización reportes de validación de  cuentas de los participantes"
      />
  
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="validationData"
            :header="validationHeader"
            :search="validationSearch"
            @on-sort="onSort"
            @on-search="onSearch"
          >
          <template #action-button>
                <div class="flex">
                    <Button
                    variant="default"
                    class="text-[#F97316] bg-white hover:text-white hover:bg-[#F97316] mr-[8px]"
                    @click="
                        () => {
                        
                        }
                    "
                    >Mas filtros</Button>
                    <Button
                    variant="default"
                    @click="
                        () => {
                        
                        }
                    "
                    >
                    <CustomIcons name="Download" class="ml-auto" />
                    Exportar
                    </Button>
                </div>
            </template>
          </CustomTable>
        </div>
        <CustomPagination
          v-model:page="page"
          class="mt-5 mb-[19px]"
          :total="1"
          :limit="1"
        />
      </div>
    </ContentLayout>
  </template>
  <script setup lang="ts">
  import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
  import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
  import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
  import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
  import type { OrganizationItem } from '~/types/Order.ts'
  import {
    validationStatus,
    validationHeader,
    validationSearch,
  } from '~/constants/reports'
  import ContentLayout from '~/layouts/default/ContentLayout.vue'
  import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
  import ApplicationForm from '~/components/attention-tray/top-up-requests/ApplicationForm.vue'
  import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue'
  import { ref } from 'vue' 
  const openApplicationModal = ref(false); 
  const openParticipantModal = ref(false); 
  const {
    page,
    onSort,
    onSearch,
  } = useTopUpRequests()
  const onSubmit = (formData: any) => {
    console.log("Formulario enviado:", formData);
    openApplicationModal.value = false; 
  }; 
  const onParticipantSubmit = (formData: any) => {
    console.log('Detalle del participante enviado:', formData);
    openParticipantModal.value = false;
  };
  const rechargeId = ref<number | undefined>(undefined)
  const { openConfirmModal, updateConfirmModal } = useConfirmModal()
  const rechargeModal = ref<any>({ offerId: '' })
  const data = [
  {
    id: '000',
    dateOfRequest: '2024-11-01',
    fullName:'Rose Ferrari Pausini',
    document: 'DNI 87654321',
    bank: 'Banco de crédito del Perú',
    coin: 'Dólar',
    account: '0000 0000 0000 0000',
    status: 'APPROVED',
  },
  {
    id: '000',
    dateOfRequest: '2024-11-01',
    fullName:'Franco Radocio Pausini',
    document: 'DNI 87654321',
    bank: 'Banco de crédito del Perú',
    coin: 'Dólar',
    account: '0000 0000 0000 0000',
    status: 'REJECTED',
  },
];
const validationData = computed(() => data);
const isEditing = ref(false); 
const openModal = (editMode: boolean) => {
  isEditing.value = editMode;
  openApplicationModal.value = true;
};
const openParticipantDetail = (row: any) => {
  console.log('Abriendo detalle del participante:', row);
  openParticipantModal.value = true;
};
  </script>
  