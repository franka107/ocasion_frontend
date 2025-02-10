<template>
  <ContentLayout title="Lote de desembolsos">
    <CustomSimpleCard
      title="Listado de lote de desembolsos"
      class="mb-6"
      sub-title="Vizualización de lote de desembolsos de los participantes"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white pb-6 flex-grow mb-auto">
        <CustomTable
          :data="data.data"
          :search-values="initialSearchValues"
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
                  <template v-if="row.status === 'PENDING'">
                    <DropdownMenuItem
                      @click="
                        () => {
                          openModalConfirm = true
                          confirmModalInfo = {
                            paymentSupportFile: row.paymentSupportFile,
                            disbursedAt: row.disbursedAt,
                            id: row.id,
                          }
                        }
                      "
                    >
                      Confirmar lote
                      <CustomIcons name="Check" class="ml-4" />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="handleAnnul(row)">
                      Anular lote
                      <CustomIcons name="X" class="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </template>

                  <DropdownMenuItem @click="openWithdrawalDetails(row)">
                    Detalle
                    <CustomIcons name="EyeIcon" class="ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>

          <template #createdAt="{ row }">
            <DateLabel :value="row.createdAt" />
          </template>
          <template #totalAmount="{ row }">
            <MoneyLabel :amount="row.totalAmount" />
          </template>
          <template #archive="{ row }">
            <div class="flex items-center justify-center">
              <Button
                v-if="row.voucherGeneratedFile?.path"
                class="flex items-center justify-center rounded-full"
                variant="outline"
                size="icon"
                @click="downloadFile(row.voucherGeneratedFile)"
              >
                <CustomIcons name="Doc-Loupe" />
              </Button>
              <span v-else>-</span>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="disbursementStatus.get(row.status)?.name || ''"
              :variant="disbursementStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
          <template #action-button>
            <Button
              variant="default"
              @click="
                () => {
                  openModalGenerate = true
                }
              "
              >Generar lote</Button
            >
          </template>
        </CustomTable>
        <GenerateDisbursementBatchModal
          :id="generateDisbursementForm.id"
          v-model="openModalGenerate"
          :bank="generateDisbursementForm.bank"
          :on-submit="handleGenerateDisbursement"
          :refresh-table="refresh"
        />
        <SheetContent
          v-model:open="openWithdrawalDetailsModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e: Event) => e.preventDefault()"
          @interact-outside="(e: Event) => e.preventDefault()"
        >
          <DisbursementDetailsForm
            :id="disbursementId"
            v-model="openWithdrawalDetailsModal"
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
import dayjs from 'dayjs'
import { ref } from 'vue'
import CustomTable, {
  type SearchValues,
} from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type {
  IGenerateForm,
  DisbursementLot,
  FileType,
} from '~/types/Disbursement'
import {
  disbursementStatus,
  disbursementHeader,
  disbursementSearch,
} from '~/constants/attention-tray'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import ParticipantDetailForm from '~/components/attention-tray/top-up-requests/ParticipantDetailForm.vue'
import GenerateDisbursementBatchModal from '~/components/attention-tray/disbursement-lots/GenerateDisbursementBatchModal.vue'
import ConfirmDisbursementModal from '~/components/attention-tray/disbursement-lots/ConfirmDisbursementModal.vue'
import { useDisbursement } from '@/composables/useDisbursement'
import DisbursementDetailsForm from '~/components/attention-tray/disbursement-lots/DisbursementDetailsForm.vue'
import type { IDataResponse } from '~/types/Common'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
import MoneyLabel from '~/design-system/ui/money-label/MoneyLabel.vue'
const openParticipantModal = ref(false)
const route = useRoute()
const {
  page,
  onSort,
  onSearch,
  filterOptions,
  sortOptions,
  annulDisbursement,
} = useDisbursement('only-pendings')
const openModalConfirm = ref(false)
const openAnnulModal = ref(false)
const openModalGenerate = ref(false)
const openWithdrawalDetailsModal = ref(false)
const disbursementId = ref<number | undefined>(undefined)
const selectedRequestId = ref<string | null>(null)

// QUACK
// sync disbursementLotId query param with

const initialSearchValues: SearchValues = {}

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

if (route.query.disbursementLotId) {
  initialSearchValues.id = route.query.disbursementLotId as string
}

async function downloadFile(file: FileType) {
  try {
    // Realiza la solicitud al servidor para obtener el archivo
    const response = await fetch(file.path)
    if (!response.ok) {
      throw new Error(`Error al descargar el archivo: ${response.statusText}`)
    }

    // Convierte la respuesta a un blob
    const blob = await response.blob()

    // Crea un enlace para descargar el blob
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    // Limpia el objeto URL y elimina el enlace
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al descargar el archivo:', error)
  }
}

const openWithdrawalDetails = (row: any) => {
  const disbursementDetailId = row.id
  if (disbursementDetailId) {
    disbursementId.value = disbursementDetailId
    console.log('Abriendo detalle del participante:', disbursementDetailId)
    openWithdrawalDetailsModal.value = true
  } else {
    console.error('No se encontró lote')
  }
}
const onWithdrawalDetailsSubmit = (formData: any) => {
  console.log('Detalle de solicitud enviado:', formData)
  openWithdrawalDetailsModal.value = false
}
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const BASE_DIS_URL = '/finance/disbursement-management'
const { data, refresh } = await useAPI<IDataResponse<DisbursementLot>>(
  () => `${BASE_DIS_URL}/view-paginated-disbursement-lots`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const confirmModalInfo = ref<any>({
  id: '',
  paymentSupportFile: {},
  disbursedAt: {},
})

const openParticipantDetail = (row: any) => {
  console.log('Abriendo detalle del participante:', row)
  openParticipantModal.value = true
}
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
