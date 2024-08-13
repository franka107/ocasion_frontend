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
              @click="openUserMenu"
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
const openUserMenu = async () => {
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
</script>
