<template>
  <Sidebar v-model:isSidebarOpen="isSidebarOpen"/>
   <main
    :class="[
      'min-h-[calc(100vh)] bg-[#f1f5f9]  transition-[margin-left] ease-in-out duration-300',
      isSidebarOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72'
    ]"
  >
    <slot />
    <ConfirmModal/>
  </main>
  
</template>

<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from "radix-vue";
import ConfirmModal from "~/components/ui/confirm-modal/ConfirmModal.vue";
import Notification from "@/components/notifications/Notification.vue";
import ContentLayout from "./ContentLayout.vue";
import Sidebar from "./Sidebar.vue";


const userRole = "admin";
const { clear } = useUserSession();
const router = useRouter();
const isSidebarOpen = ref(true);
const openUserMenu = async () => {
  await clear();
  router.push("/auth/login");
};
const collapsed = ref(false);

const handleCollapse = () => {
  collapsed.value = true;
};

const handleExpand = () => {
  collapsed.value = false;
};
</script>
