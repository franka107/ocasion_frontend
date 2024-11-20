<template>
    <ContentLayout title="Recargas">
      <CustomSimpleCard
        title="Listado de recargas"
        class="mb-6"
        sub-title="Vizualización de las recargas realizadas por los participantes"
      />
  
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="rechargeData"
            :header="rechargeHeader"
            :search="rechargeSearch"
            @on-sort="onSort"
            @on-search="onSearch"
          >
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
                        @click="openModal(true)"
                      >
                        Detalle solicitud
                        <CustomIcons name="EyeIcon" class="ml-auto" />
                    </DropdownMenuItem>               
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        :disabled="row.status === 'ACTIVE'"
                        @click="openModal(false)"
                      >
                       Editar solicitud
                        <CustomIcons name="Pen" class="ml-auto" />
                      </DropdownMenuItem>
                    <DropdownMenuSeparator />
                      <DropdownMenuItem @click="openParticipantDetail(row)">
                        Detalle participante
                        <CustomIcons name="EyeIcon" class="ml-[10px]" />
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
              :text="rechargeStatus.get(row.status)?.name || ''"
              :variant="rechargeStatus.get(row.status)?.color as any"
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
    rechargeStatus,
    rechargeHeader,
    rechargeSearch,
  } from '~/constants/attention-tray'
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
    id: '12345',
    dateOfRequest: '2024-11-01',
    contractStartDate: '2024-12-01',
    operation: '54321',
    transfer: '2024-11-10',
    amount: '1500.00',
    livelihood: 'Documento ABC',
    status: 'EARRING',
    actions: '',
  },
  {
    id: '67890',
    dateOfRequest: '2024-10-25',
    contractStartDate: '2024-11-01',
    operation: '98765',
    transfer: '2024-10-30',
    amount: '3000.00',
    livelihood: 'Documento XYZ',
    status: 'EARRING',
    actions: '',
  },
];
const rechargeData = computed(() => data);
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
  