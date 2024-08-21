import { ref, computed } from "vue";

export function useSidebarToggle() {
  const isOpen = ref(false);


  const setIsOpen = () => {
    isOpen.value = !isOpen.value;
  };

  return {
    isOpen,
    setIsOpen,
  };
}
