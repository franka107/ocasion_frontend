<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon, TrashIcon, ClipboardIcon  } from '@radix-icons/vue'
import { X,ExternalLink } from 'lucide-vue-next'
const props = defineProps({
  title: {
    type: String,
    default: 'Anexos',
  },
  instructionsText: {
    type: String,
    default: 'Cargar máximo hasta 3 archivos (xlsx, docx o pdf)',
  },
  modelValue: {
    // type: Array as () => string[],
    type: Array as () => { id: string; path: string }[],
    default: () => [],
  },
  errorMessage: {
    type: String,
    default: '',
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
  acceptedFileTypes: {
    type: Array as () => string[],
    default: () => ['.xlsx', '.docx', '.pdf'],
  },
})

// const files = ref<File[]>([]);
const files = ref<{ id: string; path: string; name: string }[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const emit = defineEmits(['update:modelValue'])
const { uploadApiUrl } = useRuntimeConfig().public

// const uploadFile = async (file: File): Promise<string> => {
const uploadFile = async (
  file: File,
): Promise<{ id: string; path: string }> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { status, data }: any = await useAPI(uploadApiUrl, {
      method: 'POST',
      body: formData,
    } as any)

    console.log('File uploaded successfully:', data.value.file)
    // return data.value.file.id;
    return { id: data.value.file.id, path: data.value.file.path }
  } catch (error) {
    console.error('An error occurred during file upload:', error)
    throw new Error('File upload failed due to an error')
  }
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const newFiles = Array.from(input.files).slice(
      0,
      props.limitFiles - files.value.length,
    ) // Limitar a 3 archivos
    const newFileIds: { id: string; path: string }[] = []
    // const newFileData: { id: string; path: string }[] = [];
    isLoading.value = true

    for (const file of newFiles) {
      try {
        // const fileId = await uploadFile(file); // Subir el archivo
        const fileData = await uploadFile(file) // Subir el archivo
        const fileName = file.name // Nombre del archivo subido
        files.value.push({ ...fileData, name: fileName }) // Agregar el archivo a la lista con nombre
        props.modelValue.push(fileData) // Agregar el ID del archivo a modelValue
        newFileIds.push({ id: fileData.id, path: fileData.path }) // Agregar solo el ID del archivo a la lista de IDs
        // newFileIds.push(fileId); // Agregar solo el ID del archivo a la lista de IDs
        // newFileData.push(fileData); // Agregar el objeto con id y path a la lista de datos
      } catch (error) {
        console.error(error)
      }
    }
    isLoading.value = false
    console.log('emitiending')
    emit('update:modelValue', [...files.value]) // Emitir los IDs actualizados
    // emit("update:modelValue", newFileData); // Emitir los datos actualizados
  }
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  props.modelValue.splice(index, 1) // Eliminar el ID correspondiente en modelValue
  emit('update:modelValue', props.modelValue) // Emitir los IDs actualizados
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// watch(files.value, (newVal) => {
//   console.log(newVal)
// })
const getFileNameFromPath = (path: string): string => {
  return path.split('/').pop() || 'Unknown file' // Obtén el nombre del archivo desde la URL
}
const viewFile = (file: { id: string; path: string }) => {

  if (file.path) {

    window.open(file.path, '_blank')
  } else {
    console.error('No se puede abrir el archivo. Ruta no válida.');
  }
}


// Inicializa los archivos existentes
onMounted(() => {
  files.value = props.modelValue.map((fileData) => ({
    ...fileData,
    name: getFileNameFromPath(fileData.path || ''),
  }))
})
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
        id="file-upload"
        ref="fileInputRef"
        type="file"
        multiple
        class="hidden"
        :accept="props.acceptedFileTypes.join(',')"
        @change="handleFileChange"
      />
      <div
        class="flex justify-center items-center mt-2 gap-2 cursor-pointer text-primary font-semibold text-sm leading-5"
        @click="triggerFileInput"
      >
        <ClipboardIcon class="h-5 w-5 text-gray-400" />
        <p>Abrir archivo</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center mt-2 space-y-2">
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"
      ></div>
      <p class="text-green-500 font-semibold text-sm">Subiendo archivos...</p>
    </div>

    <div class="space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="border-2 border-[#22c55d] rounded-lg flex items-center justify-between p-2"
      >
        <span class="text-gray-400 text-sm font-normal leading-5">{{
          file.name
        }}</span>
        <div class="flex items-center space-x-2">
          <ExternalLink class="h-6 w-6 text-blue-500 cursor-pointer" @click="viewFile(file)" />
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
