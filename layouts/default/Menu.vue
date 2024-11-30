<template>
  <ScrollArea class="[&>div>div[style]]:!block">
    <nav class="h-full w-full">
      <ul
        class="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2"
      >
        <li
          v-for="(menuGroup, index) in menuList"
          :key="index"
          :class="['w-full', menuGroup.groupLabel ? 'pt-5' : '']"
        >
          <p
            v-if="
              (isSidebarOpen && menuGroup.groupLabel) ||
              isSidebarOpen === undefined
            "
            class="text-sm text-white font-medium text-muted-foreground px-1 pb-2 max-w-[248px] truncate"
          >
            {{ menuGroup.groupLabel }}
          </p>
          <TooltipProvider
            v-else-if="
              !isSidebarOpen &&
              isSidebarOpen !== undefined &&
              menuGroup.groupLabel
            "
          >
            <Tooltip :delay-duration="100">
              <TooltipTrigger class="w-full">
                <div class="w-full flex text-white justify-center items-center">
                  <Ellipsis class="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" class="text-[#a6b4bf]">
                <p>{{ menuGroup.groupLabel }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p v-else class="pb-2"></p>
          <div
            v-for="(menu, index) in menuGroup.menus"
            :key="index"
            class="w-full"
          >
            <div v-if="menu.submenus.length === 0">
              <TooltipProvider disable-hoverable-content>
                <Tooltip :delay-duration="100">
                  <TooltipTrigger as-child>
                    <NuxtLink :to="menu.href">
                      <Button
                        :variant="'ghost'"
                        :class="
                          cn(
                            `w-full justify-start h-10 mb-1 text-[#36576e] hover:bg-[#36576e] hover:text-white`,
                            `${menu.active && 'bg-[#36576e] text-white'}`,
                          )
                        "
                      >
                        <div class="flex flew-row">
                          <span :class="isSidebarOpen === false ? '' : 'mr-4'">
                            <CustomIcons
                              class="[&>svg]:text-[#a6b4bf]"
                              :name="menu.icon"
                            />
                          </span>
                          <p
                            :class="[
                              'max-w-[200px] truncate text-[#a6b4bf]',
                              `${menu.active && 'text-white'}`,
                              isSidebarOpen === false
                                ? '-translate-x-96 opacity-0'
                                : 'translate-x-0 opacity-100',
                            ]"
                          >
                            {{ menu.label }}
                          </p>
                        </div>
                      </Button>
                    </NuxtLink>
                  </TooltipTrigger>
                  <TooltipContent
                    v-if="isSidebarOpen === false"
                    side="right"
                    class="text-[#a6b4bf]"
                  >
                    {{ menu.label }}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CollapseMenuButton
              v-else
              :icon="menu.icon"
              :label="menu.label"
              :active="menu.active"
              :submenus="menu.submenus"
              :is-open="isSidebarOpen"
            />
          </div>
        </li>

        <li v-if="props.showToggleButton" class="w-full grow flex items-end">
          <SidebarToggle v-model:is-sidebar-open="isSidebarOpen" />
        </li>
      </ul>
    </nav>
  </ScrollArea>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { BookmarkMinus, Ellipsis, LogOut } from 'lucide-vue-next'

import { getMenuList } from './menu-list'
import CollapseMenuButton from './CollapseMenuButton.vue'
import SidebarToggle from './SidebarToggle.vue'
import ScrollArea from '~/components/ui/scroll-area/ScrollArea.vue'
import { UserType } from '~/types/Administrators'

const { getMyGrants } = useAuthManagement()
// const props = defineProps({
//   isSidebarOpen: {
//     type: Boolean,
// 		required: true
//   },
// });
//
const myGrants = await getMyGrants()

const isSidebarOpen = defineModel<boolean>('isSidebarOpen', { required: true })
const props = defineProps<{
  showToggleButton: boolean
}>()

const userSession = useUserSession()
const type = userSession.user.value?.user.type === UserType.Participant

const route = useRoute()
const pathname = computed(() => route.path)
const menuList = computed(() =>
  getMenuList(
    pathname.value,
    myGrants.data.value ?? [],
    type,
    route.params.organizationId as string,
  ),
)

function handleSignOut() {
  // Lógica para cerrar sesión
}
</script>
<style>
.icon-normal {
  color: #a6b4bf;
}

.icon-active {
  color: #ffffff;
}

.text-normal {
  color: #a6b4bf;
}

.text-active {
  color: #ffffff;
}

</style>
