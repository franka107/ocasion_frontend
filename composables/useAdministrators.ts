import type { IAdminsLItem } from "~/types/Administrators"
const BASE_ADM_URL = '/user-management'
interface AdministratorsForm extends IAdminsLItem {
  roles?: string[];
}

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
            method: "POST",
            body: values,
          } as any
        );
        return { status, error}
    }; 

    const resetUser = async (id: string) => {
      const { status, error }: any = await useAPI(
        `${BASE_ADM_URL}/reset-user-password`,
        {
          method: "POST",
          body: {
            id, 
          }
        } as any
      );
      return { status, error}
    };

    const getUser = async (id: number | string) => {
      const { status, error, data } = await useAPI<AdministratorsForm>(
        `${BASE_ADM_URL}/get-user-detail`,
        {
          method: "GET",
          query: {
            id,
          },
        } as any
      );
      return { status, error, data}
    };
    const getExportUser = async (filterOptions: string) => {
      const { status, error, data }: any = await useAPI(
        `${BASE_ADM_URL}/export-users`,
        {
          query: {
            filterOptions: filterOptions,
          },
          method: "GET",
          responseType: "blob", 
        } as any
      );
  
      if (status === 200 && data) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users_export.csv'); 
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
  
      return { status, error };
    };

  return { page, onSearch, sortOptions, onSort, createUser, editUser, suspendUser, resetUser, getUser, getExportUser}
}