<template>
  <div class="">
    <Tabs defaultValue="dashboard" class="text-white/50">
      <TabsList class="flex flex-col gap-2">
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :class="
            cn(' w-full h-14 hover:bg-foreground/5',
              route.path.includes(tab.value)
                ? 'text-white'
                : 'text-white/50'
            )
          "
          asChild
        >
          <NuxtLink class="flex gap-2" :to="tab.url">
            <img :class="
            cn('min-w-4 w-7',
              props.collapsed
                ? 'm-[0_auto] w-7'
                : ''
            )
          " v-bind:src="tab.srcImage" :alt="tab.label">
            {{ visibleLabel(tab.label) }}
          </NuxtLink>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const route = useRoute();
const props = defineProps<{
  tabs: { value: string; label: string; url: string, srcImage: string }[],
  collapsed: boolean
}>();
const visibleLabel = computed(() => {
  return (label: string) => (props.collapsed ? '' : label);
});
</script>
