import type { IAdminsLItem } from '~/types/Administrators'
const BASE_ADM_URL = '/user-management'

export function useAdmins() {
  const page = ref(1)
  const filterOptions = ref('[]')
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      { field: 'type', type: 'like', value: 'PARTICIPANT' || '' },
    ]

    if (item.status) {
      filters.push({ field: 'status', type: 'equal', value: item.status })
    }

    filterOptions.value = JSON.stringify(filters)
    page.value = 1
  }

  const createUser = async (values: any) => {
    const { status, error }: any = await useAPI(`${BASE_ADM_URL}/create-user`, {
      method: 'POST',
      body: values,
    } as any)
    return { status, error }
  }

  const suspendUsers = async (values: { type: string; ids: string[] }) => {
    const { status, error }: any = await useAPI(
      `${BASE_ADM_URL}/suspend-users`,
      {
        method: 'POST',
        body: values,
      } as any,
    )

    return { status, error }
  }

  // const editUser = async (values: any) => {
  //   const { status, error }: any = await useAPI(`${BASE_ADM_URL}/update-user`, {
  //     method: "PUT",
  //     body: values,
  //   } as any);
  //   return { status, error };
  // };
  const editUser = async (values: any) => {
    const { status, error }: any = await useAPI(`${BASE_ADM_URL}/update-user`, {
      method: 'POST',
      body: values,
    } as any)
    return { status, error }
  }

  const resetUser = async (id: string) => {
    const { status, error }: any = await useAPI(
      `${BASE_ADM_URL}/reset-user-password`,
      {
        method: 'POST',
        body: {
          id,
        },
      } as any,
    )
    return { status, error }
  }

  const restoreUserPassword = async (email: string) => {
    const { status, error }: any = await useAPI(
      `auth-management/restore-user-password`,
      {
        method: 'POST',
        body: {
          email,
        },
      } as any,
    )
    return { status, error }
  }

  const recoveryUserPassword = async (email: string) => {
    const { status, error }: any = await useAPI(
      `auth-management/recovery-user-password`,
      {
        method: 'POST',
        body: {
          email,
        },
      } as any,
    )
    return { status, error }
  }

  const getUser = async (id: number | string) => {
    const { status, error, data } = await useAPI<IAdminsLItem>(
      `${BASE_ADM_URL}/get-user-detail`,
      {
        method: 'GET',
        query: {
          id,
        },
      } as any,
    )
    return { status, error, data }
  }

  return {
    page,
    onSearch,
    sortOptions,
    onSort,
    createUser,
    editUser,
    suspendUsers,
    resetUser,
    restoreUserPassword,
    getUser,
  }
}
