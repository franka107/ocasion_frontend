<script setup lang="ts">
import { MenuIcon, PanelsTopLeft } from 'lucide-vue-next'
import Menu from './Menu.vue'
import Sheet from '~/components/ui/sheet/Sheet.vue'
import SheetTrigger from '~/components/ui/sheet/SheetTrigger.vue'
import SheetContent from '~/components/ui/sheet/SheetContent.vue'
import SheetHeader from '~/components/ui/sheet/SheetHeader.vue'
import SheetTitle from '~/components/ui/sheet/SheetTitle.vue'
import Button from '~/components/ui/button/Button.vue'
import alternativeLogo from '@/assets/img/alternative_logo.png'
import logo from '@/assets/img/logo.png'
import { UserType } from '~/types/Administrators'

const sidebarOpen = ref(false)
const userSession = useUserSession()
const isParticipant = userSession.user.value?.user.type === UserType.Participant
</script>

<template>
  <Sheet>
    <SheetTrigger class="lg:hidden" as-child>
      <Button
        class="h-8"
        variant="outline"
        :onclick="
          () => {
            sidebarOpen = true
          }
        "
        size="icon"
      >
        <MenuIcon :size="20" />
      </Button>
    </SheetTrigger>
    <SheetContent
      v-model:open="sidebarOpen"
      :class="`${isParticipant ? 'bg-white' : 'bg-[#20445e]'} border-none`"
      side="left"
    >
      <div class="pt-4 pb-4 pl-4">
        <Button
          class="flex justify-center items-center pb-2 pt-1"
          variant="link"
          as-child
        >
          <div class="flex items-center gap-2">
            <img
              :src="isParticipant ? logo : alternativeLogo"
              alt="Company Logo"
              :class="cn('rounded-md object-contain h-11')"
            />
          </div>
        </Button>
      </div>
      <Menu
        v-model:is-sidebar-open="isSidebarOpen"
        :show-toggle-button="false"
      />
    </SheetContent>
  </Sheet>
</template>
