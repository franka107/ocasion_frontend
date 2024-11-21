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
          :data="acccountData"
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
                  <DropdownMenuItem @click="openAccountDetailsModal = true">
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
              :text="rechargeStatus.get(row.status)?.name || ''"
              :variant="rechargeStatus.get(row.status)?.color as any"
            ></CustomChip>
          </template>
        </CustomTable>
        <SheetContent
          v-model:open="openAccountDetailsModal"
          class="flex flex-col h-full"
          custom-width="510px"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <AccountDetailsForm
            :on-submit="onAccountDetailsSubmit"
            @update:model-value="openAccountDetailsModal = false"
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
  accountHeader,
  accountSearch,
} from '~/constants/attention-tray'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import AccountDetailsForm from '~/components/attention-tray/account-validation/AccountDetailsForm.vue'
const openApplicationModal = ref(false)
const openParticipantModal = ref(false)
const { page, onSort, onSearch } = useTopUpRequests()
const onSubmit = (formData: any) => {
  console.log('Formulario enviado:', formData)
  openApplicationModal.value = false
}
const onParticipantSubmit = (formData: any) => {
  console.log('Detalle del participante enviado:', formData)
  openParticipantModal.value = false
}
const rechargeId = ref<number | undefined>(undefined)
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const rechargeModal = ref<any>({ offerId: '' })
const data = [
  {
    id: '0000',
    dateOfRequest: '2024-11-01',
    fullName: 'Rossi Ferrari',
    bank: 'Banco de crédito del Perú',
    coin: 'Dólar',
    destinationAccount: '0000 0000 0000 0000',
    livelihood: 'Documento ABC',
    status: 'EARRING',
    actions: '',
  },
  {
    id: '0000',
    dateOfRequest: '2024-10-25',
    fullName: 'Martini Lombardi',
    bank: 'Banco de crédito del Perú',
    coin: 'Dólar',
    destinationAccount: '0000 0000 0000 0000',
    livelihood: 'Documento XYZ',
    status: 'EARRING',
    actions: '',
  },
]
const acccountData = computed(() => data)
const openAccountDetailsModal = ref(false)
const onAccountDetailsSubmit = (formData: any) => {
  console.log('Detalle de cuenta enviado:', formData)
  openAccountDetailsModal.value = false
}
</script>
