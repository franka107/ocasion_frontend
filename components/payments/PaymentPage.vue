<template>
  <section>
    <ContentLayout title="Abonos">
      <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
      <PaymentsPaymentSummary />

      <div class="w-full flex flex-col mt-5">
        <span class="text-yellow-500"></span>
        <span class="text-green-500"></span>
        <span class="text-blue-500"></span>
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
                :disabled="!row.compostPropertyPaymentFile"
                @click="handleCompostPropertyPaymentFile(row)"
              >
                <CustomIcons
                  :name="
                    compostPaymentStatus.get(row.compostPropertyPaymentStatus)
                      ?.icon || 'Doc-Loupe'
                  "
                  :class="
                    compostPaymentStatus.get(row.compostPropertyPaymentStatus)
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
                :disabled="!row.compostComissionPaymentStatus"
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
                          GrantId.OrganizationPaymentPropertyCanObserve,
                        )
                      "
                    >
                      <DropdownMenuItem
                        @click="
                          () => {
                            paymentId = row.id
                            openModalObservePropertyPayment = true
                          }
                        "
                      >
                        Observar abono de propiedad
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
              :close-modal="() => (openModalObserveComissionPayment = false)"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openCompostPropertyPaymentFileSheet"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <ComposePropertyPaymentFileForm
              :id="paymentId || ''"
              :on-observe="onObservePropertyButtonPressed"
              :on-confirm="handleConfirmPropertyPayment"
              :close-modal="() => (openModalObserveComissionPayment = false)"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openModalObserveComissionPayment"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <ObserveComissionPaymentForm
              :id="paymentId"
              :on-submit="handleComissionObserve"
              :close-modal="() => (openModalObserveComissionPayment = false)"
            />
          </SheetContent>
          <SheetContent
            v-model:open="openModalObservePropertyPayment"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <ObservePropertyPaymentForm
              :id="paymentId"
              :on-submit="handlePropertyObserve"
              :close-modal="() => (openModalObservePropertyPayment = false)"
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
import ComposePropertyPaymentFileForm from './ComposePropertyPaymentFileForm.vue'
import ObserveComissionPaymentForm from './ObserveComissionPaymentForm.vue'
import ObservePropertyPaymentForm from './ObservePropertyPaymentForm.vue'
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
const openModalObserveComissionPayment = ref(false)
const openModalObservePropertyPayment = ref(false)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const {
  confirmComissionPayment,
  confirmPropertyPayment,
  observeComissionPayment,
  observePropertyPayment,
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
const openCompostPropertyPaymentFileSheet = ref(false)

const handleCompostComissionPaymentFile = (row: any) => {
  paymentId.value = row.id
  openCompostComissionPaymentFileSheet.value = true
}

const handleCompostPropertyPaymentFile = (row: any) => {
  paymentId.value = row.id
  openCompostPropertyPaymentFileSheet.value = true
}

const onObserveComissionButtonPressed = (row: any) => {
  // paymentId.value = row.id
  openModalObserveComissionPayment.value = true
}

const onObservePropertyButtonPressed = (row: any) => {
  // paymentId.value = row.id
  openModalObservePropertyPayment.value = true
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
      const { status, error } = await confirmComissionPayment({
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

const handleConfirmPropertyPayment = async () => {
  // console.log(paymentId)
  openConfirmModal({
    title: 'Confirmar sustento de pago de propiedad',
    message: `¿Está seguro de que deseas confirmar este abono?`,
    callback: async () => {
      // const { paymentId } = values;
      const { status, error } = await confirmPropertyPayment({
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
      const { status, error }: any = await observeComissionPayment({
        ...values,
        paymentId: paymentId.value,
      })

      if (status.value === 'success') {
        openModalObserveComissionPayment.value = false
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
          title: 'Error al actualizar abono',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handlePropertyObserve = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar abono de propiedad',
    message: '¿Estás seguro de que deseas actualizar este Abono de propiedad?',
    callback: async () => {
      const { status, error }: any = await observePropertyPayment({
        ...values,
        paymentId: paymentId.value,
      })
      if (status.value === 'success') {
        openModalObserveComissionPayment.value = false
        refresh()
        updateConfirmModal({
          title: 'Abono de propiedad',
          message: 'El abono de propiedad ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El abono de propiedad no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar abono de propiedad',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleComissionObserve = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar abono de comisión',
    message: '¿Estás seguro de que deseas actualizar este Abono de comisión?',
    callback: async () => {
      const { status, error }: any = await observeComissionPayment({
        ...values,
        paymentId: paymentId.value,
      })
      if (status.value === 'success') {
        openModalObserveComissionPayment.value = false
        refresh()
        updateConfirmModal({
          title: 'Abono de comisión',
          message: 'El abono de comisión  ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El abono de comisión no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar sustento de abono de comisión',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
