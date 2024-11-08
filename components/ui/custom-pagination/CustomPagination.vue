<template>
  <div class="w-full flex justify-between">
    <div class="flex flex-row items-center">
      <span class="text-[#475569]">Total de registros</span>
      <div
        class="ml-2 bg-white rounded-[8px] text-primary w-[34px] h-[36px] flex justify-center items-center"
      >
        {{ total }}
      </div>
    </div>
    <div class="flex flex-row gap-x-[6px]">
      <button
        @click="props.page > 1 ? emit('update:page', props.page - 1) : null"
        :class="cn(activeBtnClass({ size: 'md' }), 'w-[120px]')"
        :disabled="props.page <= 1"
      >
        <CustomIcons name="ArrowLeft" class="rotate-180 mr-1 w-6 h-6" />
        <span>Atrás</span>
      </button>

      <button
        v-for="(pageNumber, i) in visiblePages"
        :key="i"
        :class="[
          activeBtnClass({
            status: props.page === pageNumber ? 'active' : 'inactive',
            size: 'sm'
          }),
          pageNumber === '...' ? 'cursor-default hover:bg-white hover:text-primary' : ''
        ]"
        @click="pageNumber !== '...' ? emit('update:page', pageNumber) : null"
        :disabled="pageNumber === '...'"
      >
        {{ pageNumber }}
      </button>

      <button
        @click="props.page < pages ? emit('update:page', props.page + 1) : null"
        :class="cn(activeBtnClass({ size: 'md' }), 'w-[120px]')"
        :disabled="props.page >= pages"
      >
        <span>Siguiente</span>
        <CustomIcons name="ArrowLeft" class="ml-1 w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CustomIcons from "@/components/ui/custom-icons/CustomIcons.vue";
import { cva } from "class-variance-authority";
import { cn } from '@/lib/utils';

const btnStyles = "flex justify-center items-center rounded-[8px] h-[36px] transition-colors duration-200";
const activeBtnClass = cva([btnStyles], {
  variants: {
    status: {
      active: "bg-primary text-white hover:bg-white hover:text-primary",
      inactive: "bg-white text-primary hover:bg-primary hover:text-white",
    },
    size: {
      sm: "w-[34px]",
      md: "w-[78px]",
    },
  },
  defaultVariants: {
    status: "inactive",
    size: "sm",
  },
});

// Props y Emits
const props = defineProps({
  total: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:page']);


const pages = computed(() => Math.ceil(props.total / props.limit));

const visiblePages = computed(() => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  range.push(1);

  for (let i = Math.max(2, props.page - delta); i <= Math.min(pages.value - 1, props.page + delta); i++) {
    range.push(i);
  }

  if (pages.value > 1) {
    range.push(pages.value);
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: white;
  color: var(--primary-color);
}
</style>
