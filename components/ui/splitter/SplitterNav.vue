<script setup lang="ts">
  import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue'
  import arrowIcon from '@/assets/icon/svg/arrow_forward.svg';

  const emit = defineEmits(['collapse', 'expand'])

  const panelRef = ref<InstanceType<typeof SplitterPanel>>()

  const togglePanel = () => {
    if (panelRef.value?.isCollapsed) {
      panelRef.value.expand()
      emit('expand')
    } else {
      panelRef.value.collapse()
      emit('collapse')
    }
  }
</script>

<template>

  <SplitterPanel
    ref="panelRef"
    collapsible
    :collapsed-size="3"
    :min-size="3"
    :defaultSize="14"
    :maxSize="16"
    class="bg-[#20445E]  flex flex-col h-[100vh] px-4 pt-6 pb-12"
    @expand="emit('expand')"
    @collapse="emit('collapse')"
  >
      <slot/>
      <button :class="
      cn('flex justify-end p-2 ',
      panelRef?.isCollapsed
                ? ''
                : 'mr-3'
      )
    " @click="togglePanel">
        <img :src="arrowIcon" :class="
            cn('min-w-4 w-6',
              panelRef?.isCollapsed
                ? 'm-[0_auto]'
                : 'flex justify-end rotate-180'
            )
          " alt="arrow_icon">
      </button>
  </SplitterPanel>
</template>