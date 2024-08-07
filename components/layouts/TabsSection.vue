<template>
  <div class="flex-grow flex justify-center">
    <Tabs defaultValue="dashboard" class="">
      <TabsList class="flex gap-4 bg-blue/[0.07] py-7 px-4 rounded-lg text-sm font-medium leading-5">
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :class="
            cn('rounded-lg w-28 h-10 hover:bg-foreground/5',
              route.path.includes(tab.value)
                ? 'bg-white text-primary'
                : 'text-primary/50'
            )
          "
          asChild
        >
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
const route = useRoute();
const props = defineProps<{
  tabs: { value: string; label: string; url: string }[];
}>();
</script>
