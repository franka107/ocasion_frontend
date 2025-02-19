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
          :search="
            myGrants.data.value.includes(
              GrantId.PlatformUsersCanFilterParticipants,
            )
              ? participantSearch()
              : []
          "
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #action-button>
            <div class="flex flex-row space-x-2">
              <Button
                v-if="
                  myGrants.data.value.includes(
                    GrantId.PlatformUsersCanExportParticipants,
                  )
                "
                variant="default"
                class="bg-white text-primary border border-[#052339]"
                @click="handleExport"
              >
                <CustomIcons name="Download" class="ml-auto" />
                Exportar
              </Button>
            </div>
          </template>

          <template #documentIdentifier="{ row }">
            <div class="flex gap-2">
              <Badge variant="outline">
                {{ row.documentType }}
              </Badge>

              <span class="whitespace-nowrap">{{
                row.documentIdentifier
              }}</span>
            </div>
          </template>
          <template #status="{ row }">
            <Popover>
              <div class="flex flex-row gap-2">
                <CustomChip
                  :text="userStatusMap[row.status as UserStatus].name"
                  :variant="userStatusMap[row.status as UserStatus].color"
                ></CustomChip>
                <PopoverTrigger as-child>
                  <Button
                    v-if="row.status === 'SUSPENDED'"
                    size="icon"
                    variant="outline"
                    class="rounded-full size-6"
                  >
                    <EyeIcon class="size-4" />
                  </Button>
                </PopoverTrigger>
              </div>

              <PopoverContent class-name="w-80">
                <div>
                  <PropertyLabel
                    label="Razón de suspensión"
                    :description="row.suspensionReason"
                  />
                </div>
              </PopoverContent>
            </Popover>
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
                      (row.status !== 'SUSPENDED' &&
                        row.status !== 'BLOCKED') ||
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
                  <DropdownMenuItem
                    :disabled="
                      row.status !== 'ACTIVE' ||
                      !myGrants.data.value.includes(
                        GrantId.PlatformUsersCanSuspendParticipant,
                      )
                    "
                    @click="onSuspendButtonPressed(row.id)"
                  >
                    <span class="flex justify-between w-full">
                      Suspender
                      <UserX2 class="size-5" />
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

    <ModalSuspendParticipant
      :id="participantToSuspendId"
      :is-opened="isSuspendParticipantModalOpened"
      :refresh-table="
        () => {
          refresh()
          isSuspendParticipantModalOpened = false
        }
      "
      @update:model-value="isSuspendParticipantModalOpened = false"
    />
  </ContentLayout>
</template>
<script setup lang="ts">
import { EyeIcon, LockIcon, UnlockIcon, UserX2 } from 'lucide-vue-next'
import ModalSuspendParticipant from '../participants/ModalSuspendParticipant.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import { userType } from '~/constants/administrators'
import type { IAdminsLItem } from '@/types/Administrators.ts'
import { participantSearch, participantsHeader } from '~/constants/participants'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { GrantId } from '~/types/Grant'
import { UserStatus, userStatusMap } from '~/models/user'
import PropertyLabel from '~/design-system/berlin/labels/property-label/PropertyLabel.vue'
import Badge from '~/design-system/ui/badge/Badge.vue'

const route = useRoute()
const { getMyGrants } = useAuthManagement()
const isSuspendParticipantModalOpened = ref(false)
const participantToSuspendId = ref('')

const myGrants = await getMyGrants()
const { page, sortOptions, onSort } = useAdmins()
const filterOptions = ref(
  `[{"field":"type","type":"equal","value": "PARTICIPANT"}]`,
)

const BASE_ADM_URL = '/user-management'
const onSearch = (item: { [key: string]: string }) => {
  const filters = [
    { field: 'quickSearch', type: 'like', value: item.quickSearch || '' },
    { field: 'status', type: 'equal', value: item.status || '' },
    {
      field: 'createdAt',
      type: 'between',
      value: item.createdAt || '',
    },
  ]
  if (item.status && item.status.length > 0) {
    filters.push({
      field: 'status',
      type: 'in',
      value: item.status,
    })
  }
  if (item.documentType && item.documentType.length > 0) {
    filters.push({
      field: 'documentType',
      type: 'in',
      value: item.documentType,
    })
  }

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

const userSession = useUserSession()

const handleExport = async () => {
  openConfirmModal({
    title: 'Exportar usuarios',
    message: '¿Estás seguro de que deseas exportar los usuarios?',
    callback: async () => {
      try {
        const { apiUrl } = useRuntimeConfig().public
        const response = await fetch(
          `${apiUrl}/user-management/export-participants?filterOptions=${filterOptions.value}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userSession.user.value?.token}`,
              'Content-Type': 'application/json',
            },
          },
        )
        // Convertir la respuesta en un blob
        const blob = await response.blob()

        // Crear un enlace temporal para la descarga
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', 'participantes.csv')
        document.body.appendChild(link)
        link.click()
        link.remove()

        // Liberar la URL del blob
        URL.revokeObjectURL(link.href)

        if (!response.ok) {
          const error = await response.json()
          const eMsg =
            error.errors?.[0].message ||
            error.message ||
            'Error al exportar usuarios. Inténtalo de nuevo más tarde.'
          updateConfirmModal({
            title: 'Error al exportar usuarios',
            message: String(eMsg),
            type: 'error',
          })
        }

        // ------------------------------------------------
        // const { apiUrl } = useRuntimeConfig().public
        // const link = document.createElement('a')
        // link.href = `${apiUrl}/user-management/export-users`
        // link.setAttribute('download', 'usuarios.csv')
        // document.body.appendChild(link)
        // link.click()
        // link.remove()
      } catch (error) {
        const eMsg =
          error || 'Error al exportar usuarios. Inténtalo de nuevo más tarde.'
        updateConfirmModal({
          title: 'Error al exportar usuarios',
          message: String(eMsg),
          type: 'error',
        })
      }

      updateConfirmModal({
        title: 'Exportación exitosa',
        message: 'Los usuarios han sido exportados exitosamente.',
        type: 'success',
      })
    },
  })
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

const onSuspendButtonPressed = (userId: string) => {
  participantToSuspendId.value = userId
  isSuspendParticipantModalOpened.value = true
}
const adminsData = computed(() => data.value.data)
</script>
