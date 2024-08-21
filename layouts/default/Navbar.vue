<script setup lang="ts">
import Notification from '~/components/notifications/Notification.vue';
import SheetMenu from './SheetMenu.vue';
import UserNav from './UserNav.vue';
const props = defineProps<{
  title: string
}>()
</script>

<template>
	 <header class="sticky top-0  w-full bg-[#f1f5f9]   backdrop-blur supports-[backdrop-filter]:bg-[#f1f5f9] ">
      <div class="mx-4 sm:mx-8 flex flex-row h-20  justify-between items-center">
        <div class="flex flex-row items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 class="font-bold text-xl text-[#204e6d] ">{{ props.title }}</h1>
        </div>
        <div class="flex flex-1 items-center space-x-4 justify-end">
          <Notification />
          <UserNav/>
        </div>
      </div>
    </header>
</template>