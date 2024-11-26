<template>
  <ContentLayout title="Administradores">
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="adminsData"
          class="mb-4"
          multiple-select
          :header="
            administratorsHeader(
              props.organizationId ? 'organization' : 'platform',
            )
          "
          :search="
            administratorsSearch(
              props.organizationId ? 'organization' : 'platform',
            )
          "
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
                  (myGrants.data.value.includes(
                    GrantId.PlatformUsersCanSuspend,
                  ) ||
                    myGrants.data.value.includes(
                      GrantId.OrganizationUsersCanSuspend,
                    )) &&
                  !disableMultipleSelect
                "
                class="bg-white text-primary border border-primary hover:bg-accent"
                variant="default"
                @click="handleSuspendUsers(selectedMultipleData)"
                >Suspender usuarios
              </Button>
              <Button
                v-if="
                  myGrants.data.value.includes(
                    GrantId.PlatformUsersCanExportAdministrators,
                  ) ||
                  myGrants.data.value.includes(
                    GrantId.OrganizationUsersCanExportAdministrators,
                  )
                "
                variant="default"
                class="bg-white text-primary border border-[#052339]"
                :disabled="!disableMultipleSelect"
                @click="handleExport"
              >
                <CustomIcons name="Download" class="ml-auto" />
                Exportar
              </Button>
              <Button
                v-if="
                  myGrants.data.value.includes(
                    GrantId.PlatformUsersCanCreate,
                  ) ||
                  myGrants.data.value.includes(
                    GrantId.OrganizationUsersCanCreate,
                  )
                "
                variant="default"
                @click="
                  () => {
                    admsUserId = undefined
                    openModal = true
                  }
                "
                >Agregar</Button
              >
            </div>
          </template>
          <template #type="{ row }">
            <span class="whitespace-nowrap">{{
              userType.get(row.type) || ''
            }}</span>
          </template>
          <template #organizations="{ row }">
            <div v-if="row.organizations.length === 0">
              <span class="whitespace-nowrap">-</span>
            </div>
            <div v-else-if="row.organizations.length === 1">
              <Badge> {{ row.organizations[0].name }} </Badge>
            </div>
            <div v-else>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge> {{ row.organizations[0].name }} </Badge>
                    <Badge variant="outline" class="ml-1"> ... </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div v-for="org in row.organizations" :key="org.id">
                      <p>{{ org.name }}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                  <!-- <div -->
                  <!--   v-if=" -->
                  <!--     myGrants.data.value.includes( -->
                  <!--       GrantId.PlatformUsersCanSuspend, -->
                  <!--     ) -->
                  <!--   " -->
                  <!-- > -->
                  <!--   <DropdownMenuItem -->
                  <!--     :disabled="row.status !== 'ACTIVE'" -->
                  <!--     @click="handleSuspend(row.id, row.fullName)" -->
                  <!--   > -->
                  <!--     Suspender -->
                  <!--     <CustomIcons name="Forbidden" class="ml-auto" /> -->
                  <!--   </DropdownMenuItem> -->
                  <!-- </div> -->

                  <DropdownMenuSeparator />

                  <DropdownMenuItem @click="handleResetPassword(row.email)">
                    Reenviar Correo
                    <CustomIcons name="Reload" class="ml-auto" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    :disabled="
                      !isHigherOrEqualUserType(row.type, loggedUser.type)
                    "
                    @click="handleUpdateForm(row)"
                  >
                    Actualizar datos
                    <CustomIcons name="ArrowLeft" class="ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="row.status === 'ACTIVE' ? 'Activo' : 'Suspendido'"
              :variant="row.status === 'ACTIVE' ? 'default' : 'destructive'"
            ></CustomChip>
          </template>
        </CustomTable>
        <!-- Fomulario -->
        <SheetContent
          v-model:open="openModal"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <AdministratorsForm
            :id="admsUserId"
            :on-submit="admsUserId !== undefined ? handleEdit : handleCreate"
          />
        </SheetContent>
        <!-- Fomulario -->
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
import AdministratorsForm from '~/components/users/administrators/AdministratorsForm.vue'
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import {
  userType,
  administratorsHeader,
  administratorsSearch,
} from '~/constants/administrators'
import type { IAdminsLItem } from '@/types/Administrators.ts'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'
import { GrantId } from '~/types/Grant'

const user = useUserSession()
const myId = user.user.value?.user.id

const props = defineProps<{ organizationId: string | null }>()
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
const userSession = useUserSession()
const {
  page,
  sortOptions,
  onSort,
  suspendUsers,
  createUser,
  restoreUserPassword,
  editUser,
  resetUser,
} = useAdmins()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const filterOptions = ref('[]')

const { user: loggedUser } = useUserSessionExtended()

const openModal = ref(false)
const admsUserId = ref<number | undefined>(undefined)
const BASE_ADM_URL = '/user-management'
const onSearch = (item: { [key: string]: string }) => {
  const filters = [
    {
      field: 'organization.name',
      type: 'like',
      value: item.organizationName || '',
    },

    { field: 'type', type: 'not', value: 'PARTICIPANT' || '' },
    { field: 'fullName', type: 'like', value: item.fullName || '' },
    { field: 'email', type: 'like', value: item.email || '' },
    { field: 'phoneNumber', type: 'like', value: item.phoneNumber || '' },
  ]
  item.status &&
    filters.push({ field: 'status', type: 'equal', value: item.status || '' })

  if (item.createdAt) {
    filters.push({
      field: 'createdAt',
      type: 'between',
      value: item.createdAt,
    })
  }
  filterOptions.value = JSON.stringify(filters)
}

const { data, refresh }: any = await useAPI(
  `${BASE_ADM_URL}/find-administrators-paginated`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const adminsData = computed(() =>
  data.value.data.map((item: IAdminsLItem) => ({
    fullName: `${item.firstName} ${item.lastName}`,
    document: `${item.documentType} - ${item.documentIdentifier}`,
    cellphone: item.phoneNumber,
    organization: item.organizations.map((org) => org.name).join(', '),
    ...item,
  })),
)

const resetMultipleSelect = ref<Function | undefined>(undefined)
const route = useRoute()
const handleSuspendUsers = async (values: { type: string; ids: string[] }) => {
  openConfirmModal({
    title: 'Suspender usuarios',
    message: `¿Está seguro de suspender a lo(s) usuario(s) seleccionado(s)?`,
    callback: async () => {
      const { type, ids } = values
      const { status, error } = await suspendUsers({
        type,
        ids,
      })
      if (status.value === 'success') {
        refresh()
        resetMultipleSelect.value?.()
        updateConfirmModal({
          title: 'Usuario(s) suspendidos(s)',
          message: 'Lo(s) usuarios(s) ha sido suspendido(s) exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'No se pudo suspender usuario(s). Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al suspender Usuario(s)',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleSuspend = async (id: string, fullName: string) => {
  openConfirmModal({
    title: 'Suspender usuario',
    message: `¿Estás seguro de suspender a ❝${fullName}❞?`,
    callback: async () => {
      const { status, error }: any = await suspendUser(id)
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Suspensión exitosa!',
          message: 'El usuario ha sido suspendido.',
          type: 'success',
        })
        refresh()
      } else {
        updateConfirmModal({
          title: 'Error al suspender',
          message:
            'El usuario no se pudo suspender. \nTe recomendamos intentarlo nuevamente.',
          type: 'error',
        })
      }
    },
  })
}

const handleActivate = async (id: string, fullName: string) => {
  openConfirmModal({
    title: 'Activar usuario',
    message: `¿Estás seguro de activar a ❝${fullName}❞?`,
    callback: async () => {
      const { status, error }: any = await suspendUser(id)
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Activación exitosa!',
          message: 'El usuario ha sido activado.',
          type: 'success',
        })
        refresh()
      } else {
        updateConfirmModal({
          title: 'Error al activar',
          message:
            'El usuario no se pudo suspender. \nTe recomendamos intentarlo nuevamente.',
          type: 'error',
        })
      }
    },
  })
}

const handleUpdateForm = async (user: any) => {
  openModal.value = true
  admsUserId.value = user.id
}

const handleCreate = async (values: any) => {
  console.log('handleCreate ejecutado', values)
  openConfirmModal({
    title: 'Crear usuario',
    message: '¿Estás seguro de que deseas crear este usuario?',
    callback: async () => {
      const { status, error }: any = await createUser(values)
      if (status.value === 'success') {
        openModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Usuario creado',
          message: 'El usuario ha sido creado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El usuario no se pudo crear, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear usuario',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleEdit = async (values: any) => {
  console.log('handleEdit ejecutado', values)
  openConfirmModal({
    title: 'Actualizar usuario',
    message: '¿Estás seguro de que deseas actualizar este usuario?',
    callback: async () => {
      const { status, error }: any = await editUser(values)
      if (status.value === 'success') {
        openModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Usuario actualizado',
          message: 'El usuario ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El usuario no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar usuario',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleResetPassword = async (email: string) => {
  openConfirmModal({
    title: 'Restablecer contraseña de usuario',
    message: '¿Estás seguro de que deseas restablecer contraseña de usuario?',
    callback: async () => {
      console.log('')
      const { status, error }: any = await restoreUserPassword(email)
      if (status.value === 'success') {
        openModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Contraseña de usuario restablecida',
          message: 'El usuario ha restablecido la contraseña exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El usuario no se pudo restablecer la contraseña de usuario, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al restablecer contraseña de usuario',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const selectedMultipleData = ref<{ type: string; ids: string[] }>({
  type: 'empty',
  ids: [],
})
const disableMultipleSelect = computed(
  () =>
    selectedMultipleData.value.type === 'empty' &&
    selectedMultipleData.value.ids.length === 0,
)

const handleExport = async () => {
  openConfirmModal({
    title: 'Exportar usuarios',
    message: '¿Estás seguro de que deseas exportar los usuarios?',
    callback: async () => {
      try {
        const { apiUrl } = useRuntimeConfig().public
        const response = await fetch(
          `${apiUrl}/user-management/export-users?filterOptions=${filterOptions.value}`,
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
        link.setAttribute('download', 'usuarios.csv')
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
</script>
