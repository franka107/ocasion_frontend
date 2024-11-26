<template>
  <ContentLayout title="Organizaciones">
    <CustomSimpleCard
      title="Panel administrador"
      class="mb-6"
      sub-title="Gestiona eventos usuarios y reportes"
    />

    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          class="mb-4"
          :data="orderData"
          :header="organizationHeader"
          :search="organizationSearch"
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #action-button>
            <div
              v-if="
                myGrants.data.value.includes(
                  GrantId.PlatformOrganizationsCanCreate,
                )
              "
            >
              <Button
                variant="default"
                @click="
                  () => {
                    organizationRucNo = undefined
                    openModal = true
                  }
                "
                >Crear organización</Button
              >
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
                  <!-- <NuxtLink :to="`/organizations/${row.id}`"> -->
                  <!--   <DropdownMenuItem> Ver Organización </DropdownMenuItem> -->
                  <!-- </NuxtLink> -->
                  <!-- <DropdownMenuSeparator /> -->
                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOrganizationsCanSuspend,
                      )
                    "
                  >
                    <DropdownMenuItem
                      :disabled="row.status !== 'ACTIVE'"
                      @click="handleSuspend(row.id, row.name)"
                    >
                      Suspender
                      <CustomIcons name="Forbidden" class="ml-auto" />
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />

                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOrganizationsCanActivate,
                      )
                    "
                  >
                    <DropdownMenuItem
                      :disabled="row.status === 'ACTIVE'"
                      @click="handleActivate(row.id, row.name)"
                    >
                      Activar
                      <CustomIcons name="Reload" class="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>

                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOrganizationsCanAssignAdministrator,
                      )
                    "
                  >
                    <DropdownMenuItem
                      @click="
                        () => {
                          organizationId = row.id
                          openAssignAdministratorModal = true
                        }
                      "
                    >
                      Asignar administrador
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>

                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformOrganizationsCanUpdate,
                      )
                    "
                  >
                    <DropdownMenuItem @click="handleUpdateForm(row)">
                      Actualizar datos
                      <CustomIcons name="ArrowLeft" class="ml-auto" />
                    </DropdownMenuItem>
                  </div>
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
          <OrganizationForm
            :id="organizationRucNo"
            :on-submit="
              organizationRucNo !== undefined ? handleEdit : handleCreate
            "
          />
        </SheetContent>
        <!-- Fomulario -->

        <div>
          <SheetContent
            v-model:open="openAssignAdministratorModal"
            class="flex flex-col h-full"
            @pointer-down-outside="(e) => e.preventDefault()"
            @interact-outside="(e) => e.preventDefault()"
          >
            <OrganizationsOrganizationAssignAdministrator
              :organization-id="String(organizationId)"
              :onsubmit="handleAssignAdministrator"
            />
          </SheetContent>
        </div>
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
import { GrantId } from '~/types/Grant'
import OrganizationForm from '~/components/organizations/OrganizationForm.vue'
import CustomTable from '~/components/ui/custom-table/CustomTable.vue'
import CustomChip from '~/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import type { OrganizationItem } from '~/types/Order.ts'
import {
  organizationHeader,
  organizationSearch,
} from '~/constants/organization'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import CustomSimpleCard from '~/components/ui/custom-simple-card/CustomSimpleCard.vue'

const {
  page,
  filterOptions,
  sortOptions,
  onSort,
  onSearch,
  suspendOrganization,
  assignAdministrator,
  activateOrganization,
  createOrganization,
  editOrganization,
} = useOrganization()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { getMyGrants } = useAuthManagement()
const myGrants = await getMyGrants()
const BASE_ORG_URL = '/organization-management'
const { data, refresh }: any = await useAPI(
  `${BASE_ORG_URL}/find-organizations-paginated`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const openAssignAdministratorModal = ref(false)
const openModal = ref(false)
const organizationRucNo = ref<number | undefined>(undefined)
const orderData = computed(() =>
  data.value?.data.map((item: OrganizationItem) => ({
    ...item,
  })),
)

const organizationId = ref<string | undefined>('')

const handleAssignAdministrator = async (values: any) => {
  openConfirmModal({
    title: 'Asignar administrador',
    message: '¿Estás seguro de que deseas asignar este administrador?',
    callback: async () => {
      const { status, error }: any = await assignAdministrator(values)
      if (status.value === 'success') {
        openAssignAdministratorModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Asignación de administrador exitosa',
          message: 'El administrador se ha asignado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El administrador no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al asignar administrador',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleSuspend = async (id: string, name: string) => {
  openConfirmModal({
    title: 'Suspender organización',
    message: `¿Estás seguro de suspender a ❝${name}❞?`,
    callback: async () => {
      const { status, error }: any = await suspendOrganization(id)
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Suspensión exitosa!',
          message: 'La organización ha sido suspendida.',
          type: 'success',
        })
        refresh()
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'La organización no se pudo suspender. \nTe recomendamos intentarlo nuevamente.'
        updateConfirmModal({
          title: 'Error al suspender',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleActivate = async (id: string, name: string) => {
  openConfirmModal({
    title: 'Activar organización',
    message: `¿Estás seguro de activar a ❞${name}❞?`,
    callback: async () => {
      const { status, error }: any = await activateOrganization(id)
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Activación exitosa!',
          message: 'La organización ha sido activada.',
          type: 'success',
        })
        refresh()
      } else {
        updateConfirmModal({
          title: 'Error al activar',
          message:
            'La organización no se pudo activar. \nTe recomendamos intentarlo nuevamente.',
          type: 'error',
        })
      }
    },
  })
}

const handleUpdateForm = async (organization: any) => {
  console.log('QUACKK', organization.id)
  organizationRucNo.value = organization.id
  openModal.value = true
}

const handleCreate = async (values: any) => {
  openConfirmModal({
    title: 'Crear organización',
    message: '¿Estás seguro de que deseas crear esta organización?',
    callback: async () => {
      const { status, error }: any = await createOrganization(values)
      if (status.value === 'success') {
        openModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Organización creada',
          message: 'La organización ha sido creada exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'La organización no se pudo crear, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear organización',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleEdit = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar organización',
    message: '¿Estás seguro de que deseas actualizar esta organización?',
    callback: async () => {
      const { status, error }: any = await editOrganization(values)
      if (status.value === 'success') {
        openModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Organización actualizada',
          message: 'La organización ha sido actualizada exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'La organización no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear organización',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
