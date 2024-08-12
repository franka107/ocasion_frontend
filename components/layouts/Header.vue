<template>
  <header
    class="bg-white h-20 p-4 flex items-center justify-between border-b-2 shadow-sm"
  >
    <div class="h-11 ml-4">
      <img
        src="@/assets/img/logo.png"
        alt="Company Logo"
        class="rounded-md object-cover w-full h-full"
      />
    </div>

    <TabsSection :tabs="tabs" />

    <div class="flex items-center space-x-4 relative gap-2">
      <Notification />
      <div
        class="p-2 rounded-full bg-gray-100 relative hover:bg-gray-400 w-10 h-10"
        @click="openUserMenu"
      >
        <img src="@/assets/icon/svg/icon-user.svg" class="w-5 h-5 m-auto" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import TabsSection from "@/components/layouts/TabsSection.vue";
import Notification from "@/components/notifications/Notification.vue";

const userRole = "admin";
const { clear } = useUserSession();
const router = useRouter();
const allTabs = useState<{ value: string; label: string; url: string }[]>(
  "tabs",
  () => [
    { value: "events", label: "Eventos", url: "/dashboard/events" },
    { value: "reports", label: "Reportes", url: "/dashboard/reports" },
    { value: "users", label: "Usuarios", url: "/dashboard/users" },
    { value: "roles", label: "Roles", url: "/dashboard/roles" },
  ]
);

const openUserMenu = async () => {
  await clear();
  router.push("/auth/login");
};
const tabs = computed(() => {
  if (userRole === "admin") {
    return allTabs.value;
  } else {
    return allTabs.value.filter((tab) => tab.value !== "roles");
  }
});
</script>
