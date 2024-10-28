import type { IRoleItem } from '~/types/Roles'

export function useRoles() {
  const BASE_ROLE_URL = '/role-configuration'

  const page = ref(1)
  const filterOptions = ref('[]')
  const sortOptions = ref('[]')

  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      { field: 'name', type: 'like', value: item.name || '' },
      { field: 'status', type: 'equal', value: item.status || '' },
    ]
    filterOptions.value = JSON.stringify(filters)
  }

  const deleteRole = async (roleId: string) => {
    const { status, error }: any = await useAPI(
      `${BASE_ROLE_URL}/delete-role`,
      {
        method: 'POST',
        body: {
          id: roleId,
        },
      } as any,
    )
    return { status, error }
  }

  const createRole = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ROLE_URL}/create-role`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const editRole = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ROLE_URL}/update-role`,
      {
        method: 'PUT',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const getRole = async (id: number | string) => {
    const { status, error, data } = await useAPI<IRoleItem>(
      `${BASE_ROLE_URL}/get-role-detail`,
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
    filterOptions,
    sortOptions,
    onSort,
    onSearch,
    deleteRole,
    createRole,
    editRole,
    getRole,
  }
}
