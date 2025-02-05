<template>
  <section>
    <ContentLayout title="Listado de sustentos de transferencia y entrega">
      <CustomSimpleCard
        title="Sustentos de transferencia y entrega"
        class="mb-6"
        sub-title="Validación y subsanación de sustentos cargados"
      />
      <div class="w-full flex flex-col">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            :data="evidenceData"
            :header="evidenceHeader"
            :search="evidenceSearch"
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
            <template #SupportForTransfer="{ row }">
              <div
                class="flex items-center justify-center"
                :class="
                  !row.transferenceSupport?.files.length
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
                @click="
                  () => {
                    if (row.transferenceSupport?.files?.length)
                      openSupportForTransferModal(row)
                  }
                "
              >
                <CustomIcons
                  :name="
                    transferSupportIcons.get(row.transferenceSupport?.status)
                      ?.icon || 'Doc-Loupe'
                  "
                  :class="
                    transferSupportIcons.get(row.transferenceSupport?.status)
                      ?.class || 'text-[#AFAFB1]'
                  "
                />
              </div>
            </template>
            <template #SupportForDelivery="{ row }">
              <div
                class="flex items-center justify-center"
                :class="
                  !row.deliverySupport?.files.length
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
                @click="
                  () => {
                    if (row.deliverySupport?.files?.length)
                      openDeliveryForTransferModal(row)
                  }
                "
              >
                <CustomIcons
                  :name="
                    deliverySupportIcons.get(row.deliverySupport?.status)
                      ?.icon || 'Doc-Transfer'
                  "
                  :class="
                    deliverySupportIcons.get(row.deliverySupport?.status)
                      ?.class || 'text-[#AFAFB1]'
                  "
                />
              </div>
            </template>
            <template #status="{ row }">
              <CustomChip
                :text="evidenceStatus.get(row.status)?.name || ''"
                :variant="evidenceStatus.get(row.status)?.color as any"
              ></CustomChip>
            </template>
          </CustomTable>
          <SheetContent
            v-model:open="openModalDetailSupport"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <SupportForm
              :id="supportId"
              :on-confirm="handleConfirmTransference"
              :on-edit="handleEditTransference"
              :close-modal="() => (openModalDetailSupport = false)"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openModalDeliveryTransfer"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <DeliveryForm
              :id="deliveryId"
              :on-confirm="handleConfirmDelivery"
              :on-edit="handleEditDelivery"
              :close-modal="() => (openModalDeliveryTransfer = false)"
            />
          </SheetContent>
        </div>
        <CustomPagination
          v-model:page="page"
          class="mt-5 mb-[19px]"
          :total="data.count"
          :limit="data.limit"
        />
      </div>
    </ContentLayout>
  </section>
</template>
<script setup lang="ts">
import DeliveryForm from './DeliverySustentationForm.vue'
import SupportForm from './TransferenceSustentationForm.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import type { EvidenseItem, IDateModal } from '@/types/Evidence.ts'
import {
  evidenceStatus,
  evidenceSearch,
  evidenceHeader,
  deliverySupportIcons,
  transferSupportIcons,
} from '~/constants/evidenceOrg'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { GrantId } from '~/types/Grant'

const props = defineProps<{ organizationId: string | null }>()
const filterOptions = ref(
  props.organizationId
    ? `[{ "field": "organization.id", "type": "equal", "value": "${props.organizationId}" }]`
    : '[]',
)
const openModalDeliveryTransfer = ref(false)
const openModalDetailSupport = ref(false)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { confirmTransference, sortOptions, page, onSort } =
  useEvidenceTransferAPI()
const { confirmDeliverySupport, editDeliverySupport } = useEvidenceDeliveryAPI()
const supportId = ref<string | undefined>(undefined)
const deliveryId = ref<string | undefined>(undefined)
const OFFER_BASE_URL = '/offer-management'
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
const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: 'title', type: 'like', value: item.title || '' },
    { field: 'status', type: 'equal', value: item.status || '' },
    ...(props.organizationId
      ? [
          {
            field: 'organization.id',
            type: 'equal',
            value: props.organizationId,
          },
        ]
      : []),
  ])
  page.value = 1
}

const { data, refresh }: any = await useAPI(
  `susntentation-management/find-sustentations-paginated`,
  {
    query: {
      limit: 10,
      page,
      filterOptions: '[]',
      relations: JSON.stringify(['transferenceSupport', 'deliverySupport']),
      sortOptions,
    },
  } as any,
)
const evidenceData = computed(() =>
  data.value.data.map((item: EvidenseItem) => ({
    ...item,
  })),
)
const openSupportForTransferModal = (row: any) => {
  if (row.transferenceSupport?.id) {
    supportId.value = row.transferenceSupport.id
    openModalDeliveryTransfer.value = true
  }
}
const openDeliveryForTransferModal = (row: any) => {
  if (row.deliverySupport?.id) {
    deliveryId.value = row.deliverySupport.id
    openModalDeliveryTransfer.value = true
  }
}

const handleConfirmTransference = async (value: {
  transferenceSupportId: string
}) => {
  openConfirmModal({
    title: 'Confirmar Transferencia',
    message: `¿Está seguro de que deseas confirmar esta transferencia?`,
    callback: async () => {
      try {
        const { status } = await confirmTransference(value)
        if (status.value === 'success') {
          refresh()
          resetMultipleSelect.value?.()
          updateConfirmModal({
            title: 'Transferencia confirmada',
            message: 'La transferencia ha sido confirmado exitosamente',
            type: 'success',
          })
        } else {
          throw new Error('Error al confirmar esta transferencia')
        }
      } catch (error) {
        console.log('error', error)
        updateConfirmModal({
          title: 'Error al confirmar Transferencia',
          message:
            'No se pudo confirmar esta Transferencia. Por favor, intente nuevamente.',
          type: 'error',
        })
      }
    },
  })
}
const handleConfirmDelivery = async (value: { deliverySupportId: string }) => {
  openConfirmModal({
    title: 'Confirmar Sustento de Entrega',
    message: `¿Está seguro de que deseas confirmar este Sustento de Entrega?`,
    callback: async () => {
      try {
        const { status } = await confirmDeliverySupport(value)
        if (status.value === 'success') {
          refresh()
          resetMultipleSelect.value?.()
          updateConfirmModal({
            title: 'Sustento de Entrega confirmada',
            message: 'Sustento de Entrega confirmado exitosamente',
            type: 'success',
          })
          openModalDeliveryTransfer.value = false
        } else {
          throw new Error('Error al confirmar este Sustento de Entrega')
        }
      } catch (error) {
        updateConfirmModal({
          title: 'Error al confirmar Sustento de Entrega',
          message:
            'No se pudo confirmar Sustento de Entrega. Por favor, intente nuevamente.',
          type: 'error',
        })
      }
    },
  })
}

const handleEditDelivery = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar Sustento de Entrega',
    message: '¿Estás seguro de que deseas actualizar este Sustento de Entrega?',
    callback: async () => {
      const { status, error }: any = await editDeliverySupport(values)
      if (status.value === 'success') {
        openModalDeliveryTransfer.value = false
        refresh()
        updateConfirmModal({
          title: 'Sustento de Entrega actualizado',
          message: 'Sustento de Entrega ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'Este sustento de Entrega no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar Sustento de Entrega',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleEditTransference = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar transferencia de bienes',
    message:
      '¿Estás seguro de que deseas actualizar esta Transferencia de bienes?',
    callback: async () => {
      const { status, error }: any = await editDeliverySupport(values)
      if (status.value === 'success') {
        openModalDeliveryTransfer.value = false
        refresh()
        updateConfirmModal({
          title: 'Transferencia de bienes actualizado',
          message: 'Transferencia de bienes ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'Esta transferencia de bienes no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar Transferencia de bienes',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
