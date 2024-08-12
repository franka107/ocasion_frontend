import { ref } from 'vue';

export function useSheetStore() {
  // Estado para identificar el contenido del sheet actual
  const currentSheet = ref<string | null>(null);

  // Función para abrir un Sheet específico
  function openSheet(sheetId: string) {
    console.log(sheetId);
    currentSheet.value = sheetId;
  }

  // Función para cerrar el Sheet
  function closeSheet() {
    currentSheet.value = null;
  }

  return {
    currentSheet,
    openSheet,
    closeSheet,
  };
}
