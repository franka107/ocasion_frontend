<template>
  <Sidebar v-model:is-sidebar-open="isSidebarOpen" />

  <main
    :class="[
      'min-h-[calc(100vh)] bg-[#f1f5f9]  transition-[margin-left] ease-in-out duration-300',
      isSidebarOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
    ]"
  >
    <slot />
    <ConfirmModal />
    <CommonDialog
      v-model:open="isIdleDialogOpen"
      title="Inactividad detectada"
      description="¿Deseas continuar en la plataforma?"
      icon-bg-color="bg-yellow-400"
      :actions="[
        {
          label: 'Cerrar sesión',
          callback: () => {
            handleSignOut()
          },
        },
        {
          label: 'Continuar',
          callback: () => {
            isIdleDialogOpen = false
          },
        },
      ]"
      @close="closeDialog"
    >
      <template #icon>
        <img src="@/assets/icon/svg/alert.svg" class="w-5 h-5 m-auto" />
      </template>
    </CommonDialog>
    <!-- <Dialog -->
    <!--   v-model:open="isIdleDialogOpen" -->
    <!--   :icon-src="messageIconSrc" -->
    <!--   icon-alt="Icono de alerta" -->
    <!--   title="Inactividad detectada" -->
    <!--   description="¿Deseas continuar en la plataforma?" -->
    <!--   button-text="Cerrar sesión" -->
    <!--   icon-bg-color="bg-[#FBBF24]" -->
    <!--   @close="closeDialog('isDialogOpen')" -->
    <!--   @action="goToUpdatePassword" -->
    <!-- /> -->
  </main>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import ConfirmModal from '~/components/ui/confirm-modal/ConfirmModal.vue'
import IconAlert from '~/assets/icon/svg/alert.svg'
import { UserType } from '~/types/Administrators'

const isSidebarOpen = ref(true)
const isIdleDialogOpen = ref(false)
const userSession = useUserSession()
const MINUTES_20 = 20 * 60 * 1000 // 20 minutes
const MINUTES_12 = 12 * 60 * 1000 // 20 minutes
const MINUTES_10 = 10 * 60 * 1000 // 20 minutes
const MINUTES_30 = 30 * 60 * 1000 // 20 minutes
const isIdle10 = useIdle(MINUTES_10)
const isIdle12 = useIdle(MINUTES_12)
const isIdle20 = useIdle(MINUTES_20)
const isIdle30 = useIdle(MINUTES_30)

const now = useTimestamp({ interval: 1000 })

const idledFor = computed(() =>
  Math.floor((now.value - isIdle20.lastActive.value) / 1000),
)

const closeDialog = (dialog: string) => {
  isIdleDialogOpen.value = false
}

const session = useUserSession()

const loggedUser = session.user.value

// Mostrar la alerta cuando el usuario esté inactivo
watch(isIdle20.idle, (idle) => {
  if (
    idle &&
    session.loggedIn &&
    loggedUser?.user.type !== UserType.Participant
  ) {
    isIdleDialogOpen.value = true
  }
})

watch(isIdle30.idle, (idle) => {
  if (
    idle &&
    session.loggedIn &&
    loggedUser?.user.type !== UserType.Participant
  ) {
    handleSignOut()
  }
})

watch(isIdle10.idle, (idle) => {
  if (
    idle &&
    session.loggedIn &&
    loggedUser?.user.type === UserType.Participant
  ) {
    isIdleDialogOpen.value = true
  }
})

watch(isIdle12.idle, (idle) => {
  if (
    idle &&
    session.loggedIn &&
    loggedUser?.user.type === UserType.Participant
  ) {
    handleSignOut()
  }
})
const router = useRouter()

const handleSignOut = async () => {
  await userSession.clear()
  router.push('/auth/login')
}
</script>
