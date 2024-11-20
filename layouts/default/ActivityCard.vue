<template>
  <div class="bg-white border rounded-lg shadow my-8 mx-auto p-2">
    <h2 class="text-2xl font-medium mb-6">{{ title }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-[#F4F7FA] rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="border rounded-lg bg-[#E6F0F8] p-3 flex-shrink-0">
              <CustomIcons :name="icon1" class="w-8 h-8" />
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold">{{ value1 }}</span>
              <span class="text-gray-500 text-sm">{{ label1 }}</span>
            </div>
          </div>
          <button class="text-orange-500 text-xs mb-12 hover:text-orange-700">
            Ver detalle
          </button>
        </div>
      </div>

      <div class="bg-[#F4F7FA] rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="border rounded-lg bg-[#E6F0F8] p-3 flex-shrink-0">
              <CustomIcons :name="icon2" class="w-8 h-8" />
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold">{{ value2 }}</span>
              <span class="text-gray-500 text-sm">{{ label2 }}</span>
            </div>
          </div>
          <button class="text-orange-500 text-xs mb-12 hover:text-orange-700">
            Ver detalle
          </button>
        </div>
      </div>

      <div class="bg-[#F4F7FA] rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="border rounded-lg bg-[#E6F0F8] p-3 flex-shrink-0">
              <CustomIcons :name="icon3" class="w-8 h-8" />
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold">{{ value3 }}</span>
              <span class="text-gray-500 text-sm">{{ label3 }}</span>
            </div>
          </div>
          <button class="text-orange-500 text-xs mb-12 hover:text-orange-700">
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomIcons from '~/components/ui/custom-icons/CustomIcons.vue'
interface ActivitiesCardProps {
  title: string
  icon1: string
  icon1Alt: string
  value1: string | number
  label1: string
  icon2: string
  icon2Alt: string
  value2: string | number
  label2: string
  icon3: string
  icon3Alt: string
  value3: string | number
  label3: string
}
defineProps<ActivitiesCardProps>()
</script>
