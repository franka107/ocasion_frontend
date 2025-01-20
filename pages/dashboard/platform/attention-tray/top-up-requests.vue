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
          <template #createdAt="{ row }">
            <div
              class="flex-col hover:text-gray-900 transition-colors duration-200 flex items-center space-x-2"
            >
              <span class="">{{
                dayjs(row.createdAt).format('YYYY-MM-DD')
              }}</span>
              <span class="text-xs text-gray-500">{{
                dayjs(row.createdAt).format('HH:mm')
              }}</span>
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
                  <DropdownMenuItem @click="openModal(row.id)">
                    Detalle solicitud
                    <CustomIcons name="EyeIcon" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="handleUpdateRequest(row)">
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
            <div class="flex items-center justify-center">
              <NuxtLink
                v-if="row.sustentationFile?.path"
                :to="row.sustentationFile.path"
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
        <!-- Modal de Detalle Participante Natural -->
        <SheetContent
          v-model:open="openParticipantModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <ParticipantDetailForm :participant-id="rechargeId" />
        </SheetContent>

        <!-- Modal de Detalle Participante Jurídico -->
        <SheetContent
          v-model:open="openJuridicModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <JuridicDetailForm :participant-id="rechargeId" />
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
import JuridicDetailForm from '~/components/attention-tray/top-up-requests/JuridicDetailForm.vue'
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
import type { IRecharge } from '~/types/Recharge'
import type { IDataResponse } from '~/types/Common'
// Variables de estado para los modales
const openDetailModal = ref(false)
const openEditModal = ref(false)
const openParticipantModal = ref(false)
const openJuridicModal = ref(false)
const openRejectModal = ref(false)
const rechargeId = ref<number | undefined>(undefined)
const rejectDetails = ref(null)

// Funciones para manejar los modales
const openModal = (rowId: number) => {
  rechargeId.value = rowId
  openDetailModal.value = true
}
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
// Modal de rechazo
const selectedRejectInfo = ref<any>({
  id: '',
  rejection: null,
  comment: null,
})

const openParticipantDetail = (row: any) => {
  rechargeId.value = row.participantId

  if (row.participant?.personType === 'NATURAL_PERSON') {
    console.log('Abriendo detalle del participante natural:', row.participantId)
    openParticipantModal.value = true
  } else if (row.participant?.personType === 'JURIDIC_PERSON') {
    console.log(
      'Abriendo detalle del participante jurídico:',
      row.participantId,
    )
    openJuridicModal.value = true
  } else {
    console.error('Tipo de persona desconocido:', row.participant?.personType)
  }
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
const { autorizationRecharge, updateRecharge } = IuseRecharge()
const BASE_RECHAR_URL = '/finance/recharge-request-management'
const { data, refresh: refreshRecharTable } = await useAPI<
  IDataResponse<IRecharge>
>(() => `${BASE_RECHAR_URL}/view-paginated-recharge-requests`, {
  query: {
    limit: 8,
    page,
    filterOptions,
    sortOptions,
  },
} as any)

const rechargeData = computed(() =>
  data.value?.data.map((item: IRecharge) => ({
    fullName: item.participant.commonName,
    ...item,
    transferedAt: dayjs(item.transferedAt).format('YYYY-MM-DD'),
    updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD'),
  })),
)

// Manejo de acciones detalle solicitud
const handleAuthorize = async (values: any) => {
  openConfirmModal({
    title: 'Autorizar recarga',
    message: '¿Estás seguro deseas confirmar este lote de desembolso?',
    callback: async () => {
      const { status, error } = await autorizationRecharge(values)
      if (status.value === 'success') {
        openEditModal.value = false
        refreshRecharTable()
        updateConfirmModal({
          title: 'Recarga autorizada',
          message: 'Se ha autorizado la recarga',
          type: 'success',
        })
      } else {
        const eMsg =
          error?.value?.data?.errors?.[0]?.message ||
          error?.value?.data?.message ||
          'La recarga no se pudo confirmar, inténtalo más tarde'

        updateConfirmModal({
          title: 'Error al confirmar recarga',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleOpenRejectModal = (details: any) => {
  selectedRejectInfo.value = {
    id: details.id,
    rejection: details.rejectionReason || null,
    comment: details.comment || null,
  }
  openRejectModal.value = true
}
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
