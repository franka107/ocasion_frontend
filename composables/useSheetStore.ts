import { ref } from 'vue';

export const useSheetStore = () => {
  const currentSheet = ref<string | null>(null);
  const isOpen = ref(false); // Nuevo estado para manejar la apertura y cierre del Sheet

  const openSheet = (sheetId: string) => {
    if (currentSheet.value !== sheetId || !isOpen.value) {
      currentSheet.value = sheetId;
      isOpen.value = true;
      console.log("Sheet opened:", sheetId);
    }
  };

  const closeSheet = () => {
    if (isOpen.value) {
      isOpen.value = false;
      currentSheet.value = "";
      console.log("Sheet closed");
    }
  };

  return {
    currentSheet,
    isOpen,
    openSheet,
    closeSheet,
  };
};
