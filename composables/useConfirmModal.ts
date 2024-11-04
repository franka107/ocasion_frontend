const showModal = ref(false)
const confirmModalTitle = ref('')
const confirmModalIcon = ref<string | null>(null)
const confirmModalMessage = ref('')
const confirmIsSubmitting = ref(false)
const confirmModalCallback = ref(() => {})
const cancelModalCallback = ref<undefined | Function>(undefined)
const modalType = ref('success')

export function useConfirmModal() {
  const openConfirmModal = ({
    title,
    message,
    callback,
    cancelCallback,
    icon = null,
  }: {
    title: string
    message: string
    callback: () => Promise<void>
    cancelCallback?: () => void
    icon?: string | null
  }) => {
    modalType.value = 'confirm'
    confirmModalIcon.value = icon
    confirmModalTitle.value = title
    confirmModalMessage.value = message
    confirmModalCallback.value = async () => {
      confirmIsSubmitting.value = true
      await callback()
      confirmIsSubmitting.value = false
    }
    cancelModalCallback.value = cancelCallback
    showModal.value = true
  }
  const updateConfirmModal = ({
    title,
    message,
    type,
  }: {
    title: string
    message: string
    type: 'success' | 'error'
  }) => {
    confirmModalTitle.value = title
    confirmModalMessage.value = message
    modalType.value = type
  }

  const closeConfirmModal = () => {
    showModal.value = false
  }
  return {
    showModal,
    modalType,
    confirmModalTitle,
    confirmIsSubmitting,
    confirmModalMessage,
    confirmModalCallback,
    confirmModalIcon,
    cancelModalCallback,
    openConfirmModal,
    updateConfirmModal,
    closeConfirmModal,
  }
}
