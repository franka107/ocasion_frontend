<template>
  <div :class="cn(`flex w-full`, `${isSidebarOpen ? 'justify-end': 'justify-center'}`)">
    <TooltipProvider disable-hoverable-content>
      <Tooltip :delay-duration="100">
        <TooltipTrigger as-child>
          <Button
            @click="isSidebarOpen = !isSidebarOpen"
            variant="ghost"
            size="icon"
            class="hover:bg-transparent"
          >
            <CustomIcons
            name="Arrow"
              :class="[
                'h-6 w-6 fill-[#a6b4bf] transition-transform ease-in-out duration-700',
                isSidebarOpen === true ? 'rotate-180' : 'rotate-0',
              ]"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent v-if="isSidebarOpen === false" side="right">
          Toggle
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script lang="ts" setup>
import { ChevronLeft } from "lucide-vue-next";

const isSidebarOpen = defineModel<boolean>("isSidebarOpen", { required: true });
</script>
