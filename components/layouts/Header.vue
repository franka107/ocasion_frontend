<template>
  <section
    class=" h-screen px-3 py-6 flex flex-col items-start justify-between border-b-2 shadow-sm"
  >
    <section class="w-full">
      <figure class="h-11 mb-7">
        <img
          :src="logoSrc"
          alt="Company Logo"
          class="rounded-md object-contain h-full"
        />
      </figure>
  
      <TabsSection :tabs="tabs" />
    </section>
  </section>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import TabsSection from "@/components/layouts/TabsSection.vue";
import Notification from "@/components/notifications/Notification.vue";
import dashboardImage from '@/assets/img/dashboard.png';
import workOutlineImage from '@/assets/img/work_outline.png';
import groupsImage from '@/assets/img/groups.png';
import eventImage from '@/assets/img/event.png';
import settingsImage from '@/assets/img/settings.png';
import smallLogo from '@/assets/img/small_logo.png';
import alternativeLogo from '@/assets/img/alternative_logo.png';
const props = defineProps<{ collapsed: boolean }>();

const userRole = "admin";
const allTabs = useState<{ value: string; label: string; url: string, srcImage: string}[]>(
  "tabs",
  () => [
    { value: "dashboard", label: "Dashboard", url: "/dashboard/reports", srcImage: dashboardImage },
    { value: "roles", label: "Roles", url: "/dashboard/roles", srcImage: workOutlineImage },
    { value: "users", label: "Usuarios", url: "/dashboard/users", srcImage: groupsImage },
    { value: "events", label: "Eventos", url: "/dashboard/events", srcImage: eventImage },
    { value: "configuración", label: "Configuración", url: "/dashboard/reports", srcImage: settingsImage },
  ]
);

const logoSrc = computed(() => {
  return props.collapsed ? smallLogo : alternativeLogo;
});

const tabs = computed(() => {
  if (userRole === "admin") {
    return allTabs.value;
  } else {
    return allTabs.value.filter((tab) => tab.value !== "roles");
  }
});
</script>
