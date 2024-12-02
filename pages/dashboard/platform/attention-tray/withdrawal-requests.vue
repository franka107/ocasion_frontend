<template>
  <ContentLayout title="Retiros">
    <CustomSimpleCard
      title="Listado de retiros"
      class="mb-6"
      sub-title="Vizualización de las retiros realizadas por los participantes"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="withDrawalRequeststData"
          :header="withdrawalRequeststHeader"
          :search="withdrawalRequestsSearch"
          @on-sort="onSort"
          @on-search="onSearch"
          class="mb-4"
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
                  <DropdownMenuItem @click="openWithdrawalDetails(row.id)">
                    Detalle solicitud
                    <CustomIcons name="EyeIcon" class="ml-auto" />
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
            <div class="flex items-center justify-center" @click="">
              <CustomIcons name="Doc-Loupe" />
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
          v-model:open="openWithdrawalDetailsModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <WithdrawalDetailsForm
            v-model="openWithdrawalDetailsModal"
            id="rechargeId"
            @submit="onWithdrawalDetailsSubmit"
          />
        </SheetContent>
        <SheetContent
          v-model:open="openParticipantModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <ParticipantDetailEditForm
            :participant-id="rechargeId"
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
import { ref } from 'vue'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type { OrganizationItem } from '~/types/Order.ts'
import {
  rechargeStatus,
  withdrawalRequeststHeader,
  withdrawalRequestsSearch,
} from '~/constants/attention-tray'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import ParticipantDetailEditForm from '~/components/attention-tray/withdrawal-requests/ParticipantDetailEditForm.vue'
import WithdrawalDetailsForm from '~/components/attention-tray/withdrawal-requests/WithdrawalDetailsForm.vue'
import dayjs from 'dayjs'

const openParticipantModal = ref(false)
const openEditModal = ref(false)
const selectedRequestId = ref<string | null>(null)
const openWithdrawalDetailsModal = ref(false)
const rechargeId = ref<number | undefined>(undefined)
const openWithdrawalDetails = (requestId: string) => {
  selectedRequestId.value = requestId
  openWithdrawalDetailsModal.value = true
}
const onWithdrawalDetailsSubmit = (formData: any) => {
  console.log('Detalle de solicitud enviado:', formData)
  openWithdrawalDetailsModal.value = false
}
const selectedParticipantId = ref<string | null>(null)
const openModalEditRequest = (rowId: number) => {
  rechargeId.value = rowId
  openEditModal.value = true
}
const openParticipantDetail = (row: any) => {
  const participantId = row.participant?.id;
  if (participantId) {
    rechargeId.value = participantId;
    console.log('Abriendo detalle del participante:', participantId);
    openParticipantModal.value = true;
  } else {
    console.error('No se encontró el participante para esta fila.');
  }
};

const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const rechargeModal = ref<any>({ offerId: '' })
const { page, onSort, onSearch, filterOptions, sortOptions } =
  useWithdrawalRequests()
const BASE_WITH_URL = '/finance/withdrawal-request-management'
const { data, refresh }: any = await useAPI(
  `${BASE_WITH_URL}/view-paginated-withdrawal-requests`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)
const withDrawalRequeststData = computed(() =>
  data.value?.data.map((item: any) => ({
    fullName: item.participant.commonName,
    ...item,
    //transferedAt: dayjs(item.transferedAt).format('YYYY-MM-DD'),
    createdAt: dayjs(item.updatedAt).format('YYYY-MM-DD'),
  })),
)
// const handleEdit = async (values: any) => {
//   openConfirmModal({
//     title: 'Actualizar participante',
//     message: '¿Estás seguro de que deseas actualizar este participante?',
//     callback: async () => {
//       const { status, error }: any = await editEvent(values)
//       if (status.value === 'success') {
//         openEventModal.value = false
//         refresh()
//         updateConfirmModal({
//           title: 'Participante actualizada',
//           message: 'El participante ha sido actualizado exitosamente',
//           type: 'success',
//         })
//       } else {
//         const eMsg =
//           error.value.data?.errors?.[0].message ||
//           error.value.data.message ||
//           'El participante no se pudo actualizar, intentalo más tarde'
//         updateConfirmModal({
//           title: 'Error al crear evento',
//           message: eMsg,
//           type: 'error',
//         })
//       }
//     },
//   })
// }
</script>
