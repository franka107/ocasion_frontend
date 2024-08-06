<template>
  <div>
    <header
      class="bg-white text-gray-800 p-4 flex items-center justify-between border-b-2 shadow-sm"
    >
      <div class="h-11 ml-4">
        <img
          src="@/assets/img/logo.png"
          alt="Company Logo"
          class="rounded-md object-cover w-full h-full"
        />
      </div>

      <TabsSection :tabs="tabs" />

      <div class="flex items-center space-x-4 relative">
        <div
          class="p-2 rounded-full bg-gray-100 relative hover:bg-gray-400 w-12 h-12"
        >
          <img src="@/assets/icon/svg/icon-noti.svg" class="w-6 h-6 m-auto" />
          <Badge
            class="absolute -bottom-3 -right-1 px-2 py-0.5 text-[10px] bg-yellow-400 text-black"
          >
            6
          </Badge>
        </div>
        <div
          class="p-2 rounded-full bg-gray-100 relative hover:bg-gray-400 w-12 h-12"
        >
          <img src="@/assets/icon/svg/icon-user.svg" class="w-6 h-6 m-auto" />
        </div>
      </div>
    </header>
    <main class="flex-grow p-4 bg-[#f1f5f9] flex flex-col">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import TabsSection from "@/components/layouts/TabsSection.vue";

const userRole = "admin";

const allTabs = [
  { value: "events", label: "Eventos" },
  { value: "reports", label: "Reportes" },
  { value: "users", label: "Usuarios" },
  { value: "roles", label: "Roles" },
];

const tabs = computed(() => {
  if (userRole === "admin") {
    return allTabs;
  } else {
    return allTabs.filter((tab) => tab.value !== "roles");
  }
});
</script>
