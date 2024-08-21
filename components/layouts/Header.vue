<template>
  <div
    class="flex items-center justify-between space-x-4 relative gap-2 pb-4 px-2"
  >
    <div class="font-bold text-xl text-[#1f4e6d]">Organizaciones</div>
    <div class="flex flex-row space-x-4">
      <Notification />
      <div
        class="p-2 rounded-full bg-gray-100 relative hover:bg-gray-400 w-10 h-10"
        @click="handleLogout"
      >
        <img src="@/assets/icon/svg/icon-user.svg" class="w-5 h-5 m-auto" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserNav from "~/layouts/default/UserNav.vue";
import Notification from "../notifications/Notification.vue";
const { clear } = useUserSession();
const router = useRouter();

const handleLogout = async () => {
  console.log("handleLogout");
  await clear();
  router.push("/auth/login");
};
</script>
