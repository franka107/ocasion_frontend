<template>
  <ContentLayout title="Validación de cuentas">
    <CustomSimpleCard
      title="Listado de validación de cuentas"
      class="mb-6"
      sub-title="Vizualización de las validaciones de cuentas"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          class="mb-4"
          :data="accountData"
          :header="accountHeader"
          :search="accountSearch"
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
                  <DropdownMenuItem @click="openAccountDetail(row)">
                    Detalle de cuenta
                    <CustomIcons name="EyeIcon" class="ml-4" />
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
              :text="accountStatus.get(row.status)?.name || ''"
              :variant="accountStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
        </CustomTable>
        <SheetContent
          v-model:open="openAccountDetailModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <AccountDetailsForm
            v-model="openAccountDetailModal"
            :id="accountId"
            @submit="onAccountDetailSubmit"
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
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type { OrganizationItem } from '~/types/Order.ts'
import {
  accountStatus,
  accountHeader,
  accountSearch,
} from '~/constants/attention-tray'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import AccountDetailsForm from '~/components/attention-tray/account-validation/AccountDetailsForm.vue'
import dayjs from 'dayjs'
import { useAccountValidation } from '@/composables/useAccountValidation'
const openApplicationModal = ref(false)
const openParticipantModal = ref(false)
const {
    page,
    onSort,
    onSearch,
    filterOptions,
    sortOptions,
  } = useAccountValidation()
const accountId = ref<number | undefined>(undefined)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()

const BASE_VAL_URL = '/finance/account-validation'
const { data, refresh }: any = await useAPI(
  `${BASE_VAL_URL}/view-paginated-account-validations`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)
const accountData = computed(() =>
  data.value?.data.map((item: any) => ({
    fullName: item.participant.commonName,
    ...item,
    createdAt: dayjs(item.updatedAt).format('YYYY-MM-DD'),
  })),
)

const openAccountDetailsModal = ref(false)
const openAccountDetailModal = ref(false)
const openAccountDetail = (row: any) => {
  const accountDetailId = row.id;
  if (accountId) {
    accountId .value = accountDetailId;
    console.log('Abriendo detalle del participante:', accountDetailId);
    openAccountDetailModal.value = true;
  } else {
    console.error('No se encontró el participante para esta fila.');
  }
};
const onAccountDetailSubmit = (formData: any) => {
  console.log('Detalle de solicitud enviado:', formData)
  openAccountDetailModal.value = false
}
</script>
