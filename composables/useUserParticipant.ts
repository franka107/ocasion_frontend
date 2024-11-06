import { useAPI } from "./useAPI";

const BASE_USER_URL = "/user-management";

export function useUserParticipantAPI(){
    const getParticipant = async (id: number | string) => {
        const { status, error, data } = await useAPI(
          `${BASE_USER_URL}/get-my-info`,
          {
            method: "GET",
            query: {
                id,
            },
          } as any
        );
      
        return {  status, error, data };
    };
    const editParticipant = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_USER_URL}/update-participant`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };

    const changeMyPassword = async (values: any) => {
        const { status, error }: any = await useAPI(
          `${BASE_USER_URL}/change-my-password`,
          {
            method: "POST",
            body: values,
          } as any
        );
      
        return { status, error };
    };
    

      return { editParticipant, changeMyPassword, getParticipant}
}

