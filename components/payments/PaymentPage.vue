<template>
  <section>
    <ContentLayout title="Abonos">
      <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
      <PaymentsPaymentSummary />

      <div class="w-full flex flex-col mt-5">
        <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
          <CustomTable
            class="mb-4"
            :data="paymentsData"
            :header="paymentsHeader(props.type)"
            :search="paymentsSearch"
            @on-sort="onSort"
            @on-search="onSearch"
          >
            <template #compostPropertyPaymentFile="{ row }">
              <Button
                variant="ghost"
                size="icon"
                class="flex items-center justify-center rounded-full"
                @click="handleCompostComissionPaymentFile(row)"
              >
                <CustomIcons
                  :name="
                    compostPaymentStatus.get(row.compostPropertyPaymentFile)
                      ?.icon || 'Doc-Loupe'
                  "
                  :class="
                    compostPaymentStatus.get(row.compostPropertyPaymentFile)
                      ?.class || 'text-gray-500'
                  "
                />
              </Button>
            </template>
            <template #compostComissionPaymentFile="{ row }">
              <Button
                variant="ghost"
                size="icon"
                class="flex items-center justify-center rounded-full"
                @click="handleCompostComissionPaymentFile(row)"
              >
                <CustomIcons
                  :name="
                    compostPaymentStatus.get(row.compostComissionPaymentStatus)
                      ?.icon || 'Doc-Loupe'
                  "
                  :class="
                    compostPaymentStatus.get(row.compostComissionPaymentStatus)
                      ?.class || 'text-gray-500'
                  "
                />
              </Button>
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
                          GrantId.OrganizationPaymentCanObserve,
                        )
                      "
                    >
                      <DropdownMenuItem
                        @click="
                          () => {
                            paymentId = row.id
                            openModalObservePayment = true
                          }
                        "
                      >
                        Observar abono
                        <CustomIcons name="EyeIcon" class="ml-auto" />
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div
                      v-if="
                        myGrants.data.value.includes(
                          GrantId.OrganizationPaymentCanConfirm,
                        )
                      "
                    >
                      <DropdownMenuItem
                        @click="handleConfirmComissionPayment(row.id)"
                      >
                        Confirmar abono
                        <CustomIcons name="ArrowLeft" class="ml-auto" />
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </template>
            <template #status="{ row }">
              <CustomChip
                :text="paymentStatus.get(row.status)?.name || ''"
                :variant="paymentStatus.get(row.status)?.color as any"
              ></CustomChip>
            </template>
          </CustomTable>
          <SheetContent
            v-model:open="openCompostComissionPaymentFileSheet"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <ComposeComissionPaymentFileForm
              :id="paymentId || ''"
              :on-observe="onObserveComissionButtonPressed"
              :on-confirm="handleConfirmComissionPayment"
              :close-modal="() => (openModalObservePayment = false)"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openModalObservePayment"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <PaymentsForm
              :id="paymentId"
              :on-submit="handleObserve"
              :close-modal="() => (openModalObservePayment = false)"
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
import ComposeComissionPaymentFileForm from './ComposeComissionPaymentFileForm.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import type { IPaymentsLItem } from '@/types/Payment.ts'
import {
  paymentsHeader,
  paymentStatus,
  paymentsSearch,
} from '~/constants/payments'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { GrantId } from '~/types/Grant'
import { compostPaymentStatus } from '~/constants/evidenceOrg'
const props = defineProps<{
  type: 'organization' | 'platform'
  organizationId: string | null
}>()
const session = useUserSessionExtended()
const filterOptions = ref(
  props.type === 'organization'
    ? `[{ "field": "organization.id", "type": "equal", "value": "${session.getDefaultOrganization().id}" }]`
    : '[]',
)
const openModalObservePayment = ref(false)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const {
  confirmPayment,
  confirmPropertyPayment,
  observePayment,
  page,
  sortOptions,
  onSort,
} = usePaymentAPI()
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
const paymentId = ref<string | undefined>(undefined)
const BASE_PAY_URL = '/payment-management'
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
    { field: 'status', type: 'equal', value: item.status || '' },
    { field: 'organization.name', type: 'like', value: item.organization },
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
}
const { data, refresh }: any = await useAPI(
  `${BASE_PAY_URL}/view-payments-paginated-for-organization`,
  {
    query: {
      limit: 10,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
  true,
)
const openCompostComissionPaymentFileSheet = ref(false)

const handleCompostComissionPaymentFile = (row: any) => {
  paymentId.value = row.id
  openCompostComissionPaymentFileSheet.value = true
}

const onObserveComissionButtonPressed = (row: any) => {
  paymentId.value = row.id
  openModalObservePayment.value = true
}

const paymentsData = computed(() =>
  data.value.data.map((item: IPaymentsLItem, index: number) => ({
    date: new Date(item.createdAt).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    ...item,
    event: item.event?.name || '-',
  })),
)

const handleConfirmComissionPayment = async () => {
  // console.log(paymentId)
  openConfirmModal({
    title: 'Confirmar sustento de pago de comisión',
    message: `¿Está seguro de que deseas confirmar este abono?`,
    callback: async () => {
      // const { paymentId } = values;
      const { status, error } = await confirmPayment({
        paymentId: paymentId.value,
      })
      if (status.value === 'success') {
        refresh()
        resetMultipleSelect.value?.()
        updateConfirmModal({
          title: 'Abono confirmado',
          message: 'El abono ha sido confirmado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error?.value?.data?.errors?.[0]?.message ||
          error?.value?.data?.message ||
          'No se pudo confirmar Abono. Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al confirmar Abono',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
const handleConfirm = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar abono',
    message: '¿Estás seguro de que deseas actualizar este Abono?',
    callback: async () => {
      const { status, error }: any = await observePayment(values)
      if (status.value === 'success') {
        openModalObservePayment.value = false
        refresh()
        updateConfirmModal({
          title: 'Abono actualizado',
          message: 'El abono ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El abono no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar bono',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleObserve = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar abono',
    message: '¿Estás seguro de que deseas actualizar este Abono?',
    callback: async () => {
      const { status, error }: any = await observePayment(values)
      if (status.value === 'success') {
        openModalObservePayment.value = false
        refresh()
        updateConfirmModal({
          title: 'Abono actualizado',
          message: 'El abono ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El abono no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar bono',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
