<template>
  <!-- TODO: change background in hover -->
  <div v-if="notification" 
  :onclick="onNotificationPressed"
   class="hover:bg-slate-900 px-6 cursor-pointer">
    <div class="flex relative w-full">
      <div class="space-y-1 py-2">
        <p class="text-sm font-medium text-white">{{ notification.message }}</p>
        <p class="rounded-full py-1 text-xs text-white/60">
          {{ notification.tag }} -
          {{
            notificationDf.format(
              parseAbsolute(notification.createdAt, getLocalTimeZone()).toDate()
            )
          }}
        </p>
      </div>
      <div class="absolute right-0 flex  m-auto rounded-full h-full">
        <div class="m-auto">
          <img
            src="@/assets/icon/svg/icon-chevron-right.svg"
            class="w-5 h-5 m-auto"
          />
          <span class="sr-only">View notification</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Button } from "@/components/ui/button";
import type { Notification } from "~/types/Notification";

import {
  DateFormatter,
  getLocalTimeZone,
  parseAbsolute,
  parseDateTime,
} from "@internationalized/date";

const notificationDf = new DateFormatter("es", {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "long",
});

const {
  removeNotifications
} = useNotificationAPI();

const onNotificationPressed = () => {
  removeNotifications([props.notification.id])

}

const props = defineProps<{
  notification: Notification; 
}>();
</script>
