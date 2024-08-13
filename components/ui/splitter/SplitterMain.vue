<script setup>
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
</script>

<template>
  <SplitterPanel
    id="splitter-group-1-panel-2"
    :min-size="20"
    :defaultSize="80"
    class="bg-white flex items-center justify-center"
  >
    <slot/>
  </SplitterPanel>
</template>