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
    type: Array as () => string[],
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

const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { status, data }: any = await useAPI("/files/upload", {
      method: "POST",
      body: formData,
    } as any);

    console.log("File uploaded successfully:", data.value.file);
    return data.value.file.id;
  } catch (error) {
    console.error("An error occurred during file upload:", error);
    throw new Error("File upload failed due to an error");
  }
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const newFiles = Array.from(input.files).slice(0, 3 - files.value.length); // Limitar a 3 archivos
    const newFileIds: string[] = [];

    for (const file of newFiles) {
      try {
        const fileId = await uploadFile(file); // Subir el archivo
        files.value.push(file); // Agregar el archivo a la lista de archivos
        props.modelValue.push(fileId); // Agregar el ID del archivo a modelValue
        newFileIds.push(fileId); // Agregar solo el ID del archivo a la lista de IDs
      } catch (error) {
        console.error(error);
      }
    }
    // emit("update:modelValue", props.modelValue); // Emitir los IDs actualizados
    emit("update:modelValue", newFileIds); // Emitir los IDs actualizados
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  props.modelValue.splice(index, 1); // Eliminar el ID correspondiente en modelValue
  emit("update:modelValue", props.modelValue); // Emitir los IDs actualizados
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
