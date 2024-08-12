<template>
  <div class="flex items-center gap-4">
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" class="relative bg-gray-100 w-10 h-10 rounded-full">
          <Badge class="absolute -bottom-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-orange-500">
            <p class="text-xs font-medium leading-4 text-white">{{ notifications.length }}</p>
          </Badge>
          <img src="@/assets/icon/svg/icon-noti.svg" class="w-5 h-5 m-auto" />
          <span class="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <!-- TODO: change background notification panel -->
      <PopoverContent class="w-80 p-0 mr-4 bg-slate-800">
        <Card class="border-0 shadow-lg bg-slate-800 overflow-y-auto no-scrollbar">
          <!-- <CardHeader class="border-b px-6 py-4">
            <CardTitle class="text-white">Notifications</CardTitle>
            <CardDescription class="text-white/60">You have {{ notifications.length }} unread notifications</CardDescription>
          </CardHeader> -->
          <CardContent class="max-h-[900px] overflow-y-auto px-0 py-2 ">
            <div class="space-y-4 py-2">
              <div v-if="loading" class="flex justify-center items-center h-full">
                <img src="@/assets/icon/svg/icon-spinner.svg" class="animate-spin w-6 h-6" />
              </div>
              <template v-else>
                <NotificationItem
                  v-for="(notification, index) in limitedNotifications"
                  :key="index"
                  :notification="notification"
                />
              </template>
            </div>
          </CardContent>
          <!-- <CardFooter class="border-t px-6 py-4">
            <Button variant="ghost" class="bg-primary rounded-full w-full text-white">
              <router-link to="#" class="inline-flex items-center gap-2 text-sm font-medium">
                Archivar
              </router-link>
            </Button>
          </CardFooter> -->
        </Card>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import NotificationItem from '@/components/notifications/NotificationItem.vue';

const loading = ref(true);
const notifications = ref([]);

const limitedNotifications = computed(() => notifications.value.slice(0, 6));

onMounted(() => {
  // Simulación de una petición con datos falsos
  setTimeout(() => {
    notifications.value = [
      { title: 'Your order has been shipped', time: 'Today, 12:34 PM', type: 'Shipping' },
      { title: 'Your subscription is expiring soon', time: 'August 15, 9:00 AM', type: 'Subscription' },
      { title: 'Your account has been verified', time: 'Yesterday, 3:22 PM', type: 'Account' },
      // Agrega más notificaciones aquí para simular más de 6
      { title: 'Your password was changed', time: 'Today, 10:00 AM', type: 'Security' },
      { title: 'New login from a new device', time: 'Today, 9:45 AM', type: 'Security' },
      { title: 'You received a new message', time: 'Today, 9:30 AM', type: 'Message' },
      { title: 'New comment on your post', time: 'Today, 9:15 AM', type: 'Social' },
    ];
    loading.value = false;
  }, 3000); // Simula 3 segundos de tiempo de carga
});

</script>
