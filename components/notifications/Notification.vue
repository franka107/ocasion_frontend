<template>
  <div class="flex items-center gap-4">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="relative bg-[#e8edf3] hover:bg-[#d1d7de] w-10 h-10 rounded-full"
        >
          <Badge
            class="absolute -bottom-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500"
          >
            <p
              v-if="status === 'success'"
              class="text-xs font-medium leading-4 text-white"
            >
              {{ notifications?.count }}
            </p>
            <p v-else>⦿</p>
          </Badge>
          <img src="@/assets/icon/svg/icon-noti.svg" class="w-5 h-5 m-auto" />
          <span class="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        class="w-[360px] h-[700px] p-0 mr-4 bg-white border border-gray-300 shadow-lg rounded-lg"
      >
        <Card class="border-0">
          <CardContent
            class="px-0 py-0 max-h-[640px] overflow-y-auto no-scrollbar"
          >
            <div class="space-y-1">
              <template v-if="status === 'pending'">
                <div class="flex justify-center items-center h-full">
                  <img
                    src="@/assets/icon/svg/icon-spinner.svg"
                    class="animate-spin w-6 h-6"
                  />
                </div>
              </template>
              <template v-else>
                <NotificationItem
                  v-for="(notification, index) in notifications?.data"
                  :key="index"
                  :notification="notification"
                  @on-remove="refresh"
                />
              </template>
            </div>
          </CardContent>
          <CardFooter class="px-3 py-3 border boder-top-gray-700">
            <Button
              variant="ghost"
              @click="handleButtonClick"
              :disabled="isAdmin && !notifications?.data?.length"
              :class="buttonClasses"
            >
              <div
                class="inline-flex items-center justify-center w-full border-gray-200 text-sm font-medium"
              >
                {{ buttonText }}
                <span v-if="isArchiving" class="animate-spin">
                  <img
                    src="@/assets/icon/svg/icon-spinner.svg"
                    class="w-4 h-4"
                    alt="Loading"
                  />
                </span>
              </div>
            </Button>

            <Dialog v-model:open="showConfirmationDialog">
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle class="text-lg font-semibold text-gray-900">
                    Confirm Archive
                  </DialogTitle>
                  <DialogDescription class="mt-2 text-sm text-gray-500">
                    Are you sure you want to archive all notifications?
                  </DialogDescription>
                </DialogHeader>
                <div class="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    @click="showConfirmationDialog = false"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    @click="confirmArchive"
                    class="px-4 py-2 text-sm font-medium text-white bg-[#54c9dd] hover:bg-[#06B6D4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#54c9dd]"
                  >
                    Confirm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWebNotification } from '@vueuse/core'
//import { useSound } from '@vueuse/sound'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import NotificationItem from '@/components/notifications/NotificationItem.vue'
import { useNotificationAPI } from '~/composables/useNotificationAPI'
import {
  domainEvents,
  type NotificationCreatedDomainEvent,
} from '~/types/DomainEvent'
import notificationSound from '~/assets/sounds/notification.mp3'
import { UserType } from '~/types/Administrators'

const router = useRouter()
const userSession = useUserSession()
const { findNotificationsPaginated, listenDomainEvents, removeNotifications } =
  useNotificationAPI()

const isParticipant = computed(
  () => userSession.user.value?.user.type === UserType.Participant,
)

const isArchiving = ref(false)
const showConfirmationDialog = ref(false)

const isAdmin = computed(() => {
  const userType = userSession.user.value?.user.type
  return (
    userType === UserType.SuperAdmin ||
    userType === UserType.PlatformAdmin ||
    userType === UserType.OrganizationAdmin
  )
})

const buttonText = computed(() =>
  isParticipant.value ? 'Ver todas las notificaciones' : 'Archivar',
)

const buttonClasses = computed(() =>
  isAdmin.value
    ? 'w-full h-10  text-center text-sm text-[#20445E] hover:bg-gray-100 mt-2  transition-colors duration-200 disabled:cursor-not-allowed'
    : 'w-full h-10  text-center text-sm text-[#20445E] hover:bg-gray-100 mt-2  transition-colors duration-200  ',
)

const {
  data: notifications,
  refresh,
  status,
} = await findNotificationsPaginated({
  limit: 15,
  page: 1,
  filterOptions: [],
  sortOptions: [{ field: 'createdAt', order: 'desc' }],
})

const webNotification = useWebNotification({
  title: 'New Notification',
  lang: 'en',
  body: 'Check your notification history',
  icon: '/favicon.ico',
})

const notificationCreatedListener =
  listenDomainEvents<NotificationCreatedDomainEvent>(
    domainEvents.notificationCreated,
  )

//const { play, sound } = useSound(notificationSound)

const handleButtonClick = () => {
  if (isAdmin.value) {
    showConfirmationDialog.value = true
  } else {
    router.push('/dashboard/participant/my-notifications/Notification')
  }
}

const archiveNotifications = async () => {
  try {
    if (!notifications.value?.data?.length) return

    isArchiving.value = true
    await removeNotifications(
      notifications.value.data.map((notification) => notification.id),
    )
    await refresh()
  } catch (error) {
    console.error('Error archiving notifications:', error)
  } finally {
    isArchiving.value = false
  }
}

const confirmArchive = async () => {
  showConfirmationDialog.value = false
  await archiveNotifications()
}

watch(notificationCreatedListener.data, (value, oldValue) => {
  //play()
  webNotification.show()
  refresh()
})
</script>
