<template>
  <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="max-w-full sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle class="text-lg font-bold text-gray-800">
          Archivos adjuntos
        </DialogTitle>
        <DialogDescription class="text-sm text-gray-500">
          Visualiza las imágenes cargadas en esta oferta.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <!-- Grid de imágenes -->
        <div
          v-if="attachments.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="attachment in attachments.slice(0, 5)"
            :key="attachment.id"
            class="flex flex-col items-center rounded-lg shadow hover:shadow-lg transition-shadow bg-white"
          >
            <!-- Miniatura de imagen -->
            <div
              v-if="isImage(attachment.name)"
              class="w-full h-36 overflow-hidden rounded-t-lg bg-gray-200"
            >
              <img
                :src="attachment.path"
                :alt="attachment.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Información del archivo -->
            <div class="p-2 w-full text-center">
              <p
                class="text-sm font-medium truncate w-full"
                :title="attachment.name"
              >
                {{ attachment.name }}
              </p>
              <Button
                class="mt-2 w-full text-primary-950 hover:text-blue-800"
                variant="outline"
                size="sm"
                @click="openAttachment(attachment.path)"
              >
               Ver en pantalla completa
              </Button>
            </div>
          </div>
        </div>

        <!-- Mensaje de no archivos -->
        <div v-else class="text-center text-gray-500">
          No hay imágenes adjuntas para esta oferta.
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-vue-next";

const props = defineProps<{
  isOpen: boolean;
  attachments: Array<{
    id: string;
    path: string; // URL del archivo
    name: string; // Nombre del archivo
  }>;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();

// Función para determinar si es una imagen
const isImage = (filename: string) => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ];
  return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

// Función para abrir el archivo en una nueva pestaña
const openAttachment = (url: string) => {
  window.open(url, "_blank");
};
</script>
