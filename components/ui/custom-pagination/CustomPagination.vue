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
        @click="props.page > 1 ? emit('update:page', props.page - 1) : () => {}"
        :class="cn(activeBtnClass({ size: 'md' }), 'w-[120px]')"
      >
        <CustomIcons name="ArrowLeft" class="rotate-180 mr-1 w-6 h-6" /><span
          >Atras</span
        >
      </button>
      <button
        v-for="(pageNumber, i) in pages"
        :key="i"
        :class="
          activeBtnClass({
            status: props.page === pageNumber ? 'active' : 'inactive',
          })
        "
        @click="emit('update:page', pageNumber)"
      >
        {{ pageNumber }}
      </button>
      <button
        @click="
          props.page < pages ? emit('update:page', props.page + 1) : () => {}
        "
        :class="cn(activeBtnClass({ size: 'md' }), 'w-[120px]')"
      >
        <span>Siguiente</span
        ><CustomIcons name="ArrowLeft" class="ml-1 w-6 h-6" />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import CustomIcons from "@/components/ui/custom-icons/CustomIcons.vue";
import { cva } from "class-variance-authority";

const btnSyles = "flex justify-center items-center rounded-[8px] h-[36px]";
const activeBtnClass = cva([btnSyles, "w-[34px]"], {
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

const page = defineModel("page");
const props = defineProps(["total", "limit", "page"]);
const emit = defineEmits(["update:page"]);

const pages = computed(() => Math.ceil(props.total / props.limit));
</script>
