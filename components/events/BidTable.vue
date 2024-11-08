<template>
  <section>
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto mt-6">
        <CustomTable
          :data="bidsData"
          :header="bidsHeader"
          :search="bidsSearch"
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
              v-if="
                myGrants.data.value.includes(GrantId.OrganizationBidCanReject)
              "
              variant="default"
              :disabled="disableMultipleSelect"
              class="bg-white text-primary border border-primary hover:bg-accent"
              @click="handleRejectBid(selectedMultipleData)"
            >
              Rechazar puja
            </Button>
            <Button
              v-if="
                myGrants.data.value.includes(GrantId.OrganizationBidCanAccept)
              "
              :disabled="disableMultipleSelect"
              class="bg-white text-primary border border-primary hover:bg-accent"
              @click="handleAddBid(selectedMultipleData)"
              >Aceptar puja
            </Button>
            <!-- <Button -->
            <!--   @click="" -->
            <!--   :disabled="disableMultipleSelect" -->
            <!--   variant="default" -->
            <!--   >Contraofertar -->
            <!-- </Button> -->
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
                  <DropdownMenuItem
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.OrganizationBidCanCounterOffer,
                      )
                    "
                    @click="
                      () => {
                        // bidsId = row.id;
                        // openAppraisalHistoryModal = true;
                        // appraisalHistoryModal = { offerId: row.id };
                        openModalCounterOffer = true
                        selectedCounterOfferInfo = {
                          currentAmount: row.amount,
                          id: row.id,
                        }
                      }
                    "
                  >
                    <div class="flex items-center space-x-2">
                      <span>Contraofertar</span>
                    </div>
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
                      <span>Historial de puja</span>
                      <CustomIcons name="Clock-Timer" class="ml-auto" />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="bidStatus.get(row.status)?.name || ''"
              :variant="bidStatus.get(row.status)?.color as any"
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
            :endpoint="findBidHistories"
            title="Historial de pujas"
          />
        </SheetContent>
        <CounterOfferBidModal
          :id="selectedCounterOfferInfo.id"
          v-model="openModalCounterOffer"
          :current-amount="selectedCounterOfferInfo.currentAmount"
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
import CounterOfferBidModal from '../bid/CounterOfferBidModal.vue'
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import { bidsHeader, bidsSearch, bidStatus } from '@/constants/bids'
import type { BidDto, OfferWithBidDto } from '~/types/Bids'
import type { IAmountHistoryModal } from '~/types/Offer'
import { GrantId } from '~/types/Grant'

const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { rejectOfferBids, acceptOfferBids, page, sortOptions, onSort } =
  useBidAPI()
const findBidHistories = '/audit/find-bid-histories'
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
const BID_BASE_URL = '/bid-management'
const openModal = ref(false)
const openAppraisalHistoryModal = ref(false)
const appraisalHistoryModal = ref<IAmountHistoryModal>({ offerId: '' })
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
const selectedCounterOfferInfo = ref({ currentAmount: 0, id: '' })
const filterOptions = ref(
  `[{ "field": "event.id", "type": "equal", "value": "${route.params.eventId}" }]`,
)
const onSearch = (item: { [key: string]: string }) => {
  filterOptions.value = JSON.stringify([
    { field: 'title', type: 'like', value: item.title || '' },
    { field: 'status', type: 'equal', value: item.status || '' },
    { field: 'event.id', type: 'equal', value: route.params.eventId },
  ])
}
const { data, refresh }: any = await useAPI(
  `${BID_BASE_URL}/find-bids-paginated`,
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
      date: new Date(item.createdAt).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),

      ...item,
    })) || [],
)

const handleRejectBid = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: 'Rechazar puja',
    message: `¿Está seguro de rechazar la(s) puja(s) seleccionada(s)?`,
    callback: async () => {
      const { status, error } = await rejectOfferBids({
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
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'No se pudo rechazar puja(s). Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al rechazar puja(s)',
          message: eMsg,
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
</script>
