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
            :header="evidencePlatfHeader"
            :search="evidencePlatfSearch"
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
            <!-- <template #paymentStatus="{ row }"> -->
            <!--   <CustomChip -->
            <!--     :text="paymentStatus.get(row.payment.status)?.name || ''" -->
            <!--     :variant="paymentStatus.get(row.payment.status)?.color as any" -->
            <!--   ></CustomChip> -->
            <!-- </template> -->
            <template #deliverySustentation="{ row }">
              <div
                class="flex items-center justify-center"
                :class="
                  !row.deliverySupport?.files?.length
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
                @click="
                  () => {
                    if (row.transferenceSustentation)
                      openDeliveryForTransferModal(row)
                  }
                "
              >
                <CustomIcons
                  :name="
                    deliverySupportIcons.get(row.deliverySupport?.status)
                      ?.icon || 'Doc-Loupe'
                  "
                  :class="
                    deliverySupportIcons.get(row.deliverySupport?.status)
                      ?.class || 'text-[#AFAFB1]'
                  "
                />
              </div>
            </template>
            <template #transferenceSustentation="{ row }">
              <div
                class="flex items-center justify-center"
                :class="
                  !row.deliverySupport?.files?.length
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
                @click="
                  () => {
                    if (row.transferenceSustentation)
                      openDeliveryForTransferModal(row)
                  }
                "
              >
                <CustomIcons
                  :name="
                    deliverySupportIcons.get(row.deliverySupport?.status)
                      ?.icon || 'Doc-Loupe'
                  "
                  :class="
                    deliverySupportIcons.get(row.deliverySupport?.status)
                      ?.class || 'text-[#AFAFB1]'
                  "
                />
              </div>
            </template>
            <template #eventGoodType="{ row }">
              {{ goodType.get(row.event.goodType) }}
            </template>
          </CustomTable>
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
import DeliveryForm from './DeliveryForm.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import type { EvidenseItem, IDateModal } from '@/types/Evidence.ts'
import {
  evidencePlatfStatus,
  evidencePlatfSearch,
  evidencePlatfHeader,
  deliverySupportIcons,
} from '~/constants/evidencePlatf'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { GrantId } from '~/types/Grant'
import { paymentStatus } from '~/constants/payments'
import { goodType } from '~/constants/events'

const filterOptions = ref('[]')
const openModalDeliveryTransfer = ref(false)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const {
  confirmDeliverySupport,
  editDeliverySupport,
  sortOptions,
  page,
  onSort,
} = useEvidenceDeliveryAPI()
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
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
  ])
}

const { data, refresh }: any = await useAPI(
  `sustentation-management/view-sustentations-paginated`,
  {
    query: {
      limit: 10,
      page,
      filterOptions,
      // relations: JSON.stringify(['transferenceSupport', 'deliverySupport']),
      sortOptions,
    },
  } as any,
)
const evidenceData = computed(() =>
  data.value.data.map((item: EvidenseItem) => ({
    ...item,
  })),
)

const openDeliveryForTransferModal = (row: any) => {
  // if (row.deliverySupport?.id) {
  // deliveryId.value = row.deliverySupport.id
  deliveryId.value = 'proban'
  openModalDeliveryTransfer.value = true
  // }
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
</script>
