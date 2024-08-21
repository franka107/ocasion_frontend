<template>
  <aside
    :class="[
      'fixed top-0 left-0  h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
      isSidebarOpen === false ? 'w-[90px]' : 'w-72',
    ]"
  >
    <div
      class="relative bg-[#20445e] h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800"
    >
      <div
        :class="[
          'transition-transform ease-in-out duration-300 mb-1',
          isSidebarOpen === false ? 'translate-x-1' : 'translate-x-0',
        ]"
        to="/backoffice"
        class="flex  gap-2 pl-3 pt-1 pb-3"
      >
        <div v-if="isSidebarOpen">
          <img
            :src="alternativeLogo"
            alt="Company Logo"
            :class="cn('rounded-md object-contain h-11')"
          />
        </div>
        <div class="w-full" v-else>
          <img
            :src="smallLogo"
            alt="Company Logo"
            :class="cn('rounded-md object-contain h-9 ')"
          />
        </div>
      </div>
      <Menu v-model:isSidebarOpen="isSidebarOpen" :showToggleButton="true" />
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Menu from "./Menu.vue";
import SidebarToggle from "./SidebarToggle.vue";
import { PanelsTopLeft } from "lucide-vue-next";
import smallLogo from "@/assets/img/small_logo.png";
import alternativeLogo from "@/assets/img/alternative_logo.png";

const isSidebarOpen = defineModel<boolean>("isSidebarOpen", { required: true });
</script>
