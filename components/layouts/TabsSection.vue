<template>
  <div class="flex-grow flex justify-center">
    <Tabs defaultValue="dashboard" class="w-[400px]">
      <TabsList>
        <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value" :class="{ 'bg-white': route.path.includes(tab.value) }" asChild>
          <NuxtLink :to="tab.url">
            {{ tab.label }}
          </NuxtLink>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
const route = useRoute()
const props = defineProps<{
  tabs: { value: string, label: string, url: string }[]
}>();
</script>
