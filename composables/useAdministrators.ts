import type { IAdminsLItem } from "~/types/Administrators"

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
        { field: 'type', type: 'like', value:"PARTICIPANT" || '' },

      ];
    
      if (item.status) {
        filters.push({ field: 'status', type: 'equal', value: item.status });
      }
    
      filterOptions.value = JSON.stringify(filters);
    };

    const createUser = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_ADM_URL}/create-user`,
          {
            method: "POST",
            body: values,
          } as any
        );
        return {status, error}
    }

    const suspendUser = async (id: string) => {
        const { status, error }: any = await useAPI(
          `${BASE_ADM_URL}/suspend-user`,
          {
            method: "POST",
            body: {
              id, 
            }
          } as any);
          return {status, error}
    }

    const editUser = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_ADM_URL}/update-user`,
          {
            method: "PUT",
            body: values,
          } as any
        );
        return { status, error}
    };       

  return { page, onSearch, sortOptions, onSort, createUser, editUser, suspendUser}
}