<template>
    <ContentLayout title="Balance de cuentas">
      <AccountDetails/> 
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="balanceData"
            :header="balanceHeader"
            :search="balanceSearch"
            @on-sort="onSort"
            @on-search="onSearch"
          >
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
    balanceHeader,
    balanceSearch,
  } from '~/constants/reports'
  import ContentLayout from '~/layouts/default/ContentLayout.vue'
  import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
  import ApplicationForm from '~/components/attention-tray/top-up-requests/ApplicationForm.vue'
  import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue'
  import { ref } from 'vue' 
import AccountDetails from '~/components/reports/account-balance/AccountDetails.vue'
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
    fullName:'Rose Ferrari Pausini',
    income: '1000.00',
    expenses: '1000.00',
    penalties: '1000.00',
    guaranteed: '1000.00',
    balance: '1000.00',
    pendingWithdrawal: '1000.00',
    pendingRecharge:'1000.00',
  },
  {
    fullName:'Bruno Lorezco Poula',
    income: '1000.00',
    expenses: '1000.00',
    penalties: '1000.00',
    guaranteed: '1000.00',
    balance: '1000.00',
    pendingWithdrawal: '1000.00',
    pendingRecharge:'1000.00',
  },
];
const balanceData = computed(() => data);
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
  