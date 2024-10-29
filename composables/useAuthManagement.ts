import type { GrantId } from '~/types/Grant'

const AUTH_MANAGEMENT_BASE_URL = '/auth-management'

export function useAuthManagement() {
  const getMyGrants = async () => {
    const { status, error, data, refresh } = await useAPI<GrantId[]>(
      `${AUTH_MANAGEMENT_BASE_URL}/get-my-grants`,
      {
        method: 'GET',
      } as any,
      true,
    )
    const emptyGrants = ref([])
    return { status, error, data: data.value ? data : emptyGrants, refresh }
  }

  const authSignIn = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${AUTH_MANAGEMENT_BASE_URL}/register-participant`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  return { getMyGrants, authSignIn }
}
