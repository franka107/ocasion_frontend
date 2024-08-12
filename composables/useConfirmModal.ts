const showModal = ref(false);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalCallback = ref(() => {});

export function useConfirmModal () {
    
    const openConfirmModal = (title: string, message: string, callback: () => void) => {
        confirmModalTitle.value = title;
        confirmModalMessage.value = message;
        confirmModalCallback.value = callback;
        showModal.value = true;
    };
    
    const closeConfirmModal = () => {
        showModal.value = false;
    };
    return {
        showModal,
        confirmModalTitle,
        confirmModalMessage,
        confirmModalCallback,
        openConfirmModal,
        closeConfirmModal,
    };
}
