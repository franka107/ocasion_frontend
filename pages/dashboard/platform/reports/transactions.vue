<template>
    <ContentLayout title="Reporte de transacciones (Global)">
      <TransactionsDetails />
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="transactionsData"
            :header="transactionsHeader"
            :search="transactionsSearch"
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
                    <DropdownMenuItem>
                       <NuxtLink
                        class="flex justify-between w-full"
                        :to="`/dashboard/platform/events/${row.id}`"
                        >
                        Estado de cuenta
                        <CustomIcons name="EyeIcon" class="ml-[14px]" />
                      </NuxtLink>
                    </DropdownMenuItem>               
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </template>
            <template #livelihood="{ row }">
              <div
                class="flex items-center justify-center"
                @click=""
              >
                <CustomIcons
                  name="Doc-Loupe"
                />
              </div>
            </template>
            <template #status="{ row }">
              <CustomChip
              :text="transactionsStatus.get(row.status)?.name || ''"
              :variant="transactionsStatus.get(row.status)?.color as any"
              ></CustomChip>
            </template>
          </CustomTable>
          <SheetContent
            v-model:open="openApplicationModal"
            class="flex flex-col h-full"
            custom-width="510px"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
            >
            <ApplicationForm
            :isEditing="!isEditing" 
            :title="isEditing ? 'Editar solicitud' : 'Detalle solicitud'"
            :on-submit="onSubmit"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openParticipantModal"
            class="flex flex-col h-full"
            custom-width="510px"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <ParticipantDetailForm 
            :onSubmit="onParticipantSubmit" 
            />
          </SheetContent>
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
    transactionsStatus,
    transactionsHeader,
    transactionsSearch,
  } from '~/constants/reports'
  import ContentLayout from '~/layouts/default/ContentLayout.vue'
  import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
  import ApplicationForm from '~/components/attention-tray/top-up-requests/ApplicationForm.vue'
  import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue'
  import { ref } from 'vue' 
  import TransactionsDetails from '~/components/reports/transactions/TransactionsDetails.vue'
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
    fullName:'Jose Perez Perez',
    document:'DNI 87654321',
    typeOfOperation:'Recarga de monedero',
    dateOfOperation: '2024-11-01',
    amount: '$ 1’000.00',
    status: 'AUTHORIZED',
    actions: '',
  },
  {
    id: '000',
    fullName:'Rosi Ferri Lombardi',
    document:'DNI 43544321',
    typeOfOperation:'Retiro de saldo',
    dateOfOperation: '2024-12-01',
    amount: '$ 1’000.00',
    status: 'ABANDONED',
    actions: '',
  },
];
const transactionsData = computed(() => data);
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
  