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
                  <DropdownMenuItem @click="openModal(row.id)">
                    Detalle solicitud
                    <CustomIcons name="EyeIcon" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleUpdateRequest(row)">
                    Editar solicitud
                    <CustomIcons name="Pen" class="ml-auto" />
                  </DropdownMenuItem>
                  <!-- <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleReject(row)">
                    Rechazar solicitud
                    <CustomIcons name="X" class="ml-auto" />
                  </DropdownMenuItem> -->
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
        <!-- Modal de Detalle de Solicitud -->
        <SheetContent
          v-model:open="openDetailModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <RequestDetailForm
            :id="rechargeId"
            :on-authorize="handleAuthorize"
            :on-reject="handleOpenRejectModal"
            :participant-id="rechargeId"
            @on-reject="handleOpenRejectModal"
          />
        </SheetContent>

        <!-- Modal de Editar Solicitud -->
        <SheetContent
          v-model:open="openEditModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <EditRequestForm
            :id="rechargeId"
            :onsubmit="handleUpdate"     
            @update:model-value="openEditModal = false"      
          />
        </SheetContent>

        <!-- Modal de Detalle Participante -->
        <SheetContent
          v-model:open="openParticipantModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <ParticipantDetailForm :participant-id="rechargeId" />
        </SheetContent>

        <!-- Modal para rechazar recarga -->
       <ModalRejectRecharge
          :id="selectedRejectInfo.id"
          v-model="openRejectModal"
          :refresh-table="refreshRecharTable"
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
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import RequestDetailForm from '~/components/attention-tray/top-up-requests/RequestDetailForm.vue'
import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue'
import EditRequestForm from '~/components/attention-tray/top-up-requests/EditRequestForm.vue'
import ModalRejectRecharge from '~/components/attention-tray/top-up-requests/ModalRejectRecharge.vue'
import {
  rechargeStatus,
  rechargeHeader,
  rechargeSearch,
} from '~/constants/attention-tray'
import { IuseRecharge } from '@/composables/useRecharge'
import { useTopUpRequests } from '~/composables/useTopUpRequests'
import { useAPI } from '~/composables/useAPI'

// Variables de estado para los modales
const openDetailModal = ref(false)
const openEditModal = ref(false)
const openParticipantModal = ref(false)
const openRejectModal = ref(false)
const openAnnulModal = ref(false) 
const rechargeId = ref<number | undefined>(undefined)
const rejectDetails = ref(null)

// Funciones para manejar los modales
const openModal = (rowId: number) => {
  rechargeId.value = rowId
  openDetailModal.value = true
}
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
//Modal de rechazo
const selectedRejectInfo = ref<any>({
  id:'',
  rejection: null,
  comment: null,
})
const handleReject = async (values: any) => {
  openConfirmModal({
    title: 'Rechazar solicitud de recarga',
    message: '¿Está seguro que desea rechazar la solicitud de recarga?',
    callback: async () => {
      const { status, error }: any = await rejectRechargeRequest({
        id: values.id,
        rejectionReason: 'Rechazado por el administrador',
      })
      if (status.value === 'success') {
        openAnnulModal.value = false
        refreshRecharTable()
        updateConfirmModal({
          title: 'Solicitud de recarga rechazada',
          message: 'Se ha rechazado la soliciud de recarga',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El solicitud de recarga no se pudo rechazar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al rechazar la solicitud de recarga',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleApprove = async (values: any) => {
  openConfirmModal({
    title: 'Aprobar solicitud de recarga',
    message: '¿Está seguro que desea aprobar la solicitud de recarga?',
    callback: async () => {
      const { status, error }: any = await rejectRechargeRequest({
        id: values.id,
        rejectionReason: 'Rechazado por el administrador',
      })
      if (status.value === 'success') {
        openAnnulModal.value = false
        refreshRecharTable()
        updateConfirmModal({
          title: 'Solicitud de recarga rechazada',
          message: 'Se ha rechazado la soliciud de recarga',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El solicitud de recarga no se pudo rechazar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al rechazar la solicitud de recarga',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const openModalEditRequest = (rowId: number) => {
  rechargeId.value = rowId
  openEditModal.value = true
}

const openParticipantDetail = (row: any) => {
  rechargeId.value = row.participantId
  console.log('Abriendo detalle del participante:', row.participantId)
  openParticipantModal.value = true
}

// Data y API
const {
  page,
  onSort,
  onSearch,
  filterOptions,
  sortOptions,
  authorizeRechargeRequest,
  rejectRechargeRequest,
} = useTopUpRequests()
const { autorizationRecharge, updateRecharge  } = IuseRecharge()
const BASE_RECHAR_URL = '/finance/recharge-request-management'
const { data, refresh: refreshRecharTable }: any = await useAPI(
  `${BASE_RECHAR_URL}/view-paginated-recharge-requests`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const rechargeData = computed(() =>
  data.value?.data.map((item: any) => ({
    fullName: item.participant.commonName,
    ...item,
    transferedAt: dayjs(item.transferedAt).format('YYYY-MM-DD'),
    updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD'),
  })),
)

// Manejo de acciones detalle solicitud
const handleAuthorize = async (values:any) => {
  openConfirmModal({
    title: 'Autorizar recarga',
    message: '¿Estás seguro deseas confirmar este lote de desembolso?',
    callback: async () => {
      const { status, error } = await autorizationRecharge(values);
      if (status.value === 'success') {
        openEditModal.value = false
        refreshRecharTable();
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

const handleOpenRejectModal = (details: any) => {
  selectedRejectInfo.value = {
    id: details.id,
    rejection: details.rejectionReason || null,
    comment: details.comment || null,
  };
  openRejectModal.value = true;
};
// Manejo de acciones editar solicitud
const handleUpdateRequest = async (row: any) => {
  rechargeId.value = row.id
  openEditModal.value = true
}
const handleUpdate = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar solicitud',
    message: '¿Estás seguro de que deseas actualizar esta solicitud?',
    callback: async () => {
      const { status, error } = await updateRecharge(values)
      if (status.value === 'success') {
        openEditModal.value = false
        refreshRecharTable()
        updateConfirmModal({
          title: 'Solicitud actualizada',
          message: 'La solicitud ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error?.value?.data?.errors?.[0]?.message ||
          error?.value?.data?.message ||
          'La solicitud no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar solicitud',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
