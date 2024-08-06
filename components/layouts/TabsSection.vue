<template>
  <div class="flex-grow flex justify-center">
    <Tabs defaultValue="dashboard" class="w-[400px]">
      <TabsList>
        <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value" asChild>
          <button @click="() => false">
            {{ tab.label }}
          </button>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const props = defineProps<{
  tabs: { value: string, label: string }[]
}>();
</script>
