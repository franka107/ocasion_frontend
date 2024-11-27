<template>
  <div class="relative rounded-lg">
    <div
      class="flex items-start w-full border-t hover:bg-gray-50 transition-colors duration-200 border-gray-300 mt-4"
    >
      <div class="flex-1 ml-4 mt-2 space-y-1 py-2">
        <p
          class="font-normal text-[14px] leading-[20px] tracking-[0.5px] text-[#152A3C] break-words pr-8"
        >
          {{ notification.message }}
        </p>
        <p
          class="font-normal text-[14px] leading-[20px] tracking-[0.25px] text-[#20445E] mt-1"
        >
          {{
            notificationDf.format(
              parseAbsolute(
                notification.createdAt,
                getLocalTimeZone(),
              ).toDate(),
            )
          }}
        </p>
        <span
          class="inline-flex font-inter font-semibold items-center justify-center sm:px-7 w-[52px] rounded-3xl text-xs sm:text-sm whitespace-nowrap"
          :class="NotificationColorMap[notification.tag]"
        >
          {{ NotiificationStringMap[notification.tag] }}
        </span>
      </div>

      <div class="flex items-center relative mr-4 mt-4">
        <div
          v-if="!notification.isRead"
          class="w-2 h-2 rounded-full bg-[#20445E] mr-2"
        ></div>
        <button class="focus:outline-none" @click="toggleMenu">
          <img src="@/assets/icon/svg/Button.svg" class="w-5 h-5" />
          <span class="sr-only">Open menu</span>
        </button>

        <!-- Menú desplegable -->
        <div
          v-if="isOpen"
          class="absolute right-0 top-6 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div class="py-1">
            <button
              class="w-full text-left px-4 py-2 text-sm text-[#20445E] hover:bg-gray-50 transition-colors duration-200"
              @click="markAsRead"
            >
              Marcar como leído
            </button>
            <button
              class="w-full text-left px-4 py-2 text-sm text-[#20445E] hover:bg-gray-50 transition-colors duration-200"
              @click="handleDelete"
            >
              Eliminar notificación
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="closeMenu"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  DateFormatter,
  getLocalTimeZone,
  parseAbsolute,
} from '@internationalized/date'
import {
  NotiificationStringMap,
  NotificationTag,
  type Notification,
} from '~/types/Notification'

const emit = defineEmits(['onRemove', 'onReaded'])
const props = defineProps<{
  notification: Notification
}>()

const isOpen = ref(false)

const notificationDf = new DateFormatter('es', {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: 'long',
})

const { removeNotifications, removeNotification, readNotification } =
  useNotificationAPI()

const toggleMenu = (event: Event) => {
  event.stopPropagation()
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const markAsRead = async () => {
  // console.log(`Marcando la notificación ${props.notification.id} como leída`)
  // props.notification.isRead = true
  // emit('onReaded')
  // closeMenu()

  try {
    const { status } = await readNotification(props.notification.id)
    if (status.value === 'success') {
      emit('onReaded')
      console.log('Notification eliminada')
    }
  } catch (error) {
    console.error('Error al eliminar la notificación:', error)
  }
  closeMenu()
}

const handleDelete = async () => {
  try {
    const { status } = await removeNotification(props.notification.id)
    if (status.value === 'success') {
      emit('onRemove')
      console.log('Notification eliminada')
    }
  } catch (error) {
    console.error('Error al eliminar la notificación:', error)
  }
  closeMenu()
}
const NotificationColorMap = {
  [NotificationTag.Event]: 'bg-[#EFF6FF] text-[#2563EB]',
  [NotificationTag.Offer]: 'bg-[#FDF2F8] text-[#DB2777]',
  [NotificationTag.Delivery]: 'bg-[#F0FDF4] text-[#16A34A]',
  [NotificationTag.Alert]: 'bg-[#FEF3C7] text-[#B45309]',
}
</script>
