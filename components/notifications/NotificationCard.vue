<template>
  <div
    class="relative rounded-lg hover:bg-gray-50 transition-colors duration-200"
  >
    <div class="flex items-start w-full border-t border-gray-200">
      <div class="ml-16 mt-12">
        <input
          type="checkbox"
          :checked="isSelected"
          class="mr-4 form-checkbox h-5 w-5 text-[#09314F] border-2 gap-2 border-[#09314F] rounded focus:ring-[#09314F]"
          @change="toggleSelection"
        />
      </div>
      <div class="flex-1 space-y-1 py-2 mt-6">
        <p
          class="font-normal text-base leading-[20px] tracking-[0.5px] text-[#152A3C] break-words pr-8"
        >
          {{ notification.message }}
        </p>
        <div
          v-if="showDetail && notification.messageDetail"
          class="w-[720px] text-sm text-[#20445E] pt-4 pb-4 pl-4 pr-4 rounded-lg"
        >
          <div v-html="notification.messageDetail"></div>
          <!-- <div class="max-w-3xl"> -->
          <!--   {{ htmlToText(notification.messageDetail) }} -->
          <!-- </div> -->
        </div>
        <p
          class="font-normal text-sm leading-[20px] tracking-[0.25px] text-[#20445E] mt-1"
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

        <Badge
          variant="outline"
          :class="notificationTagRecord[notification.tag].tagClass"
        >
          {{ notificationTagRecord[notification.tag].label }}
        </Badge>
      </div>

      <div class="flex items-center mr-6 relative mt-10">
        <div
          v-if="!notification.isRead"
          class="w-2 h-2 rounded-full bg-[#20445E] mr-2"
        ></div>
        <button
          v-if="notification.messageDetail"
          ref="buttonRef"
          class="w-5 h-5 flex items-center justify-center hover:bg-[#d1d7de] transition-colors duration-200 mr-2 border-2 border-[#d1d7de] rounded"
          title="Ver detalles"
          @click="toggleDetail"
        >
          <svg
            class="w-4 h-4 transition-transform duration-200 text-[#09314F]"
            :class="{ 'transform rotate-180': showDetail }"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <button class="focus:outline-none" @click="toggleMenu">
          <img src="@/assets/icon/svg/Button.svg" class="w-5 h-5" />
          <span class="sr-only">Open menu</span>
        </button>

        <div
          v-if="isOpen"
          class="absolute right-0 top-6 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
        >
          <div class="py-1">
            <button
              class="w-full text-left px-4 py-2 text-sm text-[#20445E] hover:bg-gray-50 transition-colors duration-200"
              @click="handleRead"
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
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="closeAllMenus"></div>
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
  NotificationTag,
  notificationTagRecord,
  type Notification,
} from '~/types/Notification'
import { htmlToText } from '~/utils/htmlUtils'

const props = defineProps<{
  notification: Notification
  isSelected?: boolean
}>()

const emit = defineEmits(['onRemove', 'onSelect', 'onReaded'])
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
  closeAllMenus()
}

const toggleSelection = () => {
  emit('onSelect', props.notification.id, !props.isSelected)
}

const handleRead = async () => {
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

const showDetail = ref(false)
const buttonRef = ref(null)

const toggleDetail = (event: Event) => {
  event.stopPropagation()
  showDetail.value = !showDetail.value
  if (showDetail.value) {
    isOpen.value = false
  }
}

const closeAllMenus = () => {
  isOpen.value = false
  // showDetail.value = false
  //
}
</script>

<style scoped>
/* Estilos existentes... */
</style>
