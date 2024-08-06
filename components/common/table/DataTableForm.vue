<script setup lang="ts">
import { PlusIcon } from "@radix-icons/vue";

interface FormProps {
  onCreate: () => void;
  createButtonLabel: string
}

const props = defineProps<FormProps>();

</script>

<template>
  <!-- <SheetTrigger asChild> -->
    <Button
      class="ml-auto h-12 text-white border-none"
      @click="onCreate"
    >
      <PlusIcon class="mr-2 h-4 w-4" />
      {{ props.createButtonLabel }}
    </Button>
  <!-- </SheetTrigger> -->
  <!-- <SheetContent side="right" class="overflow-auto max-h-screen"> -->
    <slot />
  <!-- </SheetContent> -->
</template>
