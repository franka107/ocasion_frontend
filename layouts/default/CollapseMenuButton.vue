<template>
  <div>
    <Collapsible
      v-if="isOpen"
      :open="isCollapsed"
      class="w-full"
      @open-change="setIsCollapsed"
    >
      <CollapsibleTrigger
        class="[&[data-state=open]>div>div>svg]:rotate-180 mb-1 w-full"
      >
        <Button
          :variant="'ghost'"
          class="w-full justify-start h-10 hover:bg-[#36576e]"
          @click="setIsCollapsed(!isCollapsed)"
        >
          <div class="w-full items-center flex justify-between">
            <div class="flex items-center">
              <span class="mr-4">
                <CustomIcons
                  :class="
                    cn(
                      `${isSubmenuActive ? 'fill-white text-white [&>svg]:text-white' : 'fill-[#a9b6c0] [&>svg]:text-[#a6b4bf] '}`,
                    )
                  "
                  :name="icon"
                />
              </span>
              <p
                v-if="isOpen"
                :class="[
                  'max-w-[150px] truncate text-[#a4b2be]',
                  isOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-96 opacity-0',
                ]"
              >
                {{ label }}
              </p>
            </div>
            <div
              :class="[
                'whitespace-nowrap',
                isOpen
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-96 opacity-0',
              ]"
            >
              <ChevronDown
                size="18"
                class="transition-transform duration-200 text-[#a4b2be] [&>svg]:text-[#a6b4bf]"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent
        class="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      >
        <Button
          v-for="(submenu, index) in submenus"
          :key="index"
          :variant="'ghost'"
          class="w-full justify-start h-10 mb-1 hover:bg-[#36576e]"
          :class="
            cn(
              `w-full justify-start h-10 mb-1 hover:bg-[#36576e] hover:text-white`,
              `${submenu.active && 'bg-[#36576e] text-white'}`,
            )
          "
          as-child
        >
          <NuxtLink :to="submenu.href" class="flex items-center">
            <span class="ml-6">
              <Dot class="text-[#a6b4bf]" size="18" />
            </span>
            <p
              :class="[
                'max-w-[170px] truncate text-[#a6b4bf]',
                `${submenu.active && 'text-white'}`,
                isOpen
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-96 opacity-0',
              ]"
            >
              {{ submenu.label }}
            </p>
          </NuxtLink>
        </Button>
      </CollapsibleContent>
    </Collapsible>
    <DropdownMenu v-else>
      <TooltipProvider disable-hoverable-content>
        <Tooltip :delay-duration="100">
          <TooltipTrigger>
            <DropdownMenuTrigger>
              <Button
                :variant="'ghost'"
                class="w-full justify-start h-10 mb-1 hover:bg-[#36576e]"
              >
                <div class="w-full items-center flex justify-between">
                  <div class="flex items-center">
                    <span :class="isOpen === false ? '' : 'mr-4'">
                      <CustomIcons
                        :class="
                          cn(
                            ``,
                            `${isSubmenuActive ? 'fill-white text-white [&>svg]:text-white' : 'fill-[#a9b6c0] [&>svg]:text-[#a6b4bf]'}`,
                          )
                        "
                        :name="icon"
                      />
                    </span>
                    <p
                      v-if="isOpen"
                      :class="[
                        'max-w-[200px] truncate',
                        isOpen === false ? 'opacity-0' : 'opacity-100',
                      ]"
                    >
                      {{ label }}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" :align-offset="2">
            {{ label }}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" :side-offset="25" align="start">
        <DropdownMenuLabel class="max-w-[190px] truncate">
          {{ label }}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem v-for="(submenu, index) in submenus" :key="index">
          <NuxtLink :to="submenu.href" class="cursor-pointer">
            <p class="max-w-[180px] truncate">{{ submenu.label }}</p>
          </NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuArrow class="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Dot } from 'lucide-vue-next'
import { DropdownMenuArrow } from 'radix-vue'
import Collapsible from '~/components/ui/collapsible/Collapsible.vue'

const props = defineProps({
  icon: String,
  label: String,
  active: Boolean,
  submenus: Array,
  isOpen: Boolean,
})

const isSubmenuActive = ref(props.submenus.some((submenu) => submenu.active))
const isCollapsed = ref(isSubmenuActive.value)

function setIsCollapsed(value) {
  isCollapsed.value = value
}
</script>
