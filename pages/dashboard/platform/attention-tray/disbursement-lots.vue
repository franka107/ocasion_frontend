<template>
  <ContentLayout title="Lote de desembolsos">
     <CustomSimpleCard
       title="Listado de lote de desembolsos"
       class="mb-6"
       sub-title="Vizualización de lote de desembolsos de los participantes"
     />
 
     <div class="w-full flex flex-col">
       <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
         <CustomTable
           :data="disbursementData"
           :header="disbursementHeader"
           :search="disbursementSearch"
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
                       @click=" () => {
                         openModalConfirm = true
                         confirmModalInfo = {
                           paymentSupportFile: row.paymentSupportFile,
                           disbursedAt: row.disbursedAt,
                           id: row.id,
                         }
                         }"
                     >
                      Confirmar lote
                       <CustomIcons name="Check" class="ml-4" />
                   </DropdownMenuItem>               
                   <DropdownMenuSeparator />
                   <DropdownMenuItem
                       :disabled="row.status === 'ACTIVE'"
                       @click="handleAnnul(row)"
                     >
                      Anular lote
                       <CustomIcons name="X" class="ml-auto" />
                     </DropdownMenuItem>
                   <DropdownMenuSeparator />
                     <DropdownMenuItem @click="openWithdrawalDetails(row)">
                       Detalle 
                       <CustomIcons name="EyeIcon" class="ml-auto" />
                     </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             </div>
           </template>
           <template #archive="{ row }">
            <div class="flex items-center justify-center">
              <NuxtLink
                  v-if="row.voucherGeneratedFile?.path"
                  :to="row.voucherGeneratedFile.path"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center"
                >
                  <CustomIcons name="Doc-Loupe" />
                </NuxtLink>
                <span v-else>-</span>
            </div>
           </template>
           <template #status="{ row }">
             <CustomChip
             :text="disbursementStatus.get(row.status)?.name || ''"
             :variant="disbursementStatus.get(row.status)?.color as any"
             ></CustomChip>
           </template>
         </CustomTable>
         <SheetContent
          v-model:open="openWithdrawalDetailsModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <DisbursementDetailsForm
            v-model="openWithdrawalDetailsModal"
            :id="disbursementId"
            @submit="onWithdrawalDetailsSubmit"
          />
        </SheetContent>
         <ConfirmDisbursementModal
           :id="confirmModalInfo.id"
           v-model="openModalConfirm"
           :payment-support-file="confirmModalInfo.paymentSupportFile"
           :disbursed-at="confirmModalInfo.disbursedAt"
           :refresh-table="refresh"
         />
       </div>
       <CustomPagination
         v-model:page="page"
         class="mt-5 mb-[19px]"
         :total="data.count"
         :limit="data.limit"
       />
     </div>
   </ContentLayout>
 </template>
 <script setup lang="ts">
 import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
 import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
 import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
 import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
 import type { IGenerateForm } from '~/types/Disbursement'
 import {
     disbursementStatus,
     disbursementHeader,
     disbursementSearch,
 } from '~/constants/attention-tray'
 import dayjs from 'dayjs'
 import ContentLayout from '~/layouts/default/ContentLayout.vue'
 import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
 import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue'
 import GenerateDisbursementBatchModal from '~/components/attention-tray/disbursement-lots/GenerateDisbursementBatchModal.vue'
 import ConfirmDisbursementModal from '~/components/attention-tray/disbursement-lots/ConfirmDisbursementModal.vue'
 import { ref } from 'vue' 
 import { useDisbursement } from '@/composables/useDisbursement'
 import DisbursementDetailsForm from '~/components/attention-tray/disbursement-lots/DisbursementDetailsForm.vue'
 const openApplicationModal = ref(false); 
 const openParticipantModal = ref(false); 
 const {
   page,
   onSort,
   onSearch,
   filterOptions,
   sortOptions,
   annulDisbursement,
 } = useDisbursement()
 const openModalConfirm = ref(false)
 const openAnnulModal = ref(false)
 const openWithdrawalDetailsModal = ref(false)
 const disbursementId = ref<number | undefined>(undefined)
 const selectedRequestId = ref<string | null>(null);

const openWithdrawalDetails = (row: any) => {
  const disbursementDetailId = row.id;
  if (disbursementDetailId) {
    disbursementId.value = disbursementDetailId;
    console.log('Abriendo detalle del participante:', disbursementDetailId);
    openWithdrawalDetailsModal.value = true;
  } else {
    console.error('No se encontró lote');
  }
};
 const onWithdrawalDetailsSubmit = (formData: any) => {
    console.log('Detalle de solicitud enviado:', formData)
    openWithdrawalDetailsModal.value = false
  }
 const { openConfirmModal, updateConfirmModal } = useConfirmModal()
 const BASE_DIS_URL = '/finance/disbursement-management'
 const { data, refresh }: any = await useAPI(
   `${BASE_DIS_URL}/view-paginated-disbursement-lots`,
   {
     query: {
       limit: 8,
       page,
       filterOptions,
       sortOptions,
     },
   } as any,
 )
 
 const disbursementData = computed(() =>
   data.value?.data.map((item: any) => ({   
     ...item,
     createdAt:dayjs(item.createdAt).format('YYYY-MM-DD'),
   })),
 )
 const confirmModalInfo = ref<any>({
   id: '',
   paymentSupportFile: {},
   disbursedAt:{}
 })

 const openParticipantDetail = (row: any) => {
 console.log('Abriendo detalle del participante:', row);
 openParticipantModal.value = true;
 };
 const handleAnnul = async (values: any) => {
   openConfirmModal({
     title: 'Anular lote de desembolso',
     message: '¿Está seguro que desea anular el lote de desembolso?',
     callback: async () => {
       const { status, error }: any = await annulDisbursement(values)
       if (status.value === 'success') {
         openAnnulModal.value = false
         refresh()
         updateConfirmModal({
           title: 'Desembolso anulado',
           message: 'Se ha anulado el lote de desembolso',
           type: 'success',
         })
       } else {
         const eMsg =
           error.value.data?.errors?.[0].message ||
           error.value.data.message ||
           'El desembolso no se pudo anular, intentalo más tarde'
         updateConfirmModal({
           title: 'Error al anular el desembolso',
           message: eMsg,
           type: 'error',
         })
       }
     },
   })
 }
 </script>
 
