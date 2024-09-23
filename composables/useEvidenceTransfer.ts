import { useAPI } from "./useAPI";

const BASE_EVIDENCE_URL = "/transference-management";

export function useEvidenceTransferAPI(){
    const page = ref(1);
    const sortOptions = ref("[]");
    const onSort = (sortObject: { [key: string]: string }[]) => {
        sortOptions.value = JSON.stringify(sortObject);
      };
    const getTransference = async (values: { id: number | string; files: string[]; status: string }) => {
        const { status, error }: any = await useAPI(
          `${BASE_EVIDENCE_URL}/get-transference-support-detail`,
          {
            method: "GET",
            query: {
                id: values.id,
                files: values.files.join(','),  
                status: values.status,
            },
          } as any
        );
      
        return { status, error };
    };

    const confirmTransference = async (values: {  transferenceSupportId: string }) => {
        const { status, error }: any = await useAPI(
          `${BASE_EVIDENCE_URL}/confirm-transference-support`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };

    const editTransference = async (values: any ) => {
        const { status, error }: any = await useAPI(
          `${BASE_EVIDENCE_URL}/update-transference-support`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };
    

      return {getTransference , confirmTransference , sortOptions, editTransference, page, onSort }
}

