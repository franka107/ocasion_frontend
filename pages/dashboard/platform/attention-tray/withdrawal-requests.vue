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
                  <DropdownMenuItem @click="openWithdrawalDetails(row.id)">
                    Detalle solicitud
                    <CustomIcons name="EyeIcon" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="openParticipant(row.id)">
                    Detalle participante
                    <CustomIcons name="EyeIcon" class="ml-[10px]" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #livelihood="{ row }">
            <div class="flex items-center justify-center" @click="">
              <CustomIcons name="Doc-Loupe" />
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
            v-model="openWithdrawalDetailsModal"
            @submit="onWithdrawalDetailsSubmit"
          />
        </SheetContent>
        <SheetContent
          v-model:open="openParticipantModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <ParticipantDetailEditForm
            v-model="openParticipantModal"
            @submit="onParticipantSubmit"
          />
        </SheetContent>
      </div>
      <CustomPagination
        v-model:page="page"
        class="mt-5 mb-[19px]"
        :total="1"
        :limit="1"
      />
    </div>
  </ContentLayout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type { OrganizationItem } from '~/types/Order.ts'
import {
  rechargeStatus,
  withdrawalRequeststHeader,
  withdrawalRequestsSearch,
} from '~/constants/attention-tray'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import ParticipantDetailEditForm from '~/components/attention-tray/withdrawal-requests/ParticipantDetailEditForm.vue'
import WithdrawalDetailsForm from '~/components/attention-tray/withdrawal-requests/WithdrawalDetailsForm.vue'
import dayjs from 'dayjs'

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
const openApplicationModal = ref(false)
const openParticipantModal = ref(false)
const selectedRequestId = ref<string | null>(null)
const openWithdrawalDetailsModal = ref(false)
const openWithdrawalDetails = (requestId: string) => {
  selectedRequestId.value = requestId
  openWithdrawalDetailsModal.value = true
}
const onWithdrawalDetailsSubmit = (formData: any) => {
  console.log('Detalle de solicitud enviado:', formData)
  openWithdrawalDetailsModal.value = false
}
const selectedParticipantId = ref<string | null>(null)
const openParticipant = (participantId: string) => {
  selectedParticipantId.value = participantId
  openParticipantModal.value = true
}

const onParticipantSubmit = (formData: any) => {
  console.log('Detalle del participante enviado:', formData)
  openParticipantModal.value = false
}
const rechargeId = ref<number | undefined>(undefined)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const rechargeModal = ref<any>({ offerId: '' })
// const data = [
//   {
//     id: '000',
//     dateOfRequest: '2024-11-01',
//     fullName: 'Rossi Ferrari Lombardi',
//     transfer: '2024-11-10',
//     amount: '$ 1’000.00',
//     status: 'EARRING',
//     actions: '',
//   },
//   {
//     id: '000',
//     dateOfRequest: '2024-10-25',
//     fullName: 'Martini Lombardi Lombardi',
//     contractStartDate: '2024-11-01',
//     operation: '98765',
//     transfer: '2024-10-30',
//     amount: '$ 1’000.00',
//     status: 'EARRING',
//     actions: '',
//   },
const { page, onSort, onSearch, filterOptions, sortOptions } =
  useWithdrawalRequests()
const BASE_RECHAR_URL = '/finance/withdrawal-request-management'
const { data, refresh }: any = await useAPI(
  `${BASE_RECHAR_URL}/view-paginated-withdrawal-requests`,
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
  data.value?.data.map((item: any) => ({
    fullName: item.participant.commonName,
    ...item,
    //transferedAt: dayjs(item.transferedAt).format('YYYY-MM-DD'),
    createdAt: dayjs(item.updatedAt).format('YYYY-MM-DD'),
  })),
)
</script>
