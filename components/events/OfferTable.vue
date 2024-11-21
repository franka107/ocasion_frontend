<template>
  <section v-if="!showBids">
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-6">
        <CustomTable
          :data="offerData"
          :header="offerHeader"
          :search="offerSearch"
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
            <div class="flex flex-row space-x-2">
              <Button
                v-if="
                  myGrants.data.value.includes(
                    GrantId.OrganizationOffersCanReject,
                  )
                "
                class="bg-white text-primary border border-primary hover:bg-accent"
                variant="default"
                :disabled="disableMultipleSelect"
                @click="handleRejectOffers(selectedMultipleData)"
                >Rechazar oferta
              </Button>
              <Button
                v-if="
                  isOfferActionsVisible &&
                  myGrants.data.value.includes(
                    GrantId.OrganizationOffersCanConfirm,
                  )
                "
                class="bg-white text-primary border border-primary hover:bg-accent"
                variant="default"
                :disabled="disableMultipleSelect"
                @click="handleConfirmOffers(selectedMultipleData)"
                >Confirmar oferta
              </Button>
              <Button
                v-if="
                  isOfferActionsVisible &&
                  myGrants.data.value.includes(GrantId.PlatformOfferCanRetire)
                "
                class="bg-white text-primary border border-primary hover:bg-accent"
                variant="default"
                :disabled="disableMultipleSelect"
                @click="handleRetireOffers(selectedMultipleData)"
                >Retirar oferta
              </Button>
              <div
                v-if="
                  myGrants.data.value.includes(GrantId.PlatformOfferCanCreate)
                "
              >
                <Button
                  v-if="eventDetail?.status !== EventStatus.Published"
                  variant="default"
                  @click="
                    () => {
                      offerId = undefined
                      openModalOffer = true
                    }
                  "
                  >Crear oferta
                </Button>
              </div>
              <Button
                v-if="
                  myGrants.data.value.includes(
                    GrantId.OrganizationBidCanView,
                  ) || myGrants.data.value.includes(GrantId.PlatformBidCanView)
                "
                variant="default"
                @click="handleViewBids"
                >Ver pujas
              </Button>
            </div>
          </template>
          <template #attachedFiles>
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full bg-[#0B38590A]"
            >
              <CustomIcons name="Clip" />
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
                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOfferCanUpdate,
                      )
                    "
                  >
                    <DropdownMenuItem
                      :disabled="
                        row.status === OfferStatus.Confirmed ||
                        eventDetail?.status === EventStatus.Published
                      "
                      @click="
                        () => {
                          offerId = row.id
                          openModalOffer = true
                        }
                      "
                    >
                      Editar
                      <CustomIcons name="Pen" class="ml-auto" />
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuItem
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.OrganizationOffersCanDiscuss,
                      )
                    "
                    @click="
                      () => {
                        openModalDebate = true
                        selectedDebateInfo = {
                          name: row.title,
                          appraisal: row.appraisal,
                          counterProposalAmount: row.counterProposalAmount,
                          id: row.id,
                        }
                      }
                    "
                  >
                    Debatir
                    <CustomIcons name="Mallet" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    @click="
                      () => {
                        bidsId = row.id
                        openAppraisalHistoryModal = true
                        appraisalHistoryModal = { offerId: row.id }
                      }
                    "
                  >
                    <div class="flex items-center space-x-2">
                      <span>Historial tasaciones</span>
                      <CustomIcons name="Clock-Timer" class="ml-auto" />
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOfferCanUpdateAppraisal,
                      )
                    "
                    @click="
                      () => {
                        openModifyAppraisal = true
                        changeAppraisalForm = {
                          offerId: row.id,
                          offerName: row.title,
                          counterProposalAmount: row.counterProposalAmount,
                          oldAppraisal: row.appraisal,
                          newAppraisal: row.appraisal,
                        }
                      }
                    "
                  >
                    Modificar tasación
                    <CustomIcons name="Pen" class="ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="offerStatus.get(row.status)?.name || ''"
              :variant="offerStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
        </CustomTable>
        <SheetContent
          v-model:open="openAppraisalHistoryModal"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <HistoryForm
            :bids-id="bidsId"
            :bid-id="appraisalHistoryModal.offerId"
            :endpoint="auditBidHistories"
            title="Historial de tasaciones"
          />
        </SheetContent>
        <SheetContent
          v-model:open="openModalOffer"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <OfferForm
            :id="offerId"
            :event-id="String(route.params.eventId)"
            :organization-id="String(route.params.organizationId)"
            :onsubmit="offerId !== undefined ? handleEdit : handleCreate"
          />
        </SheetContent>
        <DebateModal
          :id="selectedDebateInfo.id"
          v-model="openModalDebate"
          :name="selectedDebateInfo.name"
          :counter-proposal-amount="selectedDebateInfo.counterProposalAmount"
          :appraisal="selectedDebateInfo.appraisal"
          :refresh-table="refreshOfferTable"
        ></DebateModal>
        <AppraisalOfferModal
          v-model="openModifyAppraisal"
          :counter-proposal-amount="changeAppraisalForm.counterProposalAmount"
          :offer-id="changeAppraisalForm.offerId"
          :offer-title="changeAppraisalForm.offerName"
          :new-appraisal="changeAppraisalForm.newAppraisal"
          :old-appraisal="changeAppraisalForm.oldAppraisal"
          :refresh-table="refreshOfferTable"
        ></AppraisalOfferModal>
      </div>
      <CustomPagination
        v-model:page="page"
        class="mt-5 mb-[19px]"
        :total="data.count"
        :limit="data.limit"
      />
    </div>
  </section>
  <section v-else>
    <BidTable />
  </section>
</template>

<script setup lang="ts">
import { offerHeader, offerStatus, offerSearch } from '@/constants/offer'
import {
  type OfferListItem,
  type IDebateForm,
  type IChangeAppraisalForm,
  type IAmountHistoryModal,
  OfferStatus,
} from '~/types/Offer'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import OfferForm from '@/components/offers/OfferForm.vue'
import DebateModal from '@/components/offers/DebateModal.vue'
import BidTable from '@/components/events/BidTable.vue'
import AppraisalOfferModal from '~/components/offers/AppraisalOfferModal.vue'
import { GrantId } from '~/types/Grant'
import { EventStatus } from '~/types/Event'

const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
const auditBidHistories = '/audit/find-audit-histories'
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const {
  page,
  sortOptions,
  onSort,
  createOffer,
  editOffer,
  confirmOffers,
  rejectOffers,
  retireOffers,
} = useOfferAPI()
const OFFER_BASE_URL = '/offer-management'
const route = useRoute()
const { getEvent } = useEvent()
const offerId = ref(undefined)
const showBids = ref(false)
const bidsId = ref<number | undefined>(undefined)
// const isOfferActionsVisible = computed(
//   () => eventDetail.value?.status !== EventStatus.Published,
// );

const isOfferActionsVisible = computed(
  () =>
    eventDetail.value?.status !== EventStatus.Published &&
    eventDetail.value?.status !== EventStatus.InProgress &&
    eventDetail.value?.status !== EventStatus.Completed &&
    eventDetail.value?.status !== EventStatus.Finished,
)
const filterOptions = ref(
  `[{ "field": "event.id", "type": "equal", "value": "${route.params.eventId}" }]`,
)
const openModifyAppraisal = ref(false)
const openAppraisalHistoryModal = ref(false)
const appraisalHistoryModal = ref<IAmountHistoryModal>({ offerId: '' })
const changeAppraisalForm = ref<IChangeAppraisalForm>({
  offerId: '',
  offerName: '',
  counterProposalAmount: null,
  oldAppraisal: 0,
  newAppraisal: 0,
})
const openModalOffer = ref(false)
const openModalDebate = ref(false)
const selectedDebateInfo = ref<IDebateForm>({
  name: '',
  appraisal: 0,
  id: '',
  counterProposalAmount: 0,
})
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
    { field: 'event.id', type: 'equal', value: route.params.eventId },
  ])
}

const [
  { data: eventDetail, refresh: refreshEventDetail },
  { data, refresh: refreshOfferTable },
]: any = await Promise.all([
  getEvent(route.params.eventId as string),
  useAPI(`${OFFER_BASE_URL}/find-offers-paginated`, {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any),
])
const offerData = computed(() =>
  data.value.data.map((item: OfferListItem) => ({
    brandName: item.carBrand.name,
    modelName: item.carModel.name,
    addressCity: item.address.district.city.name,
    ...item,
  })),
)
// Funcion cambia vista de pujas
const handleViewBids = async () => {
  showBids.value = true
  console.log('Bids view enabled', showBids.value)
}

const handleCreate = async (values: any) => {
  openConfirmModal({
    title: 'Crear Oferta',
    message: '¿Estás seguro de que deseas crear este Oferta?',
    callback: async () => {
      const { status, error }: any = await createOffer(values)
      if (status.value === 'success') {
        openModalOffer.value = false
        refreshOfferTable()
        updateConfirmModal({
          title: 'Oferta creada',
          message: 'La oferta ha sido creada exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'La oferta no se pudo crear, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear Oferta',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleEdit = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar Oferta',
    message: '¿Estás seguro de que deseas actualizar este Oferta?',
    callback: async () => {
      const { status, error }: any = await editOffer(values)
      if (status.value === 'success') {
        openModalOffer.value = false
        refreshOfferTable()
        updateConfirmModal({
          title: 'Oferta actualizada',
          message: 'La oferta ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El evento no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar evento',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleConfirmOffers = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: 'Confirmar Ofertas',
    message: `¿Está seguro de aprobar la(s) oferta(s) seleccionada(s)?`,
    callback: async () => {
      const { type, ids } = values
      const { status, error } = await confirmOffers({
        type,
        ids,
        eventId: String(route.params.eventId),
      })
      if (status.value === 'success') {
        refreshOfferTable()
        resetMultipleSelect.value?.()
        updateConfirmModal({
          title: 'Oferta(s) confirmada(s)',
          message: 'La(s) oferta(s) ha sido confirmada(s) exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'No se pudo confirmar oferta(s). Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al rechazar Oferta(s)',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleRejectOffers = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: 'Rechazar Ofertas',
    message: `¿Está seguro de rechazar la(s) oferta(s) seleccionada(s)?`,
    callback: async () => {
      const { type, ids } = values
      const { status, error } = await rejectOffers({
        type,
        ids,
        eventId: String(route.params.eventId),
      })
      if (status.value === 'success') {
        refreshOfferTable()
        resetMultipleSelect.value?.()
        updateConfirmModal({
          title: 'Oferta(s) rechazada(s)',
          message: 'La(s) oferta(s) ha(n) sido rechazadas(s) exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'No se pudo rechazar oferta(s). Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al rechazar Oferta(s)',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleRetireOffers = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: 'Retirar Oferta(s)',
    icon: 'Trash',
    message: `¿Está seguro de retirar la(s) oferta(s) seleccionada(s)?`,
    callback: async () => {
      const { status, error } = await retireOffers({
        ...values,
        eventId: String(route.params.eventId),
      })

      if (status.value === 'success') {
        refreshOfferTable()
        resetMultipleSelect.value?.()
        updateConfirmModal({
          title: 'Oferta(s) retirada(s)',
          message: 'La(s) oferta(s) ha sido retirada(s) exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'No se pudo retirar oferta(s). Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al rechazar Oferta(s)',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
