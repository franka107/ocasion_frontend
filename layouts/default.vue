<template>
  <main class="h-[100vh]">
    <!-- <Header /> -->
    <section class=" bg-bgtheme min-h-[100vh]">
    <Splitter >
      <SplitterNav @collapse="handleCollapse" @expand="handleExpand">
        <Header :collapsed="collapsed" />
      </SplitterNav>
      <SplitterMain>  
        <section class="flex-grow py-4 px-4 bg-bgtheme flex flex-col min-h-[100vh]">
          <div class="flex items-center justify-end space-x-4 relative gap-2 pb-4 px-2">
            <Notification />
            <div
              class="p-2 rounded-full bg-gray-100 relative hover:bg-gray-400 w-10 h-10"
              @click="handleLogout"
            >
              <img src="@/assets/icon/svg/icon-user.svg" class="w-5 h-5 m-auto" />
            </div>
          </div>
          <Sheet>
            <slot/>
          </Sheet>
        </section>
        <ConfirmModal />
      </SplitterMain>
    </Splitter>
    </section>
  </main>
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
import Header from "@/components/layouts/Header.vue";
import ConfirmModal from "~/components/ui/confirm-modal/ConfirmModal.vue";
import Notification from "@/components/notifications/Notification.vue";
const userRole = "admin";
const { clear } = useUserSession();
const router = useRouter();
const { openConfirmModal, showModal } = useConfirmModal();
const handleLogout = async () => {
  console.log("handleLogout");
  await clear();
  router.push("/auth/login");
};
const collapsed = ref(false);

const handleCollapse = () => {
  collapsed.value = true;
}

const handleExpand = () => {
  collapsed.value = false;
}

function useIdleLogout(logoutCallback: Function, idleMinTime = 20) {
  let idleTime = idleMinTime*60*1000;
  let timeoutId:any;
  let forcetimeoutId:any;
  const onForceLogout = (idleMinTime = 10) => {
  let forceIdleTime = idleMinTime*60*1000;
    forcetimeoutId = setTimeout(() => {
      logoutCallback()
      showModal.value = false;
    }, forceIdleTime);
  };
  const resetTimer = () => {
    console.log("resetTimer");
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      onForceLogout();
      openConfirmModal({
        title: "Sesion inactiva",
        message: "Tu sesión expirará por inactividad, desea cerra sesión?",
        callback: () => {
          logoutCallback()
          showModal.value = false;
        },
        cancelCallback: () => {
          clearTimeout(forcetimeoutId);
          showModal.value = false;
        },
      });
    }, idleTime);
  };

  const events = ['mousemove', 'keydown', 'scroll', 'click'];

  const startListening = () => {
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Initialize the timer on mount
  };

  const stopListening = () => {
    if (timeoutId) clearTimeout(timeoutId);
    events.forEach(event => window.removeEventListener(event, resetTimer));
  };

  onMounted(startListening);
  onUnmounted(stopListening);
}
useIdleLogout(handleLogout)
</script>
