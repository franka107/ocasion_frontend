<template>
  <ContentLayout title="Mi perfil">
    <CustomSimpleCard title="Abonos" class="mb-6" sub-title="..." />
    <section>
      <div class="w-full mt-4">
        <template v-if="userDetail.personType === 'NATURAL_PERSON'">
          <NaturalPersonForm :userDetail="userDetail" :on-edit="handleEdit" />
        </template>
        <template v-else-if="userDetail.personType === 'JURIDIC_PERSON'">
          <LegalPersonForm :userDetail="userDetail" :on-edit="handleEdit" />
        </template>
        <PasswordForm
          :userDetail="userDetail"
          :on-password="handleChangeMyPassword"
          :on-restore="handleResetPassword"
        />
      </div>
    </section>
  </ContentLayout>
</template>

<script setup lang="ts">
import ContentLayout from '~/layouts/default/ContentLayout.vue'
import PasswordForm from '~/components/profile/PasswordForm.vue'
import NaturalPersonForm from '~/components/profile/NaturalPersonForm.vue'
import LegalPersonForm from '~/components/profile/LegalPersonForm.vue'
const { openConfirmModal, updateConfirmModal } = useConfirmModal()
const { editParticipant, changeMyPassword } = useUserParticipantAPI()
const openUserModal = ref(false)
const { restoreUserPassword } = useAdmins()
const BASE_USER_URL = '/auth-management'
const { data: userDetail, refresh }: any = await useAPI<any>(
  `${BASE_USER_URL}/get-my-info`,
  {
    query: {},
    default: () => ({}),
  },
)
userDetail.value = userDetail.value
const handleEdit = async (values: any) => {
  openConfirmModal({
    title: 'Actualizar este usuario',
    message: '¿Estás seguro de que deseas actualizar este usuario?',
    callback: async () => {
      const { status, error }: any = await editParticipant(values)
      if (status.value === 'success') {
        openUserModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Usuario actualizado',
          message: 'El usuario ha sido actualizado exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El usuario no se pudo actualizar, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al actualizar información de usuario',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}

const handleChangeMyPassword = async (values: any) => {
  openConfirmModal({
    title: 'Cambiar contraseña de usuario',
    message: '¿Estás seguro de que deseas cambiar tu contraseña de usuario?',
    callback: async () => {
      const { status, error }: any = await changeMyPassword(values)
      if (status.value === 'success') {
        openUserModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Contraseña de usuario actualizada',
          message: 'El usuario ha cambiado la contraseña exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El usuario no pudo cambiar la contraseña , intentalo más tarde'
        updateConfirmModal({
          title: 'Error al cambiar contraseña de usuario',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
const handleResetPassword = async (email: string) => {
  openConfirmModal({
    title: 'Restablecer contraseña de usuario',
    message: '¿Estás seguro de que deseas restablecer contraseña de usuario?',
    callback: async () => {
      console.log('')
      const { status, error }: any = await restoreUserPassword(email)
      if (status.value === 'success') {
        openUserModal.value = false
        refresh()
        updateConfirmModal({
          title: 'Contraseña de usuario restablecida',
          message: 'El usuario ha restablecido la contraseña exitosamente',
          type: 'success',
        })
      } else {
        const eMsg =
          error.value.data?.errors?.[0].message ||
          error.value.data.message ||
          'El usuario no se pudo restablecer la contraseña de usuario, intentalo más tarde'
        updateConfirmModal({
          title: 'Error al restablecer contraseña de usuario',
          message: eMsg,
          type: 'error',
        })
      }
    },
  })
}
</script>
