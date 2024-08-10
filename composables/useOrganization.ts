
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
    
  const onSearch = (item: {[key: string]: string }) => {
      const filters = [
        { field: 'rucNumber', type: 'like', value: item.rucNumber || '' },
        { field: 'name', type: 'like', value: item.name || '' },
      ]
      if(item.status) {
        filters.push({ field: 'status', type: 'equal', value: item.status })
      }
      filterOptions.value = JSON.stringify(filters)
  }
    
  const suspendOrganization = async (rucNumber: string) => {
    console.log("rucNumber", rucNumber);

    const { status: suspendStatus }: any = await useAPI(
      `${BASE_ORG_URL}/suspend-organization`,
      {
        method: "POST",
        body: {
          rucNumber, 
        }
      } as any);
  }

  const activateOrganization = async (rucNumber: string) => {
    console.log("rucNumber", rucNumber);

    const { status: activateStatus }: any = await useAPI(
      `${BASE_ORG_URL}/activate-organization`,
      {
        method: "POST",
        body: {
          rucNumber,
        },
      } as any
    );
  }

  const createOrganization = async (values: any) => {
    try {
      const { status: createStatus }: any = await useAPI(
        `${BASE_ORG_URL}/create-organization`,
        {
          method: "POST",
          body: values,
        } as any
      );
      if (createStatus === 201) {
        console.log("Organización creada exitosamente");
      }
    } catch (error) {
      console.error("Error al crear la organización", error);
    }
  }
  
  const editOrganization = async (values: any) => {
    try {
      const { status: updateStatus }: any = await useAPI(
        `${BASE_ORG_URL}/update-organization`,
        {
          method: "PUT",
          body: values,
        } as any
      );
      console.log("Organización actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar la organización", error);
    }
  };
  return { page, filterOptions, sortOptions, onSort, onSearch, suspendOrganization, activateOrganization, createOrganization, editOrganization }
}