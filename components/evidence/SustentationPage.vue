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
            class="mb-5"
            :header="sustentationHeaderList(userSession.globalType)"
            :search="evidencePlatfSearch(userSession.globalType)"
            @on-sort="onSort"
            @on-search="onSearch"
            @on-multiple-select="
              ({ ids, type, resetMultipleSelect: onResetMultipleSelect }) => {
                selectedMultipleData = { ids, type }
                resetMultipleSelect = onResetMultipleSelect
              }
            "
          >
            <template #offerId="{ row }">
              <Button as-child variant="link">
                <NuxtLink
                  :to="
                    globalType === GlobalType.Platform
                      ? `/dashboard/platform/events/${row.offer.eventId}/offers/${row.offer.id}/bids`
                      : `/dashboard/organization/${route.params.organizationId}/events/${row.offer.eventId}/offers/${row.offer.id}/bids`
                  "
                >
                  {{ row.offer.id }}
                </NuxtLink>
              </Button>
            </template>
            <template #paymentStatus="{ row }">
              <CustomChip
                :text="paymentStatus.get(row.payment.status)?.name || ''"
                :variant="paymentStatus.get(row.payment.status)?.color as any"
              ></CustomChip>
            </template>
            <template #deliverySustentation="{ row }">
              <div
                v-if="row && row.deliverySustentation"
                class="flex justify-center m-auto items-center"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div>
                        <Button
                          variant="ghost"
                          @click="
                            () => {
                              openDeliveryForTransferModal(row)
                            }
                          "
                        >
                          <CustomIcons
                            name="Doc-Loupe"
                            :class="
                              childSustentationStatusRecord[
                                row.deliverySustentation
                                  .status as ChildSustentationStatus
                              ].iconClass || ''
                            "
                          />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <CustomChip
                        :text="
                          childSustentationStatusRecord[
                            row.deliverySustentation
                              .status as ChildSustentationStatus
                          ].label || ''
                        "
                        :variant="
                          (childSustentationStatusRecord[
                            row.deliverySustentation
                              .status as ChildSustentationStatus
                          ].color as any) || ''
                        "
                      ></CustomChip>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div v-else>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  class="text-[#a1a1a3] underline h-8 data-[state=open]:bg-accent"
                >
                  <span>Sin información</span>
                </Button>
              </div>
              <!-- <div -->
              <!--   class="flex items-center justify-center" -->
              <!--   :class=" -->
              <!--     !row.deliverySupport?.files?.length -->
              <!--       ? 'cursor-not-allowed' -->
              <!--       : 'cursor-pointer' -->
              <!--   " -->
              <!--   @click=" -->
              <!--     () => { -->
              <!--       if (row.transferenceSustentation) -->
              <!--         openDeliveryForTransferModal(row) -->
              <!--     } -->
              <!--   " -->
              <!-- > -->
              <!--   <CustomIcons -->
              <!--     :name=" -->
              <!--       deliverySupportIcons.get(row.deliverySupport?.status) -->
              <!--         ?.icon || 'Doc-Loupe' -->
              <!--     " -->
              <!--     :class=" -->
              <!--       deliverySupportIcons.get(row.deliverySupport?.status) -->
              <!--         ?.class || 'text-[#AFAFB1]' -->
              <!--     " -->
              <!--   /> -->
              <!-- </div> -->
            </template>
            <template #createdAt="{ row }">
              <DateLabel :value="row.createdAt" />
            </template>

            <template #transferenceSustentationUpdatedAt="{ row }">
              <DateLabel
                v-if="
                  row.transferenceSustentation &&
                  row.transferenceSustentation.status !==
                    ChildSustentationStatus.Pending
                "
                :value="row.transferenceSustentation.updatedAt"
              />
              <BerlinNullLabel v-else />
            </template>
            <template #deliverySustentationUpdatedAt="{ row }">
              <DateLabel
                v-if="
                  row.deliverySustentation &&
                  row.deliverySustentation.status !==
                    ChildSustentationStatus.Pending
                "
                :value="row.deliverySustentation.updatedAt"
              />
              <BerlinNullLabel v-else />
            </template>
            <template #transferenceSustentation="{ row }">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div class="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        @click="
                          () => {
                            openTransferenceSustentationModal(row)
                          }
                        "
                      >
                        <CustomIcons
                          :name="
                            childSustentationStatusRecord[
                              row.transferenceSustentation
                                .status as ChildSustentationStatus
                            ].icon || ''
                          "
                          :class="
                            childSustentationStatusRecord[
                              row.transferenceSustentation
                                .status as ChildSustentationStatus
                            ].iconClass || ''
                          "
                        />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <CustomChip
                      :text="
                        childSustentationStatusRecord[
                          row.transferenceSustentation
                            .status as ChildSustentationStatus
                        ].label || ''
                      "
                      :variant="
                        (childSustentationStatusRecord[
                          row.transferenceSustentation
                            .status as ChildSustentationStatus
                        ].color as any) || ''
                      "
                    ></CustomChip>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <!-- <div class="flex justify-center m-auto items-center"></div> -->

              <!-- <div -->
              <!--   class="flex items-center justify-center" -->
              <!--   :class=" -->
              <!--     !row.deliverySupport?.files?.length -->
              <!--       ? 'cursor-not-allowed' -->
              <!--       : 'cursor-pointer' -->
              <!--   " -->
              <!--   @click=" -->
              <!--     () => { -->
              <!--       openTransferenceSustentationModal(row) -->
              <!--     } -->
              <!--   " -->
              <!-- > -->
              <!--   <CustomIcons -->
              <!--     :name=" -->
              <!--       deliverySupportIcons.get(row.deliverySupport?.status) -->
              <!--         ?.icon || 'Doc-Loupe' -->
              <!--     " -->
              <!--     :class=" -->
              <!--       deliverySupportIcons.get(row.deliverySupport?.status) -->
              <!--         ?.class || 'text-[#AFAFB1]' -->
              <!--     " -->
              <!--   /> -->
              <!-- </div> -->
            </template>
            <template #eventGoodType="{ row }">
              {{ goodType.get(row.event.goodType) }}
            </template>
          </CustomTable>
          <SheetContent
            v-model:open="isDeliverySustentationFormOpened"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <DeliverySustentationForm
              :id="deliverySustentationId"
              :on-confirm="handleConfirmDeliverySustentationFiles"
              :on-edit="handleUploadDeliverySustentationFiles"
              :close-modal="() => (isDeliverySustentationFormOpened = false)"
            />
          </SheetContent>
          <SheetContent
            v-model:open="isTransferenceSustentationFormOpened"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <TransferenceSustentationForm
              :id="transferenceSustentationId"
              :on-confirm="handleConfirmTransferenceSustentationFiles"
              :on-edit="handleUploadTransferenceSustentationFiles"
              :close-modal="
                () => (isTransferenceSustentationFormOpened = false)
              "
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
import TransferenceSustentationForm from './TransferenceSustentationForm.vue'
import DeliverySustentationForm from './DeliverySustentationForm.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import {
  ChildSustentationStatus,
  childSustentationStatusRecord,
  type EvidenseItem,
  type IDateModal,
} from '@/types/Evidence.ts'
import {
  evidencePlatfStatus,
  evidencePlatfSearch,
  sustentationHeaderList,
  deliverySupportIcons,
} from '~/constants/sustentation'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { GrantId } from '~/types/Grant'
import { paymentStatus } from '~/constants/payments'
import { goodType } from '~/constants/events'
import { GlobalType } from '~/types/Common'
import DateLabel from '~/design-system/ui/data-label/DateLabel.vue'
import BerlinNullLabel from '~/design-system/berlin/labels/null-label/BerlinNullLabel.vue'

const session = useUserSessionExtended()
const filterOptions = ref(
  session.globalType === GlobalType.Organization
    ? `[{ "field": "organization.id", "type": "equal", "value": "${session.getDefaultOrganization().id}" }]`
    : '[]',
)
const userSession = useUserSessionExtended()

const isDeliverySustentationFormOpened = ref(false)
const isTransferenceSustentationFormOpened = ref(false)
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
const deliverySustentationId = ref<string | undefined>(undefined)
const transferenceSustentationId = ref<string | undefined>(undefined)
const OFFER_BASE_URL = '/offer-management'
const route = useRoute()
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
    // { field: 'status', type: 'equal', value: item.status || '' },
    {
      field: 'quickSearch',
      type: 'equal',
      value: item.quickSearch || '',
    },
    ...(userSession.globalType === GlobalType.Organization
      ? [
          {
            field: 'organization.id',
            type: 'equal',
            value: userSession.getDefaultOrganization().id,
          },
        ]
      : []),
  ])
  page.value = 1
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
  deliverySustentationId.value = row.deliverySustentation.id
  isDeliverySustentationFormOpened.value = true
  // }
}

const { user, globalType } = useUserSessionExtended()
const openTransferenceSustentationModal = (row: any) => {
  transferenceSustentationId.value = row.transferenceSustentation.id
  isTransferenceSustentationFormOpened.value = true
}

// const handleConfirmTransferenceSustentation = async (value: any) => {
//   openConfirmModal({
//     title: 'Confirmar Sustento de Entrega',
//     message: `¿Está seguro de que deseas confirmar este Sustento de Entrega?`,
//     callback: async () => {
//       try {
//         const { status } = await confirmDeliverySupport(value)
//         if (status.value === 'success') {
//           refresh()
//           resetMultipleSelect.value?.()
//           updateConfirmModal({
//             title: 'Sustento de Entrega confirmada',
//             message: 'Sustento de Entrega confirmado exitosamente',
//             type: 'success',
//           })
//           openModalDeliveryTransfer.value = false
//         } else {
//           throw new Error('Error al confirmar este Sustento de Entrega')
//         }
//       } catch (error) {
//         updateConfirmModal({
//           title: 'Error al confirmar Sustento de Entrega',
//           message:
//             'No se pudo confirmar Sustento de Entrega. Por favor, intente nuevamente.',
//           type: 'error',
//         })
//       }
//     },
//   })
// }

const apiSustentation = useAPISustentation()

const handleConfirmTransferenceSustentationFiles = async (values: any) => {
  openConfirmModal({
    title: 'Confirmar Sustento de transferencia',
    message:
      '¿Estás seguro de que deseas confirmar este Sustento de transferencia?',
    callback: async () => {
      const { status, error }: any =
        await apiSustentation.confirmTransferenceSustentation(values)
      if (status.value === 'success') {
        isTransferenceSustentationFormOpened.value = false
        refresh()
        updateConfirmModal({
          title: 'Sustento de transferencia confirmado',
          message: 'Sustento de transferencia ha sido confirmado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'Este sustento de transferencia no se pudo confirmar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al confirmar Sustento de transferencia',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleConfirmDeliverySustentationFiles = async (values: any) => {
  openConfirmModal({
    title: 'Confirmar Sustento de entrega',
    message: '¿Estás seguro de que deseas confirmar este Sustento de entrega?',
    callback: async () => {
      const { status, error }: any =
        await apiSustentation.confirmDeliverySustentation(values)
      if (status.value === 'success') {
        isDeliverySustentationFormOpened.value = false
        refresh()
        updateConfirmModal({
          title: 'Sustento de entrega confirmado',
          message: 'Sustento de entrega ha sido confirmado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'Este sustento de entrega no se pudo confirmar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al confirmar Sustento de entrega',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

// const handleConfirmDeliverySustentationFiles = async (value: any) => {
//   openConfirmModal({
//     title: 'Confirmar Sustento de Entrega',
//     message: `¿Está seguro de que deseas confirmar este Sustento de Entrega?`,
//     callback: async () => {
//       try {
//         const { status } = await confirmDeliverySupport(value)
//         if (status.value === 'success') {
//           refresh()
//           resetMultipleSelect.value?.()
//           updateConfirmModal({
//             title: 'Sustento de Entrega confirmada',
//             message: 'Sustento de Entrega confirmado exitosamente',
//             type: 'success',
//           })
//           isDeliverySustentationFormOpened.value = false
//         } else {
//           throw new Error('Error al confirmar este Sustento de Entrega')
//         }
//       } catch (error) {
//         updateConfirmModal({
//           title: 'Error al confirmar Sustento de Entrega',
//           message:
//             'No se pudo confirmar Sustento de Entrega. Por favor, intente nuevamente.',
//           type: 'error',
//         })
//       }
//     },
//   })
// }

const handleUploadTransferenceSustentationFiles = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar Sustento de transferencia',
    message:
      '¿Estás seguro de que deseas actualizar este Sustento de transferencia?',
    callback: async () => {
      const { status, error }: any =
        await apiSustentation.uploadTransferenceSustentationFiles(values)
      if (status.value === 'success') {
        isTransferenceSustentationFormOpened.value = false
        refresh()
        updateConfirmModal({
          title: 'Sustento de transferencia actualizado',
          message: 'Sustento de transferencia ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'Este sustento de transferencia no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar Sustento de transferencia de entrega',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleUploadDeliverySustentationFiles = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar Sustento de entrega',
    message: '¿Estás seguro de que deseas actualizar este Sustento de entrega?',
    callback: async () => {
      const uploadDelivery =
        userSession.globalType === GlobalType.Organization
          ? apiSustentation.uploadDeliverySustentationFilesForOrganization
          : apiSustentation.uploadDeliverySustentationFilesForPlatform
      const { status, error }: any = await uploadDelivery(values)
      if (status.value === 'success') {
        isDeliverySustentationFormOpened.value = false
        refresh()
        updateConfirmModal({
          title: 'Sustento de entrega actualizado',
          message: 'Sustento de entrega ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'Este sustento de entrega no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar Sustento de  entrega',
          message: eMsg,
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
        isDeliverySustentationFormOpened.value = false
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
