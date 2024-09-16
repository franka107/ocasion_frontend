<template>
  <div class="flex items-center gap-4">
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          class="relative bg-[#e8edf3] hover:bg-[#d1d7de] w-10 h-10 rounded-full"
        >
          <Badge
            class="absolute -bottom-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500"
          >
            <p
              v-if="status === 'success'"
              class="text-xs font-medium leading-4 text-white"
            >
              {{ notifications.length }}
            </p>
            <p v-else>⦿</p>
          </Badge>
          <img src="@/assets/icon/svg/icon-noti.svg" class="w-5 h-5 m-auto" />
          <span class="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <!-- TODO: change background notification panel -->
      <PopoverContent class="w-80 p-0 mr-4 bg-slate-800">
        <Card
          class="border-0 shadow-lg bg-slate-800 overflow-y-auto no-scrollbar"
        >
          <CardContent class="max-h-[900px] overflow-y-auto px-0 py-2">
            <div class="space-y-4 py-2">
              <div
                v-if="status === 'pending'"
                class="flex justify-center items-center h-full"
              >
                <img
                  src="@/assets/icon/svg/icon-spinner.svg"
                  class="animate-spin w-6 h-6"
                />
              </div>
              <template v-else>
                <NotificationItem
                  v-for="(notification, index) in limitedNotifications"
                  :key="index"
                  @on-remove="refresh"
                  :notification="notification"
                />
              </template>
            </div>
          </CardContent>
          <CardFooter class="px-3 py-4">
            <Button
              variant="ghost"
              :onclick="onArchiveButtonPressed"
              class="bg-[#06b6d4] rounded-full w-full text-[#062a44]"
            >
              <div class="inline-flex items-center gap-2 text-sm font-medium">
                Archivar
              </div>
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import NotificationItem from "@/components/notifications/NotificationItem.vue";
import type { Notification } from "~/types/Notification";
import { useNotificationAPI } from "~/composables/useNotificationAPI";
import {
  domainEvents,
  type NotificationCreatedDomainEvent,
  type NotificationReadedDomainEvent,
} from "~/types/DomainEvent";
import { useWebNotification } from "@vueuse/core";
import { useSound } from "@vueuse/sound";
import notificationSound from "~/assets/sounds/notification.mp3";

const { getNotReadedNotifications, listenDomainEvents, removeNotifications } =
  useNotificationAPI();
const {
  data: notifications,
  refresh,
  status,
} = await getNotReadedNotifications();
const limitedNotifications = computed(() => notifications.value.slice(0, 7));

const webNotification = useWebNotification({
  title: "Nueva notificación",
  lang: "es",
  body: "Revisa tu historial de notificaciones",
  icon: "/favicon.ico",
});
const notificationCreatedListener =
  listenDomainEvents<NotificationCreatedDomainEvent>(
    domainEvents.notificationCreated,
  );

const { play, sound } = useSound(notificationSound);

const onArchiveButtonPressed = async () => {
  await removeNotifications(limitedNotifications.value.map((e) => e.id));
  refresh();
};

watch(notificationCreatedListener.data, (value, oldValue) => {
  play();
  webNotification.show();
  refresh();
});
</script>
