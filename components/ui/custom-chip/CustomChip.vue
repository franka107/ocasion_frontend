<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type CustomChipVariants, customChipVariants } from '.'
import { type IconVariants, iconVariants } from '.'
import { cn } from '@/lib/utils'

interface Props extends PrimitiveProps {
  variant?: CustomChipVariants['variant']
  class?: HTMLAttributes['class']
  text: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(customChipVariants({ variant }), props.class)"
  >
    <slot>
        <div :class="iconVariants({ variant })"/>
        <span class="ml-1 relative top-[-1px]">{{ text }}</span>
    </slot>
  </Primitive>
</template>
