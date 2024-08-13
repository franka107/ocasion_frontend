<script setup lang="ts">
  import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
  const emit = defineEmits(['collapse', 'expand'])

  const panelRef = ref<InstanceType<typeof SplitterPanel>>()

  const togglePanel = () => {
    if (panelRef.value?.isCollapsed) {
      panelRef.value.expand()
      emit('expand') // Emitimos el evento 'expand'
    } else {
      panelRef.value.collapse()
      emit('collapse') // Emitimos el evento 'collapse'
    }
  }
</script>

<template>

  <SplitterPanel
    ref="panelRef"
    collapsible
    :collapsed-size="6"
    :min-size="6"
    :defaultSize="16"
    :maxSize="16"
    class="bg-[#20445E]  flex flex-col"
    @expand="emit('expand')"
    @collapse="emit('collapse')"
  >
      <slot/>
      <!-- <button @click="togglePanel">
        {{ panelRef?.isCollapsed ? 'Expand' : 'Collapse' }}
      </button> -->
  </SplitterPanel>
</template>