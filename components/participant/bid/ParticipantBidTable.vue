<template>
  <section>
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-6">
        <CustomTable
          :data="bidsData"
          class="mb-4"
          :header="bidsParticipantHeader"
          :search="bidsParticipantSearch"
          @on-sort="onSort"
          @on-search="onSearch"
          @on-multiple-select="
            ({ ids, type, resetMultipleSelect: onResetMultipleSelect }) => {
              selectedMultipleData = { ids, type }
              resetMultipleSelect = onResetMultipleSelect
            }
          "
        >
          <template #offerStatus="{ row }">
            <CustomChip
              :text="offerStatusRecord[row.offer.status]?.name || ''"
              :variant="offerStatusRecord[row.offer.status]?.color as any"
            ></CustomChip>
          </template>
          <template #transferenceSustentation="{ row }">
            <div
              v-if="row.sustentation"
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
                            openTransferenceSustentationModal(row)
                          }
                        "
                      >
                        <CustomIcons
                          :name="
                            childSustentationStatusRecord[
                              row.sustentation.transferenceSustentation
                                .status as ChildSustentationStatus
                            ].icon || ''
                          "
                          :class="
                            childSustentationStatusRecord[
                              row.sustentation.transferenceSustentation
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
                          row.sustentation.transferenceSustentation
                            .status as ChildSustentationStatus
                        ].label || ''
                      "
                      :variant="
                        (childSustentationStatusRecord[
                          row.sustentation.transferenceSustentation
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
          </template>

          <template #deliverySustentation="{ row }">
            <div
              v-if="
                row.sustentation &&
                row.sustentation.deliverySustentation &&
                row.sustentation.deliverySustentation.status !==
                  ChildSustentationStatus.Pending
              "
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
                            openDeliverySustentationModal(row)
                          }
                        "
                      >
                        <CustomIcons
                          name="Doc-Loupe"
                          :class="
                            childSustentationStatusRecord[
                              row.sustentation.deliverySustentation
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
                          row.sustentation.deliverySustentation
                            .status as ChildSustentationStatus
                        ].label || ''
                      "
                      :variant="
                        (childSustentationStatusRecord[
                          row.sustentation.deliverySustentation
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
          </template>
          <template #payment="{ row }">
            <div
              v-if="row.payment"
              class="flex m-auto justify-center items-center"
            >
              <!-- <Button variant="ghost" @click="handleCompostSupportFiles(row)"> -->
              <!--   <CustomIcons -->
              <!--     name="Doc-Transfer" -->
              <!--     class="w-6 h-6 text-reminder-600" -->
              <!--   /> -->
              <!-- </Button> -->

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div>
                      <Button
                        variant="ghost"
                        @click="
                          () => {
                            handleCompostSupportFiles(row)
                          }
                        "
                      >
                        <CustomIcons
                          :name="
                            paymentStatusRecord[
                              row.payment.status as PaymentStatus
                            ].icon || ''
                          "
                          :class="
                            paymentStatusRecord[
                              row.payment.status as PaymentStatus
                            ].iconClass || ''
                          "
                        />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <CustomChip
                      :text="
                        paymentStatusRecord[row.payment.status as PaymentStatus]
                          ?.label || ''
                      "
                      :variant="
                        (paymentStatusRecord[
                          row.payment.status as PaymentStatus
                        ]?.color || '') as any
                      "
                    ></CustomChip>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div v-else class="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                disabled
                class="text-[#a1a1a3] underline h-8 data-[state=open]:bg-accent"
              >
                <span>Sin información</span>
              </Button>
            </div>
          </template>

          <template #actions="{ row }">
            <div v-if="row.counterOffer" class="flex justify-center">
              <DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-primary-950 underline h-8 data-[state=open]:bg-accent"
                  @click="
                    () => {
                      openModalCounterOffer = true
                      selectedCounterOfferInfo = {
                        currentAmount: row.amount,
                        counterOfferAmount: row.counterOffer.amount,
                        id: row.id,
                      }
                    }
                  "
                >
                  <span>Ver contraoferta</span>
                </Button>
              </DropdownMenu>
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
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="bidStatus.get(row.status)?.name || ''"
              :variant="bidStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
          <template #eventGoodType="{ row }">
            {{ goodType.get(row.offer.event.goodType) }}
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
            readonly
            :on-confirm="() => {}"
            :on-edit="() => {}"
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
            :on-confirm="() => {}"
            :on-edit="handleUploadTransferenceSustentationFiles"
            :close-modal="() => (isTransferenceSustentationFormOpened = false)"
          />
        </SheetContent>
        <SheetContent
          v-model:open="openTransferModal"
          custom-width="510px"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <GoodsTransferForm
            :id="selectedId"
            :person-status="selectedPersonStatus"
            :on-submit="onSubmit"
          />
        </SheetContent>
        <SheetContent
          v-model:open="openUploadModal"
          custom-width="510px"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <UploadPaymentSupport
            v-if="currentOrganization && paymentId"
            :id="paymentId"
            :organization="currentOrganization"
            :on-submit="handleUploadCompostSupportFiles"
          />
        </SheetContent>
        <CounterOfferInboundModal
          :id="selectedCounterOfferInfo.id"
          v-model="openModalCounterOffer"
          :current-amount="selectedCounterOfferInfo.currentAmount"
          :counter-offer-amount="selectedCounterOfferInfo.counterOfferAmount"
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
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import CounterOfferBidModal from '../../bid/CounterOfferOutbountBidModal.vue'
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import {
  bidsParticipantHeader,
  bidsParticipantSearch,
  bidStatus,
} from '@/constants/bids'
import type { BidDto, OfferWithBidDto } from '~/types/Bids'
import { GrantId } from '~/types/Grant'
import GoodsTransferForm from '~/components/participant/bid/GoodsTransferForm.vue'
import UploadPaymentSupport from '~/components/participant/bid/UploadPaymentSupport.vue'
import CounterOfferInboundModal from '~/components/bid/CounterOfferInboundModal.vue'
import type { OrganizationDto } from '~/types/Organization'
import { goodType } from '~/constants/events'
import TransferenceSustentationForm from '~/components/evidence/TransferenceSustentationForm.vue'
import { paymentStatus } from '~/constants/payments'
import {
  ChildSustentationStatus,
  childSustentationStatusRecord,
} from '~/types/Evidence'
import { offerStatusRecord } from '~/constants/offer'
import { PaymentStatus, paymentStatusRecord } from '~/types/Payment'
import DeliverySustentationForm from '~/components/evidence/DeliverySustentationForm.vue'
const selectedId = ref('') // Define el id que necesitas pasar
const selectedPersonStatus = ref<'single' | 'married' | 'legal'>('legal')
const openTransferModal = ref(false)
const openUploadModal = ref(false)
const onSubmit = (values: any) => {}
const openModals = () => {
  openTransferModal.value = false
  openUploadModal.value = true
}
const bidId = ref<string>('')
const paymentId = ref<string | null>(null)
const handleCompostSupportFiles = (row: any) => {
  bidId.value = row.id
  paymentId.value = row.payment?.id
  currentOrganization.value = row.offer.organization
  // openTransferModal.value = false
  openUploadModal.value = true
}

const isTransferenceSustentationFormOpened = ref(false)
const transferenceSustentationId = ref<string | undefined>(undefined)
const isDeliverySustentationFormOpened = ref(false)
const deliverySustentationId = ref<string | undefined>(undefined)

const openTransferenceSustentationModal = (row: any) => {
  transferenceSustentationId.value =
    row.sustentation.transferenceSustentation.id
  isTransferenceSustentationFormOpened.value = true
}

const openDeliverySustentationModal = (row: any) => {
  deliverySustentationId.value = row.sustentation.deliverySustentation.id
  isDeliverySustentationFormOpened.value = true
}
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { rejectOfferBids, acceptOfferBids, page, sortOptions, onSort } =
  useBidAPI()
const { uploadCompostSupportFiles } = usePaymentAPI()
const findBidHistories = '/audit/find-bid-histories'
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
const BID_BASE_URL = '/bid-management'
const bidsId = ref<number | undefined>(undefined)
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
const openModalCounterOffer = ref(false)
const selectedCounterOfferInfo = ref({
  currentAmount: 0,
  counterOfferAmount: 0,
  id: '',
})
const filterOptions = ref(`[]`)
const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: 'offer.title', type: 'like', value: item.title || '' },
    { field: 'status', type: 'equal', value: item.status || '' },
  ])
}
const currentOrganization = ref<OrganizationDto | null>(null)
const { data, refresh }: any = await useAPI(
  `${BID_BASE_URL}/find-bids-paginated-for-participant`,
  {
    query: {
      limit: 10,
      page,
      filterOptions,
      // relations: JSON.stringify(['bid']),
      sortOptions,
    },
  } as any,
)

const bidsData = computed(
  () =>
    data.value?.data.map((item: BidDto, index: number) => ({
      code: item.offer.id,
      offerEndTime: item.offer.endTime
        ? dayjs(item.offer.endTime).format('DD/MM/YYYY')
        : '-',
      taxes: 200,
      type: '-',
      total: item.amount + 200,
      ...item,
    })) || [],
)

const apiSustentation = useAPISustentation()

const handleUploadTransferenceSustentationFiles = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar Sustento de transferencia',
    message:
      '¿Estás seguro de que deseas actualizar este Sustento de transferencia?',
    callback: async () => {
      const { status, error }: any =
        await apiSustentation.uploadTransferenceSustentationFilesForParticipant(
          values,
        )
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

const handleRejectBid = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: 'Rechazar puja',
    message: `¿Está seguro de rechazar la(s) puja(s) seleccionada(s)?`,
    callback: async () => {
      try {
        const { status } = await rejectOfferBids({
          ...values,
          eventId: String(route.params.eventId),
        })

        if (status.value === 'success') {
          refresh()
          resetMultipleSelect.value?.()
          updateConfirmModal({
            title: 'Puja(s) rechazada(s)',
            message: 'La(s) puja(s) ha sido rechazada(s) exitosamente',
            type: 'success',
          })
        } else {
          throw new Error('Error al rechazar esta(s) puja(s)')
        }
      } catch (error) {
        updateConfirmModal({
          title: 'Error al rechazar puja(s)',
          message:
            'No se pudo rechazar puja(s). Por favor, intente nuevamente.',
          type: 'error',
        })
      }
    },
  })
}
const handleAddBid = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: 'Aceptar puja',
    message: `¿Está seguro de aceptar la(s) puja(s) seleccionada(s)?`,
    callback: async () => {
      try {
        const { status } = await acceptOfferBids({
          ...values,
          eventId: String(route.params.eventId),
        })

        if (status.value === 'success') {
          refresh()
          resetMultipleSelect.value?.()
          updateConfirmModal({
            title: 'Puja(s) aceptada(s)',
            message: 'La(s) puja(s) ha sido aceptada(s) exitosamente',
            type: 'success',
          })
        } else {
          throw new Error('Error al aceptar esta(s) puja(s)')
        }
      } catch (error) {
        updateConfirmModal({
          title: 'Error al aceptar puja(s)',
          message: 'No se pudo aceptar puja(s). Por favor, intente nuevamente.',
          type: 'error',
        })
      }
    },
  })
}

const handleUploadCompostSupportFiles = async (values: any) => {
  openConfirmModal({
    title: 'Carga de sustento de abono ',
    message: `¿Está seguro de subir estos sustentos`,
    callback: async () => {
      const { status, error } = await uploadCompostSupportFiles({
        ...values,
        bidId: bidId.value,
        compostComissionPaymentFile: values.compostComissionPaymentFiles[0],
        compostPropertyPaymentFile: values.compostPropertyPaymentFiles[0],
      })

      if (status.value === 'success') {
        refresh()
        resetMultipleSelect.value?.()
        updateConfirmModal({
          title: 'Sustento de abonos subidos',
          message: 'Los sustentos han sido subidos exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El desembolso no se pudo anular, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al cargar los sustentos de abonos',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
