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
          class="mb-4"
          multiple-select
          @on-sort="onSort"
          @on-search="onSearch"
          @on-multiple-select="
            ({ ids, type, resetMultipleSelect: onResetMultipleSelect }) => {
              selectedMultipleData = { ids, type }
              resetMultipleSelect = onResetMultipleSelect
            }
          "
        >
          <template #action-button>
            <Button
              variant="default"
              :disabled="disableMultipleSelect"
              @click="
                () => {
                  openModalGenerate = true
                }
              "
              >Generar lote</Button
            >
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
                  <DropdownMenuItem @click="openWithdrawalDetails(row)">
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
          <template #disbursementLot="{ row }">
            <div class="flex items-center justify-center">
              <NuxtLink
                v-if="row.disbursementLot"
                :to="`/dashboard/platform/attention-tray/disbursement-lots?disbursementLotId=${row.disbursementLot.id}`"
              >
                <Button variant="ghost" class="border rounded-full" size="icon">
                  <Package class="" />
                </Button>
              </NuxtLink>
              <div v-else>
                <span>-</span>
              </div>
            </div>
          </template>
          <template #livelihood="{ row }">
            <div class="flex items-center justify-center" @click="">
              <Layers />
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
            :id="rechargeId"
            v-model="openWithdrawalDetailsModal"
            :on-authorize="handleAuthorize"
            :on-reject="handleOpenRejectModal"
            @on-reject="handleOpenRejectModal"
          />
        </SheetContent>
        <!-- Modal de Detalle Participante Natural -->
        <SheetContent
          v-model:open="openParticipantModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <ParticipantDetailEditForm :participant-id="rechargeId" />
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
        <!-- Modal para rechazar retiro -->
        <ModalRejectWithdrawal
          :id="selectedRejectInfo.id"
          v-model="openRejectModal"
          :refresh-table="refresh"
          @update:model-value="openRejectModal = false"
        />
        <GenerateDisbursementBatchModal
          :id="generateDisbursementForm.id"
          v-model="openModalGenerate"
          :bank="generateDisbursementForm.bank"
          :retire-requests="selectedMultipleData"
          :on-submit="handleGenerateDisbursement"
          :refresh-table="refresh"
        />
      </div>
      <CustomPagination
        v-if="data"
        v-model:page="page"
        class="mt-5 mb-[19px]"
        :total="data.count"
        :limit="data.limit"
        @page-change="refresh"
      />
    </div>
  </ContentLayout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { da } from 'date-fns/locale'
import { Package } from 'lucide-vue-next'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import {
  rechargeStatus,
  withdrawalRequeststHeader,
  withdrawalRequestsSearch,
} from '~/constants/attention-tray'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import ParticipantDetailEditForm from '~/components/attention-tray/withdrawal-requests/ParticipantDetailEditForm.vue'
import WithdrawalDetailsForm from '~/components/attention-tray/withdrawal-requests/WithdrawalDetailsForm.vue'
import GenerateDisbursementBatchModal from '~/components/attention-tray/disbursement-lots/GenerateDisbursementBatchModal.vue'
import ModalRejectWithdrawal from '~/components/attention-tray/withdrawal-requests/ModalRejectWithdrawal.vue'
import type { IWithdrawalItem } from '~/types/Withdrawal'
import type { IDataResponse } from '~/types/Common'

const openParticipantModal = ref(false)
const openEditModal = ref(false)
const openModalGenerate = ref(false)
const openWithdrawalDetailsModal = ref(false)
const openRejectModal = ref(false)
const openJuridicModal = ref(false)
const rechargeId = ref<number | undefined>(undefined)
const {
  page,
  onSort,
  onSearch,
  filterOptions,
  sortOptions,
  requestWithdrawal,
  authorizeWithdrawal,
  rejectWithdrawal,
} = useWithdrawalRequests()
const selectedMultipleData = ref<{ type: string; ids: string[] }>({
  type: 'empty',
  ids: [],
})
const resetMultipleSelect = ref<Function | undefined>(undefined)
const disableMultipleSelect = computed(
  () =>
    selectedMultipleData.value.type === 'empty' &&
    selectedMultipleData.value.ids.length === 0,
)
const openParticipantDetail = (row: any) => {
  rechargeId.value = row.participant?.id

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

const openWithdrawalDetails = (row: any) => {
  const requestId = row.id
  if (requestId) {
    rechargeId.value = requestId
    console.log('Detalle de solicitud abierto con ID:', rechargeId.value)
    openWithdrawalDetailsModal.value = true
  } else {
    console.error('ID no válido para abrir detalles del retiro.')
  }
}
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const rechargeModal = ref<any>({ offerId: '' })
const BASE_WITH_URL = '/finance/withdrawal-request-management'
const { data, refresh } = await useAPI<IDataResponse<IWithdrawalItem>>(
  () => `${BASE_WITH_URL}/view-paginated-withdrawal-requests`,
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
  data.value?.data.map((item: IWithdrawalItem) => ({
    fullName: item.participant.commonName,
    ...item,
    createdAt: dayjs(item.createdAt).format('YYYY-MM-DD'),
  })),
)
// Acciones para modal Generar Lote
const handleGenerateDisbursement = (formData: any) => {
  console.log('Lote generado con los datos:', formData)
  openModalGenerate.value = false
}
const generateDisbursementForm = ref<any>({
  id: '',
  paymentMethod: '',
  currency: '',
  bank: '',
  chargeAccount: '',
  paymentMedium: '',
})
// Modal de rechazo retiro
const selectedRejectInfo = ref<any>({
  id: '',
  rejection: null,
  comment: null,
})
const handleOpenRejectModal = (details: any) => {
  selectedRejectInfo.value = {
    id: details.id,
    rejection: details.rejectionReason || null,
    comment: details.comment || null,
  }
  openRejectModal.value = true
}
// Manejo de acciones detalle solicitud
const handleAuthorize = async (values: any) => {
  openConfirmModal({
    title: 'Autorizar retiro',
    message: '¿Estás seguro que deseas autorizar este retiro?',
    callback: async () => {
      const { status, error } = await authorizeWithdrawal(values)
      if (status.value === 'success') {
        openEditModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Retiro autorizada',
          message: 'Se ha autorizado el retiro',
          type: 'success',
        })
      } else {
        const eMsg =
          error?.value?.data?.errors?.[0]?.message ||
          error?.value?.data?.message ||
          'El retiro no se pudo confirmar, inténtalo más tarde'

        updateConfirmModal({
          title: 'Error al confirmar retiro',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
