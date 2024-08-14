<template>
  <section
    class=" h-screen flex flex-col items-start justify-between shadow-sm"
  >
    <section class="w-full">
      <figure class="h-11 mb-7">
        <img
          :src="logoSrc"
          alt="Company Logo"
          :class="
            cn('rounded-md object-contain h-full',
              props.collapsed
                ? ' m-[0_auto]'
                : ''
            )
          "
        />
      </figure>
  
      <TabsSection :tabs="tabs" :collapsed="props.collapsed" />
    </section>
  </section>
</template>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import TabsSection from "@/components/layouts/TabsSection.vue";
import Notification from "@/components/notifications/Notification.vue";
import dashboardImage from '@/assets/icon/svg/dashboard.svg';
import workOutlineImage from '@/assets/icon/svg/work_outline.svg';
import groupsImage from '@/assets/icon/svg/groups.svg';
import eventImage from '@/assets/icon/svg/event.svg';
import settingsImage from '@/assets/icon/svg/settings.svg';
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
    { value: "configuration", label: "Configuración", url: "/dashboard/reports", srcImage: settingsImage },
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
