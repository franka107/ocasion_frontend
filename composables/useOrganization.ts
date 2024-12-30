// by convention, composable function names start with "use"
export function useOrganization() {
  const BASE_ORG_URL = '/organization-management'
  // state encapsulated and managed by the composable
  const page = ref(1)
  const filterOptions = ref('[]')
  const sortOptions = ref('[]')
  const onSort = (sortObject: { [key: string]: string }[]) => {
    sortOptions.value = JSON.stringify(sortObject)
  }

  const onSearch = (item: { [key: string]: string }) => {
    const filters = [
      { field: 'id', type: 'like', value: item.id || '' },
      { field: 'name', type: 'like', value: item.name || '' },
    ]
    if (item.status) {
      filters.push({ field: 'status', type: 'equal', value: item.status })
    }
    filterOptions.value = JSON.stringify(filters)
  }

  const suspendOrganization = async (id: string) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/suspend-organization`,
      {
        method: 'POST',
        body: {
          id,
        },
      } as any,
    )
    return { status, error }
  }

  const assignAdministrator = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/assign-administrator`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const activateOrganization = async (id: string) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/activate-organization`,
      {
        method: 'POST',
        body: {
          id,
        },
      } as any,
    )
    return { status, error }
  }

  const viewOrganizationIdAndNameList = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/view-organization-id-and-name-list`,
      {
        method: 'GET',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const createOrganization = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/create-organization`,
      {
        method: 'POST',
        body: values,
      } as any,
    )
    return { status, error }
  }

  const editOrganization = async (values: any) => {
    const { status, error }: any = await useAPI(
      `${BASE_ORG_URL}/update-organization`,
      {
        method: 'PUT',
        body: values,
      } as any,
    )
    return { status, error }
  }
  return {
    page,
    filterOptions,
    sortOptions,
    onSort,
    onSearch,
    suspendOrganization,
    activateOrganization,
    viewOrganizationIdAndNameList,
    createOrganization,
    editOrganization,
    assignAdministrator,
  }
}
