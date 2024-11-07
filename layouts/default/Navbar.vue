<script setup lang="ts">
import Notification from '~/components/notifications/Notification.vue';
import SheetMenu from './SheetMenu.vue';
import UserNav from './UserNav.vue';
const router = useRouter();
const props = defineProps<{
  title: string
  showArrow?: boolean; 
}>()
</script>

<template>
	 <header class="sticky top-0  w-full bg-[#f1f5f9] z-10   backdrop-blur supports-[backdrop-filter]:bg-[#f1f5f9] ">
      <div class="mx-4 sm:mx-8 flex flex-row h-20  justify-between items-center">
        <div class="flex flex-row items-center space-x-4 lg:space-x-0">
          <SheetMenu />
            <span v-if="props.showArrow" class="cursor-pointer pr-2" @click="router.back">
              <CustomIcons name="BackArrow" class="w-5 h-5 text-[#1F4E6D]" />
            </span>
          <h1 class="font-bold text-xl text-[#204e6d] ">{{ props.title }}</h1>
        </div>
        <div class="flex flex-1 items-center space-x-4 justify-end">
          <Notification />
          <UserNav/>
        </div>
      </div>
    </header>
</template>