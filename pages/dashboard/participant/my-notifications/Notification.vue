<template>
  <ContentLayout>
    <div class="flex justify-start  ">
      <div class="w-[1419px] custom-scrollbar bg-white shadow-lg rounded-lg">
        <div class="w-full pb-6 space-y-6">
          <div class="flex flex-row mt-12 ml-14 items-center justify-between px-4">
            <div class="flex items-center gap-6">
              <div class="flex ml-2 items-center gap-2">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  class="form-checkbox h-5 w-5 text-[#09314F] border-2 gap-2 border-[#09314F] rounded focus:ring-[#09314F]"
                  @change="handleSelectAll"
                />
              </div>

              <div class="flex items-center gap-2">
                <label class="font-roboto text-base font-semibold leading-6 text-left">Filtrar por:</label>
                <select
                  v-model="filterType"
                  class="border rounded-md w-[180px] h-[40px] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#09314F] bg-white"
                >
                  <option class="font-roboto text-base font-normal leading-6 text-left" value="todas">Todas</option>
                  <option class="font-roboto text-base font-normal leading-6 text-left" value="leidas">Leídas</option>
                  <option class="font-roboto text-base font-normal leading-6 text-left" value="no-leidas">No leídas</option>
                </select>
              </div>

              <div class="flex items-center gap-2">
                <label class="font-roboto text-base font-semibold leading-6 text-left">Ordenar por:</label>
                <select
                  v-model="sortType"
                  class="border rounded-md w-[180px] h-[40px] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#09314F] bg-white"
                >
                  <option value="reciente">Más reciente</option>
                  <option value="antiguo">Más antiguo</option>
                </select>
              </div>
            </div>
            <div v-if="hasSelectedNotifications" class="flex items-center gap-4 mr-4">
                  <button
                    class="w-10 h-10 rounded-full flex items-center justify-center bg-[#e8edf3] hover:bg-[#d1d7de] transition-colors duration-200"
                    @click="handleMarkAsRead"
                    title="Marcar como leído"
                  >
                    <img
                      src="@/assets/icon/svg/message_open.svg"
                      alt="Marcar como leído"
                      class="w-4 h-4"
                    />
                  </button>
                  <button
                    class="w-10 h-10 rounded-full flex items-center justify-center bg-[#e8edf3] hover:bg-[#d1d7de] transition-colors duration-200"
                    @click="handleDelete"
                    title="Eliminar"
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
          <div class="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            <div class="space-y-2 px-4">
              <template v-if="status === 'pending'">
                <div class="flex justify-center items-center py-8">
                  <img src="@/assets/icon/svg/icon-spinner.svg" class="w-6 h-6 animate-spin" />
                </div>
              </template>
              <template v-else-if="!notifications?.data?.length">
                <div class="text-center py-8">
                  <p>No hay notificaciones disponibles</p>
                </div>
              </template>
              <template v-else>
                <NotificationCard
                  v-for="(notification, index) in notifications?.data"
                  :key="notification.id || index"
                  :notification="notification"
                  :is-selected="selectedNotifications.includes(notification.id)"
                  @on-select="handleNotificationSelection"
                  @on-remove="refresh"
                  class="bg-white hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                />
              </template>
            </div>
          </div>
        </div>
        <div class="sticky bottom-0 bg-white border-t px-4 py-3">
          <CustomPagination
            :total="totalNotifications"
            :limit="limit"
            :page="page"
            @update:page="page = $event"
          />
        </div>

        </div>
      </div>

    </div>

  </ContentLayout>
</template>

<script setup lang="js">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import NotificationCard from '@/components/notifications/NotificationCard.vue'
import CustomPagination from '~/components/ui/custom-pagination/CustomPagination.vue'
import { useNotificationAPI } from '~/composables/useNotificationAPI'

const router = useRouter()
const userSession = useUserSession()
const { findNotificationsPaginated } = useNotificationAPI()

// Reactive variables
const page = ref(1)
const limit = ref(15)
const totalNotifications = ref(0)
const notifications = ref(null)
const refresh = ref(null)

const filterType = ref('todas')
const sortType = ref('reciente')
const selectAll = ref(false)
const selectedNotifications = ref([])

const hasSelectedNotifications = computed(() => selectedNotifications.value.length > 0)

// Handles selecting/deselecting all notifications
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedNotifications.value = notifications.value?.data?.map(n => n.id) || []
  } else {
    selectedNotifications.value = []
  }
}

// Handles individual notification selection
const handleNotificationSelection = (notificationId, isSelected) => {
  if (isSelected) {
    selectedNotifications.value.push(notificationId)
  } else {
    selectedNotifications.value = selectedNotifications.value.filter(id => id !== notificationId)
  }

  selectAll.value = selectedNotifications.value.length === notifications.value?.data?.length
}


const handleMarkAsRead = () => {
  console.log('Marcar como leído:', selectedNotifications.value)
}

const handleDelete = () => {
  console.log('Eliminar:', selectedNotifications.value)
}

const fetchNotifications = async () => {
  const query = {
    limit: limit.value,
    page: page.value,
    filterOptions: [],
    sortOptions: [{ field: 'createdAt', order: sortType.value === 'reciente' ? 'desc' : 'asc' }],
  }

  if (filterType.value === 'leidas') {
    query.filterOptions.push({ field: 'isRead', type: 'equal', value: true })
  } else if (filterType.value === 'no-leidas') {
    query.filterOptions.push({ field: 'isRead', type: 'equal', value: false })
  }

  const response = await findNotificationsPaginated(query)

  notifications.value = response.data.value
  totalNotifications.value = response.data.value?.count || 0
  refresh.value = response.refresh

  return response
}

onMounted(async () => {
  await fetchNotifications()
})

watch([filterType, sortType], async () => {
  await fetchNotifications()
  selectedNotifications.value = []
  selectAll.value = false
})

watch(page, async (newPage) => {
  console.log('Cambiando a la página:', newPage)
  await fetchNotifications()
})

const filteredNotifications = computed(() => {
  let filtered = notifications.value?.data || []

  if (filterType.value === 'leidas') {
    filtered = filtered.filter(n => n.read)
  } else if (filterType.value === 'no-leidas') {
    filtered = filtered.filter(n => !n.read)
  }

  return filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return sortType.value === 'reciente' ? dateB - dateA : dateA - dateB
  })
})

watch(notifications, (newVal) => {
  console.log('Notifications updated:', newVal)
  selectedNotifications.value = []
  selectAll.value = false
}, { deep: true })
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
