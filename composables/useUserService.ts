import type { UserDtoV2 } from '~/components/participant/form/ParticipantForm.vue'

export const useUserService = () => {
  const viewUserDetailById = async (id: string) => {
    const request = await useAPI<UserDtoV2>(`user-management/user/${id}`, {
      method: 'GET',
    } as any)
    return request
  }

  const update = async (id: string, body: UserDtoV2) => {
    const request = await useAPI(`user-management/user/${id}`, {
      method: 'PATCH',
      body,
    } as any)
    return request
  }

  return {
    viewUserDetailById,
    update,
  }
}
