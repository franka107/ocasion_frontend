<script setup lang="ts">
import { ref } from "vue";
import { CheckIcon, TrashIcon, ClipboardIcon } from "@radix-icons/vue";

const props = defineProps({
  anexoText: {
    type: String,
    default: "Anexos",
  },
  instructionsText: {
    type: String,
    default: "Cargar máximo hasta 3 archivos (xlsx, docx o pdf)",
  },
  modelValue: {
    type: Array as () => File[],
    // type: Array,
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: "",
  },
});

const files = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits(["update:modelValue"]);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const newFiles = Array.from(input.files).slice(0, 3 - files.value.length); // Limitar a 3 archivos
    files.value = [...files.value, ...newFiles];
    emit("update:modelValue", files.value);
    // input.value = ""; // Resetear input
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit("update:modelValue", files.value);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// watch(files.value, (newVal) => {
//   console.log(newVal)
// })

</script>

<template>
  <div>
    <div
      v-if="files.length === 0"
      class="border-dashed border-2 border-gray-300 rounded-lg p-3 text-center flex flex-col items-center bg-primary/5"
    >
      <p class="mb-1 text-primary font-semibold text-sm leading-5">
        {{ anexoText }}
      </p>
      <p class="text-xs text-gray-500 text-primary font-normal leading-5">
        {{ instructionsText }}
      </p>
      <input
        ref="fileInputRef"
        id="file-upload"
        type="file"
        multiple
        @change="handleFileChange"
        class="hidden"
      />
      <div
        class="flex justify-center items-center mt-2 gap-2 cursor-pointer text-primary font-semibold text-sm leading-5"
        @click="triggerFileInput"
      >
        <ClipboardIcon class="h-5 w-5 text-gray-400" />
        <p>Abrir archivo</p>
      </div>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="border-2 border-green-500 rounded-lg flex items-center justify-between p-2"
      >
        <span class="text-gray-400 text-sm font-normal leading-5">{{
          file.name
        }}</span>
        <div class="flex items-center space-x-2">
          <CheckIcon class="h-6 w-6 text-green-500" />
          <TrashIcon
            class="h-6 w-6 text-red-500 cursor-pointer"
            @click="removeFile(index)"
          />
        </div>
      </div>
    </div>
    <!-- Mostrar el mensaje de error -->
    <p v-if="props.errorMessage" class="text-red-500 text-sm mt-2">
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.border-dashed {
  border-style: dashed;
}
</style>
