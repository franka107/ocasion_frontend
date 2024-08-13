<template>
  <div class="">
    <Tabs defaultValue="dashboard" class="">
      <TabsList class="flex flex-col gap-4">
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :class="
            cn(' w-full h-14 hover:bg-foreground/5',
              route.path.includes(tab.value)
                ? ' text-white'
                : 'text-white/50'
            )
          "
          asChild
        >
          <NuxtLink class="flex gap-1" :to="tab.url">
            <img class="max-w-6" v-bind:src="tab.srcImage" :alt="tab.label">
            {{ tab.label }}
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
  tabs: { value: string; label: string; url: string, srcImage: string }[];
}>();
</script>
