<template>
  <ContentLayout title="Validación de cuentas">
    <CustomSimpleCard
      title="Listado de validación de cuentas"
      class="mb-6"
      sub-title="Vizualización de las validaciones de cuentas"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          class="mb-4"
          :data="accountData"
          :header="accountHeader"
          :search="accountSearch"
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
                  <DropdownMenuItem @click="openAccountDetail(row)">
                    Detalle de cuenta
                    <CustomIcons name="EyeIcon" class="ml-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #livelihood="{ row }">
            <div class="flex items-center justify-center" @click="">
              <CustomIcons name="Doc-Loupe" />
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="accountStatus.get(row.status)?.name || ''"
              :variant="accountStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
        </CustomTable>
        <SheetContent
          v-model:open="openAccountDetailModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <AccountDetailsForm
            v-model="openAccountDetailModal"
            :id="accountId"
            :on-authorize="handleApproval"
            :on-reject="handleOpenRejectModal"
            @on-reject="handleOpenRejectModal"
          />
        </SheetContent>
        <ModalRejectAccount
          :id="selectedRejectInfo.id"
          v-model="openRejectModal"
          :refresh-table="refresh"
          @update:model-value="openRejectModal = false"
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
import { ref } from 'vue'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import ModalRejectAccount from '~/components/attention-tray/account-validation/ModalRejectAccount.vue'
import type { OrganizationItem } from '~/types/Order.ts'
import {
  accountStatus,
  accountHeader,
  accountSearch,
} from '~/constants/attention-tray'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import AccountDetailsForm from '~/components/attention-tray/account-validation/AccountDetailsForm.vue'
import dayjs from 'dayjs'
import { useAccountValidation } from '@/composables/useAccountValidation'
import type { IAccountLItem } from '~/types/Account'
import type { IDataResponse } from '~/types/Common'
const openRejectModal = ref(false)
const {
    page,
    onSort,
    onSearch,
    filterOptions,
    sortOptions,
    approvalAccountBank,
  } = useAccountValidation()
const accountId = ref<number | undefined>(undefined)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()

const BASE_VAL_URL = '/finance/account-validation'
const {  data, refresh } = await useAPI<IDataResponse<IAccountLItem>>(() => `${BASE_VAL_URL}/view-paginated-account-validations`, {
  query: {
    limit: 8,
    page,
    filterOptions,
    sortOptions,
  },
} as any)

const accountData = computed(() =>
  data.value?.data.map((item: IAccountLItem) => ({
    fullName: item.participant.commonName,
    ...item,
    createdAt: dayjs(item.createdAt).format('YYYY-MM-DD'),
  })),
)

const openAccountDetailsModal = ref(false)
const openAccountDetailModal = ref(false)
const openAccountDetail = (row: any) => {
  const accountDetailId = row.id;
  if (accountId) {
    accountId .value = accountDetailId;
    console.log('Abriendo detalle del participante:', accountDetailId);
    openAccountDetailModal.value = true;
  } else {
    console.error('No se encontró el participante para esta fila.');
  }
};
const onAccountDetailSubmit = (formData: any) => {
  console.log('Detalle de solicitud enviado:', formData)
  openAccountDetailModal.value = false
}
// Manejo de acciones detalle solicitud
const handleApproval = async (values:any) => {
  openConfirmModal({
    title: 'Autorizar recarga',
    message: '¿Estás seguro deseas confirmar este lote de desembolso?',
    callback: async () => {
      const { status, error } = await approvalAccountBank(values);
      if (status.value === 'success') {
        openAccountDetailModal.value = false
        refresh();
        updateConfirmModal({
          title: 'Recarga autorizada',
          message: 'Se ha autorizado la recarga',
          type: 'success',
        });
      } else {
        const eMsg =
          error?.value?.data?.errors?.[0]?.message ||
          error?.value?.data?.message ||
          'La recarga no se pudo confirmar, inténtalo más tarde';

        updateConfirmModal({
          title: 'Error al confirmar recarga',
          message: eMsg,
          type: 'error',
        });
      }
    },
  });
};
//Modal de rechazo
const selectedRejectInfo = ref<any>({
  id:'',
  rejection: null,
  comment: null,
})
const handleOpenRejectModal = (details: any) => {
  selectedRejectInfo.value = {
    id: details.id,
    rejection: details.rejectionReason || null,
    comment: details.comment || null,
  };
  openRejectModal.value = true;
};
</script>
