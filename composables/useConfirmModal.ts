const showModal = ref(false);
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalCallback = ref(() => {});
const cancelModalCallback = ref<undefined | Function>(undefined);
const modalType = ref('success');

export function useConfirmModal () {
    
    const openConfirmModal = ({title, message, callback, cancelCallback }: { title: string, message: string, callback: () => void, cancelCallback?: () => void,}) => {
        modalType.value = 'confirm';
        confirmModalTitle.value = title;
        confirmModalMessage.value = message;
        confirmModalCallback.value = callback;
        cancelModalCallback.value = cancelCallback;
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
        cancelModalCallback,
        openConfirmModal,
        updateConfirmModal,
        closeConfirmModal
    };
}
