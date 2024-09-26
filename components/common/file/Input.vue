<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { CheckIcon, TrashIcon, ClipboardIcon } from "@radix-icons/vue";

const props = defineProps({
  title: {
    type: String,
    default: "Anexos",
  },
  instructionsText: {
    type: String,
    default: "Cargar máximo hasta 3 archivos (xlsx, docx o pdf)",
  },
  modelValue: {
    type: Array as () => { id: string; path: string }[],
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: "",
  },
  limitFiles: {
    type: Number,
    default: 3,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideRemoveIcon: {
    type: Boolean,
    default: false,
  },
});

const files = ref<{ id: string; path: string; name: string }[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const emit = defineEmits(["update:modelValue"]);

const uploadedFiles = computed(() =>
  files.value.map((file) => ({ id: file.id, path: file.path })),
);

const uploadFile = async (
  file: File,
): Promise<{ id: string; path: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { status, data }: any = await useAPI("/files/upload", {
      method: "POST",
      body: formData,
    } as any);

    console.log("File uploaded successfully:", data.value.file);
    return { id: data.value.file.id, path: data.value.file.path };
  } catch (error) {
    console.error("An error occurred during file upload:", error);
    throw new Error("File upload failed due to an error");
  }
};

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  console.log(`handleFileChange event files length`, input.files?.length);
  console.log(`handleFileChange ref files length`, files.value.length);

  if (input.files) {
    const newFiles = Array.from(input.files).slice(
      0,
      props.limitFiles - files.value.length,
    );
    for (const file of newFiles) {
      try {
        const fileData = await uploadFile(file);
        files.value.push({ ...fileData, name: file.name });
      } catch (error) {
        console.error(error);
      }
    }
    emit("update:modelValue", uploadedFiles.value); // Emitimos los datos de los archivos actualizados
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit("update:modelValue", uploadedFiles.value); // Actualizamos el modelValue después de eliminar el archivo
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// Obtener nombre de archivo desde la ruta
const getFileNameFromPath = (path: string): string => {
  return path.split("/").pop() || "Unknown file";
};

// Inicializamos los archivos existentes en el montaje
onMounted(() => {
  files.value = props.modelValue.map((fileData) => ({
    ...fileData,
    name: getFileNameFromPath(fileData.path),
  }));
});
</script>

<template>
  <div>
    <div
      v-if="!disabled"
      class="border-dashed border-2 mb-2 border-gray-300 rounded-lg p-3 text-center flex flex-col items-center bg-primary/5"
    >
      <p class="mb-1 text-primary font-semibold text-sm leading-5">
        {{ title }}
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

    <div class="space-y-2">
      <div
        v-for="(file, index) in files"
        :key="file.id"
        class="border-2 border-[#22c55d] rounded-lg flex items-center justify-between p-2"
      >
        <span class="text-gray-400 text-sm font-normal leading-5">
          {{ file.name }}
        </span>
        <div class="flex items-center space-x-2">
          <CheckIcon class="h-6 w-6 text-[#22c55d]" />
          <TrashIcon
            v-if="!hideRemoveIcon"
            class="h-6 w-6 text-red-500 cursor-pointer"
            @click="removeFile(index)"
          />
        </div>
      </div>
    </div>

    <!-- Mostrar el mensaje de error -->
    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.border-dashed {
  border-style: dashed;
}
</style>
