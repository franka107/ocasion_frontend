<template>
  <ContentLayout title="Notificaciones">
    <div class="flex justify-start">
      <div class="w-[1419px] custom-scrollbar bg-white shadow-lg rounded-lg">
        <div class="w-full pb-6 space-y-6">
          <div
            class="flex flex-row mt-12 ml-14 items-center justify-between px-4"
          >
            <div class="flex flex-wrap items-center gap-6">
              <div class="flex ml-2 items-center gap-2">
                <button @click="changeGeneralCheckbox">
                  <CustomIcons :name="checkboxGeneralIcon" class="w-12 h-12" />
                </button>
              </div>

              <div class="flex items-center gap-2">
                <label
                  class="font-roboto text-base font-semibold leading-6 text-left"
                  >Filtrar por:</label
                >
                <select
                  v-model="filterType"
                  class="border rounded-md w-[180px] h-[40px] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#09314F] bg-white"
                >
                  <option
                    class="font-roboto text-base font-normal leading-6 text-left"
                    value="todas"
                  >
                    Todas
                  </option>
                  <option
                    class="font-roboto text-base font-normal leading-6 text-left"
                    value="leidas"
                  >
                    Leídas
                  </option>
                  <option
                    class="font-roboto text-base font-normal leading-6 text-left"
                    value="no-leidas"
                  >
                    No leídas
                  </option>
                </select>
              </div>

              <div class="flex items-center gap-2">
                <label
                  class="font-roboto text-base font-semibold leading-6 text-left"
                  >Ordenar por:</label
                >
                <select
                  v-model="sortType"
                  class="border rounded-md w-[180px] h-[40px] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#09314F] bg-white"
                >
                  <option value="reciente">Más reciente</option>
                  <option value="antiguo">Más antiguo</option>
                </select>
              </div>
              <div class="flex flex-row space-x-2">
                <Button
                  variant="default"
                  :disabled="disableMultipleSelect"
                  class="bg-white text-primary border border-primary hover:bg-accent"
                  @click="handleDeleteNotifications(selectedMultipleData)"
                >
                  Eliminar notificaciónes
                </Button>
                <Button
                  variant="default"
                  :disabled="disableMultipleSelect"
                  class="bg-white text-primary border border-primary hover:bg-accent"
                  @click="handleMarkAsReadNotifications(selectedMultipleData)"
                >
                  Marcar como leídas
                </Button>
              </div>
            </div>
            <div
              v-if="hasSelectedNotifications"
              class="flex items-center gap-4 mr-4"
            >
              <button
                class="w-10 h-10 rounded-full flex items-center justify-center bg-[#e8edf3] hover:bg-[#d1d7de] transition-colors duration-200"
                title="Marcar como leído"
                @click="handleMarkAsRead"
              >
                <img
                  src="@/assets/icon/svg/message_open.svg"
                  alt="Marcar como leído"
                  class="w-4 h-4"
                />
              </button>
              <button
                class="w-10 h-10 rounded-full flex items-center justify-center bg-[#e8edf3] hover:bg-[#d1d7de] transition-colors duration-200"
                title="Eliminar"
                @click="handleDelete"
              >
                <img
                  src="@/assets/icon/svg/icon-delete.svg"
                  alt="Eliminar"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <div class="relative">
            <div
              class="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar"
            >
              <div class="space-y-2 px-4">
                <!-- <template v-if="status === 'pending'"> -->
                <!--   <div class="flex justify-center items-center py-8"> -->
                <!--     <img -->
                <!--       src="@/assets/icon/svg/icon-spinner.svg" -->
                <!--       class="w-6 h-6 animate-spin" -->
                <!--     /> -->
                <!--   </div> -->
                <!-- </template> -->
                <template v-if="!notificationsData?.length">
                  <div class="text-center py-8">
                    <p>No hay notificaciones disponibles</p>
                  </div>
                </template>
                <template v-else>
                  <NotificationCard
                    v-for="(notification, index) in notificationsData"
                    :key="notification.id || index"
                    :notification="notification"
                    class="bg-white hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                    :multiple-select="true"
                    :multiple-select-key="notification.id"
                    :on-select-item="onSelectItem"
                    :get-select-icon="getSelectIcon"
                    @on-select="handleNotificationSelection"
                    @on-remove="refresh"
                    @on-readed="refresh"
                  />
                </template>
              </div>
            </div>
          </div>
          <div class="sticky bottom-0 bg-white border-t px-4 py-3">
            <!-- <CustomPagination -->
            <!--   :total="totalNotifications" -->
            <!--   :limit="limit" -->
            <!--   :page="page" -->
            <!--   @update:page="page = $event" -->
            <!-- /> -->
            <CustomPagination
              v-model:page="page"
              class="mt-5 mb-[19px]"
              :total="data?.count"
              :limit="data?.limit"
            />
          </div>
        </div>
      </div>
    </div>
  </ContentLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import NotificationCard from '@/components/notifications/NotificationCard.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import { useNotificationAPI } from '~/composables/useNotificationAPI'
import type { Notification } from '~/types/Notification'
import type { IDataResponse } from '~/types/Common'

const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { page } = useNotificationAPI()
const filterOptions = ref(JSON.stringify([]))
const sortOptions = ref('[]')
const {
  removeAllNotificationsByParticipant,
  markAllNotificationsAsReadByParticipant,
} = useNotificationAPI()

const [eventListData] = await Promise.all([
  useAPI<IDataResponse<Notification>>(
    `notifications/find-notifications-paginated`,
    {
      query: {
        limit: 8,
        page,
        filterOptions,
        sortOptions,
      },
    } as any,
  ),
])

const { data, refresh } = eventListData

const notificationsData = computed(() =>
  data.value?.data.map(
    (item: Notification): Notification => ({
      ...item,
      // createdAt: dayjs(item.createdAt).format('YYYY-MM-DD'),
    }),
  ),
)

const selectAll = ref(false)
const filterType = ref('todas')
const sortType = ref('reciente')
const handleNotificationSelection = () => {}
const handleDelete = () => {}
const handleMarkAsRead = () => {}
const handleSelectAll = () => {}
const selectedNotifications = ref([])
const hasSelectedNotifications = computed(
  () => selectedNotifications.value.length > 0,
)
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
watch([filterType, sortType], async () => {
  page.value = 1
  if (filterType.value === 'todas') {
    filterOptions.value = JSON.stringify([])
  } else {
    filterOptions.value = JSON.stringify([
      {
        field: 'isRead',
        type: 'equal',
        value: filterType.value === 'leidas',
      },
    ])
  }

  if (sortType.value === 'reciente') {
    sortOptions.value = JSON.stringify([
      {
        field: 'createdAt',
        order: 'desc',
      },
    ])
  } else {
    sortOptions.value = JSON.stringify([
      {
        field: 'createdAt',
        order: 'asc',
      },
    ])
  }
})

const handleMarkAsReadNotifications = async (values: {
  type: string
  ids: string[]
}) => {
  openConfirmModal({
    title: 'Marcar notificaciones como leídas',
    message: `¿Está seguro de marcar las notificaciones seleccionadas como leídas?`,
    callback: async () => {
      const { status, error } = await markAllNotificationsAsReadByParticipant({
        ...values,
      })

      if (status.value === 'success') {
        refresh()
        selectedMultipleData.value.type = 'empty'
        ;(selectedMultipleData.value.ids = []),
          (resetMultipleSelect.value = resetMultipleSelectBox)
        resetMultipleSelect.value?.()

        updateConfirmModal({
          title: 'Notificacion(es) marcada(s) como leída(s)',
          message:
            'La(s) notificación(es) ha sido marcada(s) como leída(s) exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value?.data?.errors?.[0].message ||
          error.value?.data.message ||
          'No se pudo marcar notificación(es) como leída(s). Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al marcar notificación(es) como leída(s)',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleDeleteNotifications = async (values: {
  type: string
  ids: string[]
}) => {
  openConfirmModal({
    title: 'Eliminar notificaciones',
    message: `¿Está seguro de eliminar las notificaciones seleccionadas?`,
    callback: async () => {
      const { status, error } = await removeAllNotificationsByParticipant({
        ...values,
      })

      if (status.value === 'success') {
        refresh()
        selectedMultipleData.value.type = 'empty'
        ;(selectedMultipleData.value.ids = []),
          (resetMultipleSelect.value = resetMultipleSelectBox)
        resetMultipleSelect.value?.()

        updateConfirmModal({
          title: 'Notificacion(es) eliminada(s)',
          message: 'La(s) notificación(es) ha sido eliminada(s) exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value?.data?.errors?.[0].message ||
          error.value?.data.message ||
          'No se pudo eliminar notificación(es). Por favor, intente nuevamente.'
        updateConfirmModal({
          title: 'Error al eliminar notificación(es)',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
const useMultipleSelect = () => {
  const selectedIdItems = ref<string[]>([])
  const generalCheckbox = ref<'empty' | 'all'>('empty')
  const checkboxGeneralIcon = ref<
    'Checkbox-Checked' | 'Checkbox' | 'Checkbox-Indeterminate'
  >('Checkbox')

  const resetMultipleSelectBox = () => {
    generalCheckbox.value = 'empty'
    selectedIdItems.value = []
    checkboxGeneralIcon.value = 'Checkbox'
  }

  const changeGeneralCheckbox = () => {
    selectedIdItems.value = []
    if (generalCheckbox.value === 'empty') {
      // selectedIdItems.value = props.data.map(item => item.id)
      generalCheckbox.value = 'all'
      checkboxGeneralIcon.value = 'Checkbox-Checked'
    } else {
      generalCheckbox.value = 'empty'
      checkboxGeneralIcon.value = 'Checkbox'
    }
    selectedMultipleData.value = {
      type: generalCheckbox.value,
      ids: selectedIdItems.value,
    }
  }

  const onSelectItem = (id: string) => {
    const index = selectedIdItems.value.indexOf(id)
    if (index === -1) {
      selectedIdItems.value.push(id)
    } else {
      selectedIdItems.value.splice(index, 1)
    }
    checkboxGeneralIcon.value = 'Checkbox-Indeterminate'
    selectedMultipleData.value = {
      type: generalCheckbox.value,
      ids: selectedIdItems.value,
    }
  }
  const getSelectIcon = (id: string) => {
    if (generalCheckbox.value === 'empty') {
      return selectedIdItems.value.includes(id)
        ? 'Checkbox-Checked'
        : 'Checkbox'
    } else {
      return selectedIdItems.value.includes(id)
        ? 'Checkbox'
        : 'Checkbox-Checked'
    }
  }
  return {
    resetMultipleSelectBox,
    selectedIdItems,
    generalCheckbox,
    checkboxGeneralIcon,
    changeGeneralCheckbox,
    onSelectItem,
    getSelectIcon,
  }
}

const {
  resetMultipleSelectBox,
  checkboxGeneralIcon,
  changeGeneralCheckbox,
  onSelectItem,
  getSelectIcon,
} = useMultipleSelect()
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}

.notification-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Asegurar que las notificaciones ocupen el espacio disponible */
.notification-list {
  flex-grow: 1;
  min-height: 0;
}

/* Animación suave al hacer scroll */
.custom-scrollbar {
  scroll-behavior: smooth;
}
</style>
