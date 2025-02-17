<template>
  <ContentLayout title="Usuarios">
    <CustomSimpleCard
      title="Panel de participantes"
      class="mb-6"
      sub-title="Gestiona participantes"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 pb-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="adminsData"
          :header="participantsHeader"
          :search="participantSearch()"
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #type="{ row }">
            <span class="whitespace-nowrap">{{
              userType.get(row.type) || ''
            }}</span>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="row.status === 'ACTIVE' ? 'Activo' : 'Suspendido'"
              :variant="row.status === 'ACTIVE' ? 'default' : 'destructive'"
            ></CustomChip>
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
                    :disabled="
                      row.status !== 'SUSPENDED' ||
                      !myGrants.data.value.includes(
                        GrantId.PlatformUsersCanReactivateParticipant,
                      )
                    "
                    @click="onReactivateButtonPressed(row.id)"
                  >
                    <span class="flex justify-between w-full">
                      Reactivar
                      <UnlockIcon class="size-5" />
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
        </CustomTable>
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
import { UnlockIcon } from 'lucide-vue-next'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import { userType } from '~/constants/administrators'
import type { IAdminsLItem } from '@/types/Administrators.ts'
import { participantSearch, participantsHeader } from '~/constants/participants'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { GrantId } from '~/types/Grant'

const route = useRoute()
const { getMyGrants } = useAuthManagement()

const myGrants = await getMyGrants()
const { page, sortOptions, onSort } = useAdmins()
const filterOptions = ref(
  `[{"field":"type","type":"equal","value": "PARTICIPANT"}]`,
)
const openModal = ref(false)
const admsUserId = ref<number | undefined>(undefined)
const BASE_ADM_URL = '/user-management'
const onSearch = (item: { [key: string]: string }) => {
  const filters = [
    { field: 'type', type: 'equal', value: 'PARTICIPANT' || '' },
    { field: 'commonName', type: 'like', value: item.commonName || '' },
    { field: 'email', type: 'like', value: item.email || '' },
    { field: 'phoneNumber', type: 'like', value: item.phoneNumber || '' },
    { field: 'status', type: 'equal', value: item.status || '' },
    {
      field: 'createdAt',
      type: 'equal',
      value: item.createdAt || '',
    },
  ]
  filterOptions.value = JSON.stringify(filters)
  page.value = 1
}

const { data, refresh }: any = await useAPI(
  `${BASE_ADM_URL}/find-participants-paginated`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const { openConfirmModal, updateConfirmModal } = useConfirmModal()

const reactivateParticipantAccount = async (userId: string) => {
  const data = await useAPI(`/auth-management/reactivate-participant-account`, {
    method: 'POST',
    body: {
      userId,
    },
  } as any)
  return data
}

const onReactivateButtonPressed = (userId: string) => {
  openConfirmModal({
    title: 'Reactivar participante',
    message: '¿Estás seguro de reactivar a este participante?',
    callback: async () => {
      const { status, error } = await reactivateParticipantAccount(userId)
      if (status.value === 'success') {
        refresh()
        updateConfirmModal({
          title: 'Usuario actualizado',
          message: 'El usuario ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value?.data?.errors?.[0].message ||
          error.value?.data.message ||
          'El usuario no se pudo reactivar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al reactivar al usuario',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const adminsData = computed(
  () => data.value.data,
  // data.value.data.map((item: IAdminsLItem) => ({
  //   fullName: `${item.firstName} ${item.lastName}`,
  //   document: `${item.documentType} - ${item.documentIdentifier}`,
  //   cellphone: item.phoneNumber,
  //   organization: item.organizations.map((org) => org.name).join(', '),
  //   ...item,
  // })),
)
</script>
