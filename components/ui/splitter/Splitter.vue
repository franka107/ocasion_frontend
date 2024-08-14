<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
</script>

<template>
  <SplitterGroup
    id="splitter-group-1"
    direction="horizontal"
  >
    <slot />
  </SplitterGroup>
</template>