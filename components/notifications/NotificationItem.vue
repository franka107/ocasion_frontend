<template>
  <!-- TODO: change background in hover -->
  <div v-if="notification" class="hover:bg-slate-900 px-6">
    <div class="flex gap-4 justify-center items-center">
      <div class="space-y-1 py-2 w-10/12">
        <p class="text-sm font-medium text-white">{{ notification.title }}</p>
        <p class="text-xs text-white/60">
          <time :datetime="notification.datetime">{{ notification.time }}</time>
        </p>
        <p class="rounded-full py-1 text-xs text-white/60">
          {{ notification.type }}
        </p>
      </div>
      <Button variant="ghost" size="icon" class="ml-auto w-2/12 hover:bg-slate-800">
        <img src="@/assets/icon/svg/icon-chevron-right.svg" class="w-5 h-5 m-auto" />
        <span class="sr-only">View notification</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Button } from "@/components/ui/button";

// Definir el tipo para notification
interface Notification {
  id: string;
  title: string;
  datetime: string;
  time: string;
  type: string;
}

const props = defineProps<{
  notification?: Notification; // Marcarlo como opcional
}>();
</script>
