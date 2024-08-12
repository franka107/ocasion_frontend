const showModal = ref(false);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalCallback = ref(() => {});
const modalType = ref('success');

export function useConfirmModal () {
    
    const openConfirmModal = ({title, message, callback}: { title: string, message: string, callback: () => void}) => {
        modalType.value = 'confirm';
        confirmModalTitle.value = title;
        confirmModalMessage.value = message;
        confirmModalCallback.value = callback;
        showModal.value = true;
    };
    const updateConfirmModal = ({title, message, type}: { title: string, message: string, type: 'success' | 'error' }) => {
        confirmModalTitle.value = title;
        confirmModalMessage.value = message;
        modalType.value = type;
    }
    
    const closeConfirmModal = () => {
        showModal.value = false;
    };
    return {
        showModal,
        modalType,
        confirmModalTitle,
        confirmModalMessage,
        confirmModalCallback,
        openConfirmModal,
        updateConfirmModal,
        closeConfirmModal
    };
}
