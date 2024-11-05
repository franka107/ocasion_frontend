<template>
  <div class="relative p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
    <div class="flex items-start w-full">
      <div class="flex-1 space-y-1 py-2">
        <p class="font-normal text-[14px] leading-[20px] tracking-[0.5px] text-[#152A3C] break-words pr-8">
          {{ notification.message }}
        </p>
        <p class="font-normal text-[14px] leading-[20px] tracking-[0.25px] text-[#20445E] mt-1">
          {{
            notificationDf.format(
              parseAbsolute(
                notification.createdAt,
                getLocalTimeZone()
              ).toDate()
            )
          }}
        </p>
        <p class="font-normal text-[14px] leading-[20px] tracking-[0.25px] text-[#20445E] mt-1">
          {{ NotiificationStringMap[notification.tag] }}
        </p>
      </div>

      <div class="flex items-center relative">
        <div
          v-if="!notification.isRead"
          class="w-2 h-2 rounded-full bg-[#20445E] mr-2"
        ></div>
        <div
          v-else
          class="w-2 h-2 rounded-full bg-gray-400 mr-2"
        ></div>

        <button
          @click="toggleMenu"
          class="focus:outline-none"
        >
          <img
            src="@/assets/icon/svg/Button.svg"
            class="w-5 h-5"
          />
          <span class="sr-only">Open menu</span>
        </button>

        <!-- Menú desplegable -->
        <div
          v-if="isOpen"
          class="absolute right-0 top-6 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div class="py-1">
            <button
              @click="markAsRead"
              class="w-full text-left px-4 py-2 text-sm text-[#20445E] hover:bg-gray-50 transition-colors duration-200"
            >
              Marcar como leído
            </button>
            <button
              @click="handleDelete"
              class="w-full text-left px-4 py-2 text-sm text-[#20445E] hover:bg-gray-50 transition-colors duration-200"
            >
              Eliminar notificación
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="isOpen"
      @click="closeMenu"
      class="fixed inset-0 z-40"
    ></div>
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
  type Notification,
} from '~/types/Notification'

const emit = defineEmits(['onRemove'])
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

const { removeNotifications } = useNotificationAPI()

const toggleMenu = (event: Event) => {
  event.stopPropagation()
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const markAsRead = async () => {
  console.log(`Marcando la notificación ${props.notification.id} como leída`)
  props.notification.isRead = true
  closeMenu()
}

const handleDelete = async () => {
  try {
    await removeNotifications([props.notification.id])
    emit('onRemove')
    console.log(`Notification eliminad ${props.notification.id}`)
  } catch (error) {
    console.error("Error al eliminar la notificación:", error)
  }
  closeMenu()
}
</script>
