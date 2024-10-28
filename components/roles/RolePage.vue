<template>
  <ContentLayout title="Roles">
    <div class="w-full flex flex-col">
      <div class="shadow-md rounded-lg px-6 bg-white flex-grow mb-auto">
        <CustomTable
          :data="roleData"
          :header="
            roleHeader(props.organizationId ? 'organization' : 'platform')
          "
          @on-sort="onSort"
          @on-search="onSearch"
        >
          <template #organizationName="{ row }">
            <div>
              {{ row.organizations[0]?.name || '' }}
            </div>
          </template>
          <template #action-button>
            <Button
              variant="default"
              @click="
                () => {
                  roleId = undefined
                  openModal = true
                }
              "
            >
              Crear rol
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
                  <!-- <SheetTrigger -->
                  <!--   class="w-full" -->
                  <!--   @click=" -->
                  <!--     () => { -->
                  <!--       roleId = row.id; -->
                  <!--       openModal = true; -->
                  <!--     } -->
                  <!--   " -->
                  <!-- > -->
                  <!--   <DropdownMenuItem> -->
                  <!--     Editar -->
                  <!--     <CustomIcons name="Pen" class="ml-auto" /> -->
                  <!--   </DropdownMenuItem> -->
                  <!-- </SheetTrigger> -->
                  <DropdownMenuItem @click="handleUpdateForm(row)">
                    Actualizar datos
                    <CustomIcons name="ArrowLeft" class="ml-auto" />
                  </DropdownMenuItem>
                  <div
                    v-if="
                      myGrants.data.value.includes(
                        GrantId.PlatformRolesCanDelete,
                      ) ||
                      myGrants.data.value.includes(
                        GrantId.OrganizationRolesCanDelete,
                      )
                    "
                  >
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="handleDelete(row.id, row.name)">
                      Eliminar
                    </DropdownMenuItem>
                  </div>
                  <!-- <DropdownMenuSeparator /> -->
                  <!-- <DropdownMenuItem> -->
                  <!--   <NuxtLink :to="`/`">Ver Detalle</NuxtLink> -->
                  <!--   <CustomIcons name="EyeIcon" class="ml-auto" /> -->
                  <!-- </DropdownMenuItem> -->
                  <!-- <DropdownMenuSeparator /> -->
                  <!-- <DropdownMenuItem -->
                  <!--   @click="handleDelete(row.name)" -->
                  <!--   :disabled="row.status !== 'Activo'" -->
                  <!-- > -->
                  <!--   Eliminar -->
                  <!--   <CustomIcons name="Trash" class="ml-auto" /> -->
                  <!-- </DropdownMenuItem> -->
                  <!-- <DropdownMenuSeparator /> -->
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <template #status="{ row }">
            <CustomChip
              :text="row.status === 'ACTIVE' ? 'Activo' : 'Inactivo'"
              :variant="row.status === 'ACTIVE' ? 'default' : 'destructive'"
            ></CustomChip>
          </template>
        </CustomTable>
        <SheetContent
          v-model:open="openModal"
          class="flex flex-col h-full"
          @pointer-down-outside="(e) => e.preventDefault()"
          @interact-outside="(e) => e.preventDefault()"
        >
          <RolesForm
            :id="roleId"
            :type="props.organizationId ? 'organization' : 'platform'"
            :onsubmit="roleId !== undefined ? handleEdit : handleCreate"
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
import CustomTable from '@/components/ui/custom-table/CustomTable.vue'
import CustomChip from '@/components/ui/custom-chip/CustomChip.vue'
import CustomIcons from '@/components/ui/custom-icons/CustomIcons.vue'
import CustomPagination from '@/components/ui/custom-pagination/CustomPagination.vue'
import { roleHeader } from '~/constants/roles'
import { useRoles } from '@/composables/useRoles'
import ConfirmModal from '~/components/ui/confirm-modal/ConfirmModal.vue'
import RolesForm from '@/components/roles/RolesForm.vue'
import { type IRoleItem, IOrganizationSummary } from '~/types/Roles'
import type { IDataResponse } from '~/types/Common'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import { GrantId } from '~/types/Grant'
const props = defineProps<{ organizationId: string | null }>()

const { getMyGrants } = useAuthManagement()
const route = useRoute()
const myGrants = await getMyGrants()
const {
  page,
  // filterOptions,
  sortOptions,
  onSort,
  onSearch,
  deleteRole,
  createRole,
  editRole,
} = useRoles()
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const roleId = ref<number | undefined>(undefined)
const BASE_ROLE_URL = '/role-configuration'
const openModal = ref(false)

// const filterOptions = ref(
//   props.organizationId
//     ? `[{ "field": "organizations.id", "type": "equal", "value": "${props.organizationId}" }]`
//     : `[]`,
// )
const filterOptions = ref(`[]`)

const { data, refresh, error }: any = await useAPI(
  `${BASE_ROLE_URL}/find-roles-paginated`,
  {
    query: {
      limit: 8,
      page,
      filterOptions,
      sortOptions,
    },
  } as any,
)

const handleUpdateForm = async (row: any) => {
  roleId.value = row.id
  openModal.value = true
}
console.log('API Response:', data)
console.log('Error:', error)
console.log('Data Value:', data.value)

// const roleData = computed(() => {
//   if (!Array.isArray(data.value)) return [];
//   return data.value.map((item: IRoleItem) => ({
//     roleName: item.name,
//     quantity: "1",
//     creationDate: "DD/MM/AAAA",
//     lastModifiedDate: "DD/MM/AAAA",
//   }));
// });

const roleData = computed(() =>
  data.value.data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    updatedAt: new Date(item.updatedAt).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  })),
)
console.log('API Response:', data.value)

const handleDelete = async (id: string, name: string) => {
  openConfirmModal({
    title: 'Eliminar rol',
    message: `¿Está seguro que desea eliminar el rol ❝${name}❞?`,
    callback: async () => {
      const { status, error } = await deleteRole(id)
      if (status.value === 'success') {
        updateConfirmModal({
          title: '¡Eliminación exitosa!',
          message: 'El rol ha sido eliminado.',
          type: 'success',
        })
        refresh()
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El rol no se pudo eliminar. \nTe recomendamos intentarlo nuevamente.'
        updateConfirmModal({
          title: 'Error al eliminar',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleCreate = async (values: any) => {
  openConfirmModal({
    title: 'Crear rol',
    message: '¿Estás seguro de que deseas crear este rol?',
    callback: async () => {
      const { status, error } = await createRole({
        ...values,
        organizationId: props.organizationId,
      })
      if (status.value === 'success') {
        openModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Rol creado',
          message: 'El rol ha sido creado exitosamente',
          type: 'success',
        })
      } else {
        console.log(`error ${error.data}`)
        const eMsg =
          error?.value.data?.errors?.[0]?.message ||
          error?.value.data?.message ||
          'El rol no se pudo crear, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al crear rol',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleEdit = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar rol',
    message: '¿Estás seguro de que deseas actualizar este rol?',
    callback: async () => {
      const { status, error } = await editRole(values)
      if (status.value === 'success') {
        openModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Rol actualizado',
          message: 'El rol ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error?.data?.errors?.[0]?.message ||
          error?.data?.message ||
          'El rol no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar rol',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
